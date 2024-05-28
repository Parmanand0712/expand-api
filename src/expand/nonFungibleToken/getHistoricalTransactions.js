/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a erc20 balanceOf response
    {
        transactions: [] 
    }
*/

const schemaValidator = require('../../../common/configuration/schemaValidator');
const config = require('../../../common/configuration/config.json');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const { isSmartContract, is1155NftContract, is721NftContract } = require('../../../common/contractCommon');
const erc721Abi = require('../../../assets/abis/erc721.json');
const erc1155Abi = require('../../../assets/abis/erc1155.json');
const { getStartAndEndBlocks, getPastEvents, getParsedTransactions } = require('../../../common/historicalTxsCommon');

const throwErrorMessage = (msg) => ({
  'message': errorMessage.error.message[msg],
  'code': errorMessage.error.code.invalidInput
});


module.exports = {
  /*
    * Returns historical transactions from a specified erc1155 token address,
    * filtered by a user address within a given block range.
  */
  getHistoricalTransactionsEvm1155: async (web3, options) => {
    // Validate input schema and set function name in filter options.
    const filterOptions = { ...options, function: 'getHistoricalTransactionsNFTEvm()' };
    const validation = await schemaValidator.validateInput(filterOptions);
    if (!validation.valid) {
      return validation;
    }

    // Set necessary parameters for data object.
    const { nftCollection, address, sort, nftProtocolId, chainId, chainName } = filterOptions;
    let {startBlock, endBlock} = filterOptions;
    startBlock = Number(startBlock);
    endBlock = (Number(endBlock) + 1);

    // Check if input is valid.
    const [is1155Nft, isNotUserAddress] = await Promise.all([
      is1155NftContract(web3, nftCollection),
      isSmartContract(web3, address)
    ]);

    if (address && isNotUserAddress) return throwErrorMessage("invalidUserAddress");
    if (!is1155Nft) return throwErrorMessage("invalidNftContract");

    const { defaultBlockRange } = config.nft[chainId][nftProtocolId];
    const currentBlock = await web3.eth.getBlockNumber();

    if (startBlock > endBlock -1) return throwErrorMessage("invalidStartEndBlock");
    if (startBlock > currentBlock || (endBlock - 1) > currentBlock) return throwErrorMessage('invalidStartOrEndBlock');
    if ((endBlock - startBlock) > Number(defaultBlockRange)) return throwErrorMessage('invalidBlockRange');

    const { fromBlock, toBlock } = getStartAndEndBlocks(startBlock, endBlock, currentBlock, defaultBlockRange);
    const tokenContract = new web3.eth.Contract(erc1155Abi, nftCollection);
    const tokenLogs = await getPastEvents(tokenContract, fromBlock, toBlock, address);

    // If no transactions found
    if (tokenLogs.length === 0) return throwErrorMessage("noTxsFound");
    const transactions = await getParsedTransactions(web3, chainName, tokenLogs);
    if (sort === 'asc') transactions.reverse();
     return { transactions };
  },


  /*
  * Returns historical transactions from a specified erc721 token address,
  * filtered by a user address within a given block range.
*/
  getHistoricalTransactionsEvm721: async (web3, options) => {
    // Validate input schema and set function name in filter options.
    const filterOptions = { ...options, function: 'getHistoricalTransactionsNFTEvm()' };
    const validation = await schemaValidator.validateInput(filterOptions);
    if (!validation.valid) {
      return validation;
    }

    // Set necessary parameters for data object.
    const { nftCollection, address, sort, nftProtocolId, chainId, chainName } = filterOptions;
    let {startBlock, endBlock} = filterOptions;
    startBlock = Number(startBlock);
    endBlock = (Number(endBlock) + 1);

    // Check if input is valid.
    const [is721Nft, isNotUserAddress] = await Promise.all([
      is721NftContract(web3, nftCollection),
      isSmartContract(web3, address),
    ]);

    if (address && isNotUserAddress) return throwErrorMessage("invalidUserAddress");
    if (!is721Nft) return throwErrorMessage("invalidNftContract");

    const { defaultBlockRange } = config.nft[chainId][nftProtocolId];
    const currentBlock = await web3.eth.getBlockNumber();
    
    if (startBlock > endBlock - 1) return throwErrorMessage("invalidStartEndBlock");
    if (startBlock > currentBlock || (endBlock - 1) > currentBlock) return throwErrorMessage('invalidStartOrEndBlock');
    if ((endBlock - startBlock) > Number(defaultBlockRange)) return throwErrorMessage('invalidBlockRange');

    const { fromBlock, toBlock } = getStartAndEndBlocks(startBlock, endBlock, currentBlock, defaultBlockRange);
    const tokenContract = new web3.eth.Contract(erc721Abi, nftCollection);
    const tokenLogs = await getPastEvents(tokenContract, fromBlock, toBlock, address);

    // If no transactions found
    if (tokenLogs.length === 0) return throwErrorMessage("noTxsFound");
    const transactions = await getParsedTransactions(web3, chainName, tokenLogs);
    if (sort === 'asc')transactions.reverse();
    return { transactions };
  },

};
