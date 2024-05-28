/* eslint-disable no-await-in-loop */
/* 
 * All the function in this file
 * should be returning the following schema
 * 

    {
        difficulty: '18',
        gasLimit: 20000000,
        gasUsed: 8735971,
        hash: '0xe83e90d6d8082b00a2e56f24503d45dd5d606ee2236ef623271d516cf4b3e881',
        miner: '0x0000000000000000000000000000000000000000',
        nonce: '0x0000000000000000',
        number: 14778266,
        parentHash: '0x53becf37a015fe10e125624e3e5983aa6b65b8bbc93ae4a27a5e2e308cb03a36',
        size: 48092,
        timestamp: 1621642277,
        totalDifficulty: '146781860',
        transactions: [
            '0x8a873e6ddda435f4a6cbb88622cd44af7df67b86700135b43680d544de7432ab',
            '0xc50950ea0e4710164bfeecd827a9e2aae12dc432f9166d170e04cf89557cf17f',
            '0x600c25857eac41c43a0ff8083a943842abaac46239057a8b3c246ca0c14a9b6a',
            '0x8febde78c2caf810f39155e4b3075d4c97231433f7244cb9a31d676a92988eb4',
            '0xb2def1d911ed296226021cedfba49ca888f655d3f210ec7ffb259f8f2f11a21c',
            '0x7b0caef12cf2d1f034fc3c16ca31b3b0c4276ed071412fcdfc6a8a4949e09c32'
        ],
        transactionsRoot: '0x51c0a9395f987a5bc77e449a56d7ec6860fb24655b48d0721a7f436ef09ea460',
        uncles: []
    }
 */

const Web3 = require("web3");
const axios = require('axios');
const { TonClient4 } = require('@ton/ton');
const { getHttpV4Endpoint } = require("@orbs-network/ton-access");
const errorMessage = require('../../../common/configuration/errorMessage.json');
const config = require('../../../common/configuration/config.json');
const { getStartAndEndBlocks } = require('../../../common/historicalTxsCommon');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const { getTransactionEvm } = require('./getTransaction');

const throwErrorMessage = (msg) => ({
  'message': errorMessage.error.message[msg],
  'code': errorMessage.error.code.invalidInput
});

const processTxInParallel = async (chunk, func) => {
  const blockDetailsPromises = chunk.map(func);
  return Promise.all(blockDetailsPromises);
 };
 
 const parallelCallByChunks = async (func, chunkSize, range) => {
  const response = [];
 
  for (let i = 0; i < range.length; i += chunkSize) {
     const chunk = range.slice(i, i + chunkSize);
     const chunkDetails = await processTxInParallel(chunk, func);
     response.push(...chunkDetails);
     if (i + chunkSize < range.length) {
      // eslint-disable-next-line no-promise-executor-return
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  };
  return response;
 };
 

module.exports = {

  getLatestBlockNumberEvm: async (evmWeb3) => {
    /*
     * Function will fetch the latest block number from ethereum based chains
     */

    const blockNumber = await evmWeb3.eth.getBlockNumber();
    return (blockNumber);
  },

  getBlockEvm: async (evmWeb3, options) => {
    /*
     * Function will fetch the block metadata for particular block or historical blocks
     */
    let { endBlock, startBlock } = options;
    const filterOptions = {...options,
       ...(endBlock && {"endBlock": Number(endBlock).toString()}),
    };

    filterOptions.function = "getEvmBlock()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
      return (validJson);
    }

    const { chainId, blockNumber } = filterOptions;
    const { defaultBlockRange, chunkSize } = config.historicalBlocks;


    const getEvmBlock = async (bNumber, web3) => {
      const block = await web3.eth.getBlock(bNumber);
      if (!block) return throwErrorMessage("invalidBlockNumber");

      delete block?.sha3Uncles;
      delete block?.stateRoot;

      const getTransaction = async (txHash) => {
        const tx = await getTransactionEvm(web3, { transactionHash: txHash, chainId });
        if (tx.code === "400") {
          throw new Error("Too many requests"); 
        }
        return tx;
      };

      const transactionsDetails = await parallelCallByChunks(getTransaction, chunkSize, block.transactions);
      block.transactions = transactionsDetails;

      return block;
    };

    // If only blocknumber is given
    if (blockNumber && !startBlock && !endBlock) {
      return getEvmBlock(blockNumber, evmWeb3);
    };

    // If block range is given

    // Checking if the rpc is of quicknode or not
    if (!evmWeb3._requestManager?.provider?.host.includes("quiknode")) return throwErrorMessage("notApplicable");

    startBlock = Number(startBlock);
    endBlock = (Number(endBlock) + 1);

    const currentBlock = await evmWeb3.eth.getBlockNumber();

    if (startBlock > (endBlock - 1)) return throwErrorMessage("invalidStartEndBlock");
    if (startBlock > currentBlock || (endBlock - 1) > currentBlock) return throwErrorMessage('invalidStartOrEndBlock');
    if ((endBlock - startBlock) > Number(defaultBlockRange)) return throwErrorMessage('invalidBlockRange');

    const { fromBlock, toBlock } = getStartAndEndBlocks(startBlock, endBlock, currentBlock, defaultBlockRange);
    const blockRange = Array.from({ length: (Number(toBlock) - Number(fromBlock)) }, (_, index) => Number(fromBlock) + index);

    const blockDetails = [];

    if (chainId === "1") {
      // Splitting block range into 2 parts and resolving them from cherry server and quiknode RPC
      const cherryWeb3 = new Web3(config.cherryServerURL);

      for (let i = 0; i < blockRange.length; i += 2) {
        try {
          const [resultQN, resultCS] = await Promise.all([getEvmBlock(blockRange[i], evmWeb3),
          (blockRange.length > i + 1) && getEvmBlock(blockRange[i + 1], cherryWeb3)]);
          blockDetails.push(resultQN);
          if (resultCS) blockDetails.push(resultCS);
        } catch (error) {
          // Fallback to evmWeb3 for the failed block
          try {
            const resultQNFallback = await getEvmBlock(blockRange[i], evmWeb3);
            blockDetails.push(resultQNFallback);
            const resultCSFallback = (blockRange.length > i + 1) ? await getEvmBlock(blockRange[i + 1], evmWeb3) : false;
            if (resultCSFallback) blockDetails.push(resultCSFallback);
          } catch (err) {
            return throwErrorMessage("tooManyRequests");
          }
        }
      }
    } else {
      for (const block of blockRange) {
          const blockDetail = await getEvmBlock(block, evmWeb3);
          blockDetails.push(blockDetail);
      }
    }

    return { blocks: blockDetails };
  },

  getBlockAVAX: async () => throwErrorMessage("notApplicable"),

  getBlockSolana: async (solanaWeb3, options) => {
    /*
     * Function will fetch the block metadata from solana
     */
    try {
      const filterOptions = options;
      filterOptions.function = "getBlock()";
      const validJson = await schemaValidator.validateInput(filterOptions);

      if (!validJson.valid) {
        return (validJson);
      }

      const { blockNumber } = filterOptions;
      const block = await solanaWeb3.getBlock(Number(blockNumber), {
        maxSupportedTransactionVersion: 0
      });
      const response = {};

      response.difficulty = null;
      response.gasLimit = null;
      response.gasUsed = null;
      response.hash = block.blockhash;
      response.miner = null;
      response.nonce = null;
      response.number = Number(blockNumber);
      response.parentHash = block.previousBlockhash;
      response.size = null;
      response.timestamp = block.blockTime;
      response.totalDifficulty = null;
      response.transactions = block.transactions;
      response.transactionsRoot = null;
      response.uncles = null;

      return (response);
    } catch (error) {
      return throwErrorMessage("invalidBlockNumber");
    }
  },


  getBlockTerra: async (terraWeb3, options) => {
    /*
     * Function will fetch the block metadata from Terra
     */

    const filterOptions = options;
    filterOptions.function = "getBlock()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
      return (validJson);
    }

    const { blockNumber } = filterOptions;

    const block = await terraWeb3.tendermint.blockInfo(blockNumber);
    if (!block) return {
      'message': errorMessage.error.message.invalidBlockNumber,
      'code': errorMessage.error.code.invalidInput
    };
    const response = {};

    response.difficulty = null;
    response.gasLimit = null;
    response.gasUsed = null;
    response.hash = block.block_id.hash;
    response.miner = block.block.header.validators_hash;
    response.nonce = null;
    response.number = block.block.header.height;
    response.parentHash = block.block_id.part_set_header.hash;
    response.size = null;
    response.timestamp = block.block.header.time;
    response.totalDifficulty = null;
    response.transactions = block.block.data.txs;
    response.transactionsRoot = null;
    response.uncles = null;

    return (response);
  },


  getBlockTron: async (tronWeb3, options) => {
    /*
     * Function will fetch the block metadata from Tron
     */

    const filterOptions = options;
    filterOptions.function = "getBlock()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
      return (validJson);
    }

    const { blockNumber } = filterOptions;

    const block = await tronWeb3.trx.getBlock(blockNumber);
    if (!block) return {
      'message': errorMessage.error.message.invalidBlockNumber,
      'code': errorMessage.error.code.invalidInput
    };
    const response = {};

    response.difficulty = null;
    response.gasLimit = null;
    response.gasUsed = null;
    response.hash = block.block_header.raw_data.txTrieRoot;
    response.miner = block.block_header.raw_data.witness_address;
    response.nonce = null;
    response.number = block.block_header.raw_data.witness_address.number;
    response.parentHash = block.block_header.raw_data.witness_address.parentHash;
    response.size = null;
    response.timestamp = block.block_header.raw_data.witness_address.timestamp;
    response.totalDifficulty = null;
    response.transactions = block.transactions;
    response.transactionsRoot = null;
    response.uncles = null;

    return (response);
  },

  getBlockNear: async (nearWeb3, options) => {
    /*
     * Function will fetch the block metadata from Near
     */

    const filterOptions = options;
    filterOptions.function = "getBlock()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
      return (validJson);
    };

    const { blockNumber } = filterOptions;
    const block = await nearWeb3.connection.provider.block({ blockId: Number(blockNumber) });

    if (!block) return {
      'message': errorMessage.error.message.invalidBlockNumber,
      'code': errorMessage.error.code.invalidInput
    };
    const response = {};

    response.difficulty = null;
    response.gasLimit = null;
    response.gasUsed = block.header.gas_price;
    response.hash = block.header.hash;
    response.miner = null;
    response.nonce = null;
    response.number = blockNumber;
    response.parentHash = block.header.prev_hash;
    response.size = null;
    response.timestamp = block.header.timestamp;
    response.totalDifficulty = null;
    response.transactions = block.chunks;
    response.transactionsRoot = block.header.block_merkle_root;
    response.uncles = null;

    return (response);
  },


  getBlockAlgorand: async (algorandWeb3, options) => {
    /*
     * Function will fetch the block metadata from Algorand
     */

    const filterOptions = options;
    filterOptions.function = "getBlock()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
      return (validJson);
    }

    const { blockNumber } = filterOptions;
    try {
      const block = await axios.get(
        `${config.chains[options.chainId].rpc}block/${blockNumber}?apiKey=${config.chains[options.chainId].key}`
      );
      const response = {};

      response.difficulty = null;
      response.gasLimit = null;
      response.gasUsed = null;
      response.hash = null;
      response.miner = null;
      response.nonce = null;
      response.number = options.blockNumber;
      response.parentHash = block.data.parent_id;
      response.size = null;
      response.timestamp = block.data.date;
      response.totalDifficulty = null;
      response.transactions = block.data.txs;
      response.transactionsRoot = null;
      response.uncles = null;

      return (response);
    }
    catch (err) {
      return {
        'message': errorMessage.error.message.invalidBlockNumber,
        'code': errorMessage.error.code.invalidInput
      };
    }
  },

  getBlockSui: async (suiWeb3, options) => {

    // Function will retrun complete details of a transaction by transaction Hash

    const filterOptions = options;
    filterOptions.function = "getBlock()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
      return (validJson);
    }
    const checkpoint = await suiWeb3.getCheckpoint({
      id: filterOptions.blockNumber
    });
    if (!checkpoint) return {
      'message': errorMessage.error.message.invalidBlockNumber,
      'code': errorMessage.error.code.invalidInput
    };
    const response = {};

    response.difficulty = null;
    response.gasLimit = null;
    response.gasUsed = checkpoint.epochRollingGasCostSummary;
    response.hash = checkpoint.digest;
    response.miner = null;
    response.nonce = null;
    response.number = checkpoint.sequenceNumber;
    response.parentHash = checkpoint.previousDigest;
    response.size = null;
    response.timestamp = checkpoint.timestampMs;
    response.totalDifficulty = null;
    response.transactions = checkpoint.transactions;
    response.transactionsRoot = null;
    response.uncles = null;

    return (response);

  },

  getBlockAptos: async (aptosweb3, options) => {
    /*
     * Function will fetch the block metadata from Aptos
     */

    const filterOptions = options;
    filterOptions.function = "getBlock()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
      return (validJson);
    }
    const { blockNumber } = filterOptions;
    const block = await aptosweb3.getBlockByHeight(blockNumber, true);
    if (!block) return {
      'message': errorMessage.error.message.invalidBlockNumber,
      'code': errorMessage.error.code.invalidInput
    };
    const response = {};

    response.difficulty = null;
    response.gasLimit = null;
    response.gasUsed = null;
    response.hash = block.block_hash;
    response.miner = block.transactions[0].events[0].data.proposer;
    response.nonce = null;
    response.number = blockNumber;
    response.parentHash = null;
    response.size = null;
    response.timestamp = block.block_timestamp;
    response.totalDifficulty = null;
    response.transactions = block.transactions;
    response.transactionsRoot = null;
    response.uncles = null;

    return (response);
  },

  getBlockStarkNet: async (starknetweb3, options) => {
    /*
     * Function will fetch the block metadata from StarkNet
     */

    const filterOptions = options;
    filterOptions.function = "getBlock()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
      return (validJson);
    }

    const { blockNumber } = filterOptions;
    const block = await starknetweb3.getBlockWithTxs(Number(blockNumber));
    if (!block) return {
      'message': errorMessage.error.message.invalidBlockNumber,
      'code': errorMessage.error.code.invalidInput
    };
    const response = {};

    response.difficulty = null;
    response.gasLimit = null;
    response.gasUsed = null;
    response.hash = block.block_hash;
    response.miner = null;
    response.nonce = null;
    response.number = blockNumber.toString();
    response.parentHash = block.parent_hash;
    response.size = null;
    response.timestamp = (block.timestamp).toString();
    response.totalDifficulty = null;
    response.transactions = block.transactions;
    response.transactionsRoot = null;
    response.uncles = null;

    return (response);
  },

  getBlockTon: async (tonWeb3, options) => {
    /*
     * Function will fetch the block metadata from TON
     */

    const filterOptions = options;
    filterOptions.function = "getBlock()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
      return (validJson);
    }

    const { chainId, blockNumber } = filterOptions;

    const endpoint = await getHttpV4Endpoint({
      network: config.chains[chainId].network,
    });
    const tonClient = new TonClient4({ endpoint });

    try {
      const block = await tonClient.getBlock(Number(blockNumber));
      const parsedBlocks = block;
      const getParsedTxs = (transactions) => {
        const parsedTransactions = [];

        for (let i = 0; i < transactions.length; i += 1) {
          const response = transactions[i];
          response.hex = Buffer.from(transactions[i].hash, 'base64').toString('hex');
          response.transactionHash = transactions[i].hash;
          delete response.hash;
          parsedTransactions.push(response);
        }
        return parsedTransactions;
      };

      for (let i = 0; i < block.shards.length; i += 1) {
        parsedBlocks.shards[i].transactions = getParsedTxs(block.shards[i].transactions);
      }
      return parsedBlocks;
    } catch (err) {
      return {
        'message': errorMessage.error.message.invalidBlockNumber,
        'code': errorMessage.error.code.invalidInput
      };
    }
  },

  getBlockStellar: async (stllrWeb3, options) => {
    /*
     * Function will fetch the block metadata from StarkNet
     */

    const filterOptions = options;
    filterOptions.function = "getBlock()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
      return (validJson);
    }

    const { blockNumber } = filterOptions;
    let block;
    let transactions = [];

    // Recursive function to get the all the transactions
    const getStellarTransaction = async(initialTxs) => {
      const otherTxs = await initialTxs.next({limit: 100});
      if (otherTxs.records.length){
        transactions.push(otherTxs.records);
        await getStellarTransaction(otherTxs);
      } 
      return true;
    };

    try{
      block = await stllrWeb3.ledgers().ledger(Number(blockNumber)).call();

      // Getting all the transactions a block is having
      const initialTxs = await block.transactions({limit: 100});
      transactions.push(initialTxs.records);
      await getStellarTransaction(initialTxs);
      transactions = transactions.flat().map(({hash}) => (hash));
    } catch (err){
      return {
        'message': errorMessage.error.message.invalidBlockNumber,
        'code': errorMessage.error.code.invalidInput
      };
    };
    
    const response = {};

    response.difficulty = null;
    response.gasLimit = null;
    response.gasUsed = null;
    response.hash = block.hash;
    response.miner = null;
    response.nonce = null;
    response.number = block?.sequence;
    response.parentHash = block?.prev_hash;
    response.size = null;
    response.timestamp = new Date(block.closed_at).getTime() / 1000;
    response.totalDifficulty = null;
    response.transactions = transactions;
    response.transactionsRoot = null;
    response.uncles = null;

    return (response);
  },
};