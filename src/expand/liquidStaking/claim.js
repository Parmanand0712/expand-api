const config = require("../../../common/configuration/config.json");
const schemaValidator = require('../../../common/configuration/schemaValidator');
const { getGasPrice } = require('../chain/index');

const withdrawABI = require("../../../assets/abis/withdrawABI.json");
const opusPoolABI = require("../../../assets/abis/chorusOnePool.json");

const { isValidContractAddress } = require('../../../common/contractCommon');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const { getWithdrawalRequestsChorusOne } = require("./getWithdrawalCalls");


const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});

module.exports = {

    claimLido: async (web3, options) => {
        /*
        * Function will claim eth on Lido
        */

        const filterOptions = options;
        filterOptions.function = "claimLido()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const { liquidStakingId, gas, requestId, from } = filterOptions;

        if (!await isValidContractAddress(web3, from))
            return throwErrorMessage("invalidAddress");


        const withdrawAddress = config.liquidStaking[liquidStakingId].withdrawQueue;
        const contract = new web3.eth.Contract(withdrawABI, withdrawAddress);
        // Encoding claim data
        const data = contract.methods.claimWithdrawal(requestId).encodeABI();

        const claimTx = {
            chainId: config.liquidStaking[liquidStakingId].chainId,
            from,
            to: withdrawAddress,
            data,
            gas,
            value: "0",
        };

        if (filterOptions.gasPriority !== undefined) {
            claimTx.gasPrice = await getGasPrice(web3, {
                gasPriority: filterOptions.gasPriority
            }).then(res => res.gasPrice);
        };

        return claimTx;
    },

    claimChorusOne: async (web3, options) => {
        /*
        * Function will claim eth on Chorus One
        */

        const filterOptions = options;
        filterOptions.function = "claimChorusOne()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const { liquidStakingId, requestId, gas, from, gasPriority } = filterOptions;

        if (!await isValidContractAddress(web3, from)) return throwErrorMessage("invalidAddress");

        const withdrawRequests = await getWithdrawalRequestsChorusOne(web3, { liquidStakingId, address: from });
        const withdrawRequest = withdrawRequests.requests?.find((req) => req.requestId === requestId);
        if (!withdrawRequest) return throwErrorMessage("invalidRequestId");

        const { timestamp, exitQueueIndex } = withdrawRequest;
        const { opusPool } = config.liquidStaking[liquidStakingId];
        const opusPoolContract = new web3.eth.Contract(opusPoolABI, opusPool);

        const data = await opusPoolContract.methods.claimExitedAssets(
            requestId, timestamp, exitQueueIndex).encodeABI();

        const claimTx = {
            chainId: config.liquidStaking[liquidStakingId].chainId,
            from,
            to: opusPool,
            value: "0",
            data,
            gas,
        };

        if (gasPriority) {
            claimTx.gasPrice = await getGasPrice(web3, { gasPriority }).then(res => res.gasPrice);
        };

        return claimTx;
    }
};