/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a erc20 getHistoricalTransactions() response
    {
        transactions: [] 
    }
*/

const schemaValidator = require('../../../common/configuration/schemaValidator');
const config = require('../../../common/configuration/config.json');
const { isErc20Contract, isSmartContract } = require('../../../common/contractCommon');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const tokenAbi = require("../../../assets/abis/iERC20.json");
const { getStartAndEndBlocks, getPastEvents, getParsedTransactions } = require('../../../common/historicalTxsCommon');

const throwErrorMessage = (msg) => ({
  'message': errorMessage.error.message[msg],
  'code': errorMessage.error.code.invalidInput
});

module.exports = {
  /*
    * Returns historical transactions from a specified erc20 token address,
    * filtered by a user address within a given block range.
  */
  getHistoricalTransactionsEvm: async (web3, options) => {
    // Set the function name in the filter options and validate the input schema.
    const filterOptions = { ...options, function: 'getHistoricalTransactionsEvm()' };
    const validInput = await schemaValidator.validateInput(filterOptions);
    if (!validInput.valid) {
      return validInput;
    }

    // Prepare the data object with the necessary parameters.
    const { tokenAddress, address, sort, chainId, chainName } = filterOptions;
    let {startBlock, endBlock} = filterOptions;
    startBlock = Number(startBlock);
    endBlock = (Number(endBlock) + 1);
    
    const [isErc20token, isNotUserAddress] = await Promise.all([
      isErc20Contract(web3, tokenAddress),
      isSmartContract(web3, address),
    ]);

    if (address && isNotUserAddress) return throwErrorMessage("invalidAddress");
    if (!isErc20token) return throwErrorMessage("invalidErc20Contract");
    
    const { defaultBlockRange } = config.fungibleToken[chainId];
    const currentBlock = await web3.eth.getBlockNumber();

    if (startBlock > endBlock -1 ) return throwErrorMessage("invalidStartEndBlock");
    if (startBlock > currentBlock || (endBlock - 1) > currentBlock) return throwErrorMessage('invalidStartOrEndBlock');
    if ((endBlock - startBlock) > Number(defaultBlockRange)) return throwErrorMessage('invalidBlockRange');
    
    const { fromBlock, toBlock } = getStartAndEndBlocks(startBlock, endBlock, currentBlock, defaultBlockRange);

    const tokenContract = new web3.eth.Contract(tokenAbi, tokenAddress);
    const tokenLogs = await getPastEvents(tokenContract, fromBlock, toBlock, address);

    // If no transactions found
    if (tokenLogs.length === 0) return throwErrorMessage("noTxsFound");
    const transactions = await getParsedTransactions(web3, chainName, tokenLogs);
    if (sort === 'asc')transactions.reverse();
    return { transactions };
  },
};
