const { default: axios } = require("axios");
const config = require("../../../common/configuration/config.json");
const schemaValidator = require('../../../common/configuration/schemaValidator');

const withdrawABI =  require("../../../assets/abis/withdrawABI.json");
const opusPoolABI = require("../../../assets/abis/chorusOnePool.json");

const { isValidContractAddress } = require('../../../common/contractCommon');
const errorMessage = require('../../../common/configuration/errorMessage.json');


const throwErrorMessage = (msg) => ({
  'message': errorMessage.error.message[msg],
  'code': errorMessage.error.code.invalidInput
});


module.exports = {
    
    getWithdrawalRequestsLido: async (web3, options) => {
        /*
        * Function will get withdraw reqs of an user on Lido
        */

        const filterOptions = options;
        filterOptions.function = "getWithdrawalRequests()";
        const validJson = await schemaValidator.validateInput(filterOptions);
    
        if (!validJson.valid) {
          return (validJson);
        }

        const { liquidStakingId, address } = filterOptions;

        if (!(await isValidContractAddress(web3, address)))
        return throwErrorMessage("invalidAddress");

        const withdrawAddress = config.liquidStaking[liquidStakingId].withdrawQueue;
        
        const contract = new web3.eth.Contract(withdrawABI, withdrawAddress);

        // Withdrwal reqs for an user
        const withDrawalReq = contract.methods.getWithdrawalRequests(address).call();

        return withDrawalReq;
    },

    getWithdrawalRequestsStatusLido: async (web3, options) => {
        /*
        * Function will get the status of a withdraw req
        */

        const filterOptions = options;
        filterOptions.function = "getStatusWithdrawalRequests()";
        const validJson = await schemaValidator.validateInput(filterOptions);
    
        if (!validJson.valid) {
          return (validJson);
        }

        const { liquidStakingId, requestId } = filterOptions;
        const withdrawAddress = config.liquidStaking[liquidStakingId].withdrawQueue;

        const contract = new web3.eth.Contract(withdrawABI, withdrawAddress);
        // Status of req
        const withDrawalReq = await contract.methods.getWithdrawalStatus([requestId]).call();

        const response =  {
          "amountOfStETH": withDrawalReq[0][0],
          "amountOfShares": withDrawalReq[0][1],
          "owner": withDrawalReq[0][2],
          "timestamp": withDrawalReq[0][3],
          "isFinalized": withDrawalReq[0][4],
          "isClaimed": withDrawalReq[0][5]
        };
        
        return response;
    },

    getWithdrawalRequestsChorusOne: async (web3, options) => {
      /*
      * Function will get the daily rewards in Chorus One
      */
  
      const filterOptions = options;
      filterOptions.function = "getWithdrawalRequests()";
      const validJson = await schemaValidator.validateInput(filterOptions);
  
      if (!validJson.valid) {
        return (validJson);
      }
  
      const { liquidStakingId, address } = filterOptions;
      const { APRDataSource, opusPool } = config.liquidStaking[liquidStakingId];

      if (!await isValidContractAddress(web3, address)) return throwErrorMessage("invalidAddress");

      const opusPoolContract = new web3.eth.Contract(opusPoolABI, opusPool);

      const apiConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: APRDataSource,
        headers: { 
          'Content-Type': 'application/json'
        },
        data :  {
          query: `{
            exitRequests(where: {owner: "${address}"}) {
              timestamp
              positionTicket
              owner
              totalShares
              vault {
                id
              }
            }
          }`,
          variables: {}
        }};
      
      const response = await axios.request(apiConfig).then(res => res.data);
      if (response.errors) return throwErrorMessage("invalidInput");

      const validRequests = response.data?.exitRequests.filter(({vault}) => vault.id === opusPool.toLowerCase());
      
      const requests = [];
      for (let i = 0; i< validRequests.length; i+=1){
        const {timestamp, totalShares, positionTicket} = validRequests[i];
        // eslint-disable-next-line no-await-in-loop
        const exitQueueIndex = await opusPoolContract.methods.getExitQueueIndex(positionTicket).call();
        requests.push({
          requestId: positionTicket,
          exitQueueIndex,
          timestamp,
          totalShares,
        });
      }
  
      return { requests };
    },
};