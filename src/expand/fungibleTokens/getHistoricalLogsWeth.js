/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a Weth getHistoricalogs() response
    {
        events: [] 
    }
*/

const { default: axios } = require('axios');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const config = require('../../../common/configuration/config.json');
const formatLogs = require('../../../common/formatLogs');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const tokenAbi = require("../../../assets/abis/weth.json");
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
    getHistoricalLogsWeth: async (web3, options) => {
      // Set the function name in the filter options and validate the input schema.
      const filterOptions = { ...options, function: 'getHistoricalLogsWeth()' };
      const validInput = await schemaValidator.validateInput(filterOptions);
      if (!validInput.valid) {
        return validInput;
      }

      // Prepare the data object with the necessary parameters.
      const { page, chainId, type, startBlock, endBlock } = filterOptions;

      const { apiKey } = config.etherscan;
      const {logAction, logModule, defaultBlockRange, offset} = config.weth[chainId];
      const topic = config.weth[chainId][`event${type}`];
      const tokenAddress = config.wethAddress[chainId];

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
