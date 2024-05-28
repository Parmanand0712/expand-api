const config = require("../../../common/configuration/config.json");
const schemaValidator = require('../../../common/configuration/schemaValidator');
const { getGasPrice } = require('../chain/index');

const withdrawABI = require("../../../assets/abis/withdrawABI.json");
const opusPoolABI = require("../../../assets/abis/chorusOnePool.json");

const { isValidContractAddress } = require('../../../common/contractCommon');
const errorMessage = require('../../../common/configuration/errorMessage.json');


const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});


module.exports = {

    reqWithdrawLido: async (web3, options) => {
        /*
        * Function will submit a wothdrwal request on Lido
        */

        const filterOptions = options;
        filterOptions.function = "reqWithdraw()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const { liquidStakingId, amount, gas, ownerAddress, from } = filterOptions;
        const withdrawAddress = config.liquidStaking[liquidStakingId].withdrawQueue;

        if (!(await isValidContractAddress(web3, ownerAddress) && await isValidContractAddress(web3, from)))
            return throwErrorMessage("invalidAddress");
        
        // requesting withdrawal to the WithdrawQueue
        const contract = new web3.eth.Contract(withdrawABI, withdrawAddress);
        const data = contract.methods.requestWithdrawals([amount], ownerAddress).encodeABI();

        const withdrawTx = {
            chainId: config.liquidStaking[liquidStakingId].chainId,
            from,
            to: withdrawAddress,
            data,
            gas,
            value: "0",
        };

        if (filterOptions.gasPriority !== undefined) {
            withdrawTx.gasPrice = await getGasPrice(web3, {
                gasPriority: filterOptions.gasPriority
            }).then(res => res.gasPrice);
        };

        return withdrawTx;
    },

    reqWithdrawChorusOne: async (web3, options) => {
        /*
        * Function will submit a withdrwal request on Chorus One
        */

        const filterOptions = options;
        filterOptions.function = "chorusOneReqWithdraw()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const { liquidStakingId, amount, gas, from, gasPriority } = filterOptions;
        if (! await isValidContractAddress(web3, from)) return throwErrorMessage("invalidAddress");
      
        const { opusPool } = config.liquidStaking[liquidStakingId];
        const opusPoolContract = new web3.eth.Contract(opusPoolABI, opusPool);
        const data = await opusPoolContract.methods.enterExitQueue(amount, from).encodeABI();

        const withdrawTx = {
            chainId: config.liquidStaking[liquidStakingId].chainId,
            from,
            to: opusPool,
            value: "0",
            gas,
            data,
        };

        if (gasPriority) {
            withdrawTx.gasPrice = await getGasPrice(web3, { gasPriority }).then(res => res.gasPrice);
        };

        return withdrawTx;
    },
};