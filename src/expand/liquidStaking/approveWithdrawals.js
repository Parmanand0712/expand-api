const config = require("../../../common/configuration/config.json");
const schemaValidator = require('../../../common/configuration/schemaValidator');
const { getGasPrice } = require('../chain/index');

const stETHABI =  require("../../../assets/abis/lidoABI.json");
const bnbxABI = require("../../../assets/abis/bnbx.json");
const { isValidContractAddress } = require('../../../common/contractCommon');
const errorMessage = require('../../../common/configuration/errorMessage.json');


const throwErrorMessage = (msg) => ({
  'message': errorMessage.error.message[msg],
  'code': errorMessage.error.code.invalidInput
});


module.exports = {
    
    approveWithdrawalsLido: async (web3, options) => {
        /*
        * Function will approve st[token] to a spender on Lido
        */

        const filterOptions = options;
        filterOptions.function = "approveLido()";
        const validJson = await schemaValidator.validateInput(filterOptions);
    
        if (!validJson.valid) {
          return (validJson);
        }

        const { liquidStakingId, amount, gas, from } = filterOptions;

        if (!await isValidContractAddress(web3, from))
         return throwErrorMessage("invalidAddress");
        
        const stETHAddress = config.liquidStaking[liquidStakingId].contractAddress;
        
        const stETHContract = new web3.eth.Contract(stETHABI, stETHAddress);
        const data = stETHContract.methods.approve(config.liquidStaking[liquidStakingId].withdrawQueue, amount).encodeABI();
        
        const approveTX = {
            chainId: config.liquidStaking[liquidStakingId].chainId,
            from,
            to: stETHAddress,
            data,
            gas,
            value: "0"
        };

        if (filterOptions.gasPriority !== undefined) {
            approveTX.gasPrice = await getGasPrice(web3, {
                gasPriority: filterOptions.gasPriority
            }).then(res => res.gasPrice);
        };

        return approveTX;
    },
    approveWithdrawalsBNBStader: async (web3, options) => {
        /*
        * Function will approve BNBX to a spender on Stader
        */

        const filterOptions = options;
        filterOptions.function = "approveLido()";
        const validJson = await schemaValidator.validateInput(filterOptions);
    
        if (!validJson.valid) {
          return (validJson);
        }

        const { liquidStakingId, amount, gas, from } = filterOptions;

        if (!await isValidContractAddress(web3, from))
         return throwErrorMessage("invalidAddress");

        const { bnbxAddress } = config.liquidStaking[liquidStakingId];
        
        const bnbXContract = new web3.eth.Contract(bnbxABI, bnbxAddress);
        
        const data = bnbXContract.methods.approve(config.liquidStaking[liquidStakingId].contractAddress, amount).encodeABI();

        const approveTX = {
            chainId: config.liquidStaking[liquidStakingId].chainId,
            from,
            to: bnbxAddress,
            data,
            gas,
            value: "0"
        };

        if (filterOptions.gasPriority !== undefined) {
            approveTX.gasPrice = await getGasPrice(web3, {
                gasPriority: filterOptions.gasPriority
            }).then(res => res.gasPrice);
        };

        return approveTX;
    }
};