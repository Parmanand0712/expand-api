/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a erc20 getHistoricalogs() response
    {
        events: [] 
    }
*/

const { default: axios } = require('axios');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const config = require('../../../common/configuration/config.json');
const { isErc20Contract, isSmartContract } = require('../../../common/contractCommon');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const formatLogs = require('../../../common/formatLogs');
const tokenAbi = require("../../../assets/abis/iERC20.json");
const { getStartAndEndBlocks } = require('../../../common/historicalTxsCommon');

const throwErrorMessage = (msg) => ({
  'message': errorMessage.error.message[msg],
  'code': errorMessage.error.code.invalidInput
});

module.exports = {
    /*
      * Returns historical transactions from a specified erc20 token address,
      * filtered by a user address within a given block range.
    */
    getHistoricalLogsEvm: async (web3, options) => {
      // Set the function name in the filter options and validate the input schema.
      const filterOptions = { ...options, function: 'getHistoricalLogsEvm()' };
      const validInput = await schemaValidator.validateInput(filterOptions);
      if (!validInput.valid) {
        return validInput;
      }

      // Prepare the data object with the necessary parameters.
      const { tokenAddress, page, chainId, type, startBlock, endBlock } = filterOptions;

      const [isErc20token, isContract] = await Promise.all([
        isErc20Contract(web3, tokenAddress),
        isSmartContract(web3, tokenAddress),
      ]);

      if (!isErc20token || !isContract) {
        return throwErrorMessage("invalidErc20Contract");
      }

      const { apiKey } = config.etherscan;
      const {logAction, logModule, defaultBlockRange, offset} = config.fungibleToken[chainId];
      const topic = config.fungibleToken[chainId][`event${type}`];
      
      const currentBlock = await web3.eth.getBlockNumber();

      if (startBlock > currentBlock || endBlock > currentBlock) return throwErrorMessage('invalidStartOrEndBlock');
      if (Number(endBlock) - Number(startBlock) > 100) return throwErrorMessage('invalidBlockRange');
  
      const { fromBlock, toBlock } = getStartAndEndBlocks(startBlock, endBlock, currentBlock, defaultBlockRange);
  

      const tokenContract = new web3.eth.Contract(tokenAbi, tokenAddress);
      const tokenLogs = await tokenContract.getPastEvents(type, {fromBlock, toBlock});
      const txCount = tokenLogs.length;

      if (txCount === 0) return throwErrorMessage("noLogsFound");
  
      const totalPages = Math.ceil(txCount/offset).toString();
      if (Number(page) > Number(totalPages)) return throwErrorMessage("invalidPageNumber");
  
      const data = {
        address: tokenAddress,
        action: logAction,
        page,
        offset,
        fromBlock,
        toBlock,
        module: logModule,
        topic0: topic,
        apikey: apiKey,
      };
  
      // Send the HTTP GET request using Axios and return the transaction data.
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
      if (response.data.status === '0' && (response.data.message !== "No transactions found") ) throw Error(response.data.message);
      const logs = formatLogs(web3, response.data.result, type);
      return { totalPages, currentPage: page, logs };
    },
  };
