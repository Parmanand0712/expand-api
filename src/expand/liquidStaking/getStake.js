const config = require("../../../common/configuration/config.json");
const schemaValidator = require('../../../common/configuration/schemaValidator');

const lidoABI =  require("../../../assets/abis/lidoABI.json");
const opusPoolABI = require("../../../assets/abis/chorusOnePool.json");

const { isValidContractAddress } = require('../../../common/contractCommon');
const errorMessage = require('../../../common/configuration/errorMessage.json');


const throwErrorMessage = (msg) => ({
  'message': errorMessage.error.message[msg],
  'code': errorMessage.error.code.invalidInput
});

module.exports = {
    
    getStakeLido: async (web3, options) => {
        /*
        * Function will get the stake of an user on Lido
        */

        const filterOptions = options;
        filterOptions.function = "getStakeLido()";
        const validJson = await schemaValidator.validateInput(filterOptions);
    
        if (!validJson.valid) {
          return (validJson);
        }

        const { liquidStakingId,  address } = filterOptions;

        if (! await isValidContractAddress(web3, address)) return throwErrorMessage("invalidAddress");
        
        // st[token] stake
        const lidoContract = new web3.eth.Contract(lidoABI, config.liquidStaking[liquidStakingId].contractAddress);
        const stData = await lidoContract.methods.balanceOf(address).call();
        
        // wrapped stake
        const wstETHContract = new web3.eth.Contract(lidoABI, config.liquidStaking[liquidStakingId].wstETHAddress);
        const wstData = await wstETHContract.methods.balanceOf(address).call();

        const response = {
          "stETH": stData,
          "wstETH": wstData
        };

        return response;
    },

    getStakeChorusOne: async (web3, options) => {
      /*
      * Function will get the stake of an user on Lido
      */

      const filterOptions = options;
      filterOptions.function = "getStakeLido()";
      const validJson = await schemaValidator.validateInput(filterOptions);
  
      if (!validJson.valid) {
        return (validJson);
      }

      const { liquidStakingId,  address } = filterOptions;

      if (!await isValidContractAddress(web3, address)) return throwErrorMessage("invalidAddress");
      
      const { opusPool } = config.liquidStaking[liquidStakingId];
      const opusPoolContract = new web3.eth.Contract(opusPoolABI, opusPool);

      const shares = await opusPoolContract.methods.getShares(address).call();

      const response = {
        shares
      };

      return response;
  }
};