/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a NFT getHistoricalLogs response
    {
        logs: [] 
    }
*/

const { default: axios } = require('axios');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const config = require('../../../common/configuration/config.json');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const { isSmartContract, is1155NftContract, is721NftContract } = require('../../../common/contractCommon');
const formatLogs = require('../../../common/formatLogs');
const erc721Abi = require('../../../assets/abis/erc721.json');
const erc1155Abi = require('../../../assets/abis/erc1155.json');
const { getStartAndEndBlocks } = require('../../../common/historicalTxsCommon');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});


module.exports = {
    /*
      * Returns historical transactions from a specified erc1155 token address,
      * filtered by a user address within a given block range.
    */
  getHistoricalLogsEvm721: async (web3, options) =>{
    // Validate input schema and set function name in filter options.
    const filterOptions = { ...options, function: 'getHistoricalLogsNFT721Evm()' };
    const validation = await schemaValidator.validateInput(filterOptions);
    if (!validation.valid) {
      return validation;
    }

    // Set necessary parameters for data object.
    const { nftCollection, page, nftProtocolId, chainId, type, startBlock, endBlock } = filterOptions;

    // Check if input is valid.
    const [isContract, is721Nft] = await Promise.all([
      isSmartContract(web3, nftCollection),
      is721NftContract(web3, nftCollection),
    ]);

    if (!isContract || !is721Nft) {
      return throwErrorMessage("invalidNftContract");
    }

    const { logAction, logModule, offset, defaultBlockRange } = config.nft[chainId][nftProtocolId];
    const { apiKey } = config.etherscan;
    const topic = config.nft[chainId][nftProtocolId][`event${type}`];

    const currentBlock = await web3.eth.getBlockNumber();

    if (startBlock > currentBlock || endBlock > currentBlock) return throwErrorMessage('invalidStartOrEndBlock');
    if (Number(endBlock) - Number(startBlock) > 100) return throwErrorMessage('invalidBlockRange');

    const { fromBlock, toBlock } = getStartAndEndBlocks(startBlock, endBlock, currentBlock, defaultBlockRange);

    
    const tokenContract = new web3.eth.Contract(erc721Abi, nftCollection);
    const tokenLogs = await tokenContract.getPastEvents(type, {fromBlock, toBlock});
    const txCount = tokenLogs.length;

    if (txCount === 0) return throwErrorMessage("noLogsFound");

    const totalPages = Math.ceil(txCount/offset).toString();
    if (Number(page) > Number(totalPages)) return throwErrorMessage("invalidPageNumber");

    const data = {
      address: nftCollection,
      action: logAction,
      page,
      offset,
      fromBlock,
      toBlock,
      module: logModule,
      topic0: topic,
      apikey: apiKey
    };

    // Send HTTP GET request with Axios and return transaction data.
    const axiosConfig = {
      method: 'get',
      url: config.etherscan.baseUrl[chainId],
      params: data,
      timeout: 4000
    };

    let response;
    try{
      response = await axios(axiosConfig);
    } catch (error){
      return throwErrorMessage("timoutError"); 
    }

    if (response.data.status === '0' && response.data.message !== "No Logs Found") {
      throw Error(response.data.message);
    }
    const logs = formatLogs(web3, response.data.result, type, nftProtocolId);
    return { totalPages, currentPage: page, logs };
  },

  getHistoricalLogsEvm1155: async (web3, options) =>{
    // Validate input schema and set function name in filter options.
    const filterOptions = { ...options, function: 'getHistoricalLogsNFT1155Evm()' };
    const validation = await schemaValidator.validateInput(filterOptions);
    if (!validation.valid) {
      return validation;
    }

    // Set necessary parameters for data object.
    const { nftCollection, page, nftProtocolId, chainId, type, startBlock, endBlock } = filterOptions;

    // Check if input is valid.
    const [isContract, is1155Nft] = await Promise.all([
      isSmartContract(web3, nftCollection),
      is1155NftContract(web3, nftCollection),
    ]);

    if (!isContract || !is1155Nft) {
      return throwErrorMessage("invalidNftContract");
    }

    const { logAction, logModule, offset, defaultBlockRange } = config.nft[chainId][nftProtocolId];
    const { apiKey } = config.etherscan;
    const topic = config.nft[chainId][nftProtocolId][`event${type}`];

    const currentBlock = await web3.eth.getBlockNumber();

    if (startBlock > currentBlock || endBlock > currentBlock) return throwErrorMessage('invalidStartOrEndBlock');
    if (Number(endBlock) - Number(startBlock) > 100) return throwErrorMessage('invalidBlockRange');

    const { fromBlock, toBlock } = getStartAndEndBlocks(startBlock, endBlock, currentBlock, defaultBlockRange);

    const tokenContract = new web3.eth.Contract(erc1155Abi, nftCollection);
    const tokenLogs = await tokenContract.getPastEvents(type, {fromBlock, toBlock});
    const txCount = tokenLogs.length;

    if (txCount === 0) return throwErrorMessage("noLogsFound");

    const totalPages = Math.ceil(txCount/offset).toString();
    if (Number(page) > Number(totalPages)) return throwErrorMessage("invalidPageNumber");

    const data = {
      address: nftCollection,
      action: logAction,
      page,
      offset,
      fromBlock,
      toBlock,
      module: logModule,
      topic0: topic,
      apikey: apiKey
    };

    // Send HTTP GET request with Axios and return transaction data.
    const axiosConfig = {
      method: 'get',
      url: config.etherscan.baseUrl[chainId],
      params: data,
      timeout: 4000
    };
    let response;
    try{
      response = await axios(axiosConfig);
    } catch (error){
      return throwErrorMessage("timoutError"); 
    }
    if (response.data.status === '0' && response.data.message !== "No Logs Found") {
      throw Error(response.data.message);
    }
    const logs = formatLogs(web3, response.data.result, type, nftProtocolId);
    return { totalPages, currentPage: page, logs };
  },
};
