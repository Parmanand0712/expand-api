const config = require("../../../common/configuration/config.json");
const schemaValidator = require('../../../common/configuration/schemaValidator');
const { getGasPrice } = require('../chain/index');

const lidoABI = require("../../../assets/abis/lidoABI.json");
const opusPoolABI = require("../../../assets/abis/chorusOnePool.json");

const { isValidContractAddress } = require('../../../common/contractCommon');
const errorMessage = require('../../../common/configuration/errorMessage.json');


const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});

module.exports = {

    stakeLido: async (web3, options) => {
        /*
        * Function will stake eth on Lido
        */

        const filterOptions = options;
        filterOptions.function = "stakeLido()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const { liquidStakingId, from, amount, gas } = filterOptions;
        const { referrer } = config;

        if (!(await isValidContractAddress(web3, from) && await isValidContractAddress(web3, referrer)))
            return throwErrorMessage("invalidAddress");

        // Staking ETH
        const lidoContract = new web3.eth.Contract(lidoABI, config.liquidStaking[liquidStakingId].contractAddress);
        const data = lidoContract.methods.submit(referrer).encodeABI();

        const stakeTx = {
            chainId: config.liquidStaking[liquidStakingId].chainId,
            from,
            to: config.liquidStaking[liquidStakingId].contractAddress,
            data,
            value: amount,
            gas
        };

        if (filterOptions.gasPriority !== undefined) {
            stakeTx.gasPrice = await getGasPrice(web3, {
                gasPriority: filterOptions.gasPriority
            }).then(res => res.gasPrice);
        };

        return stakeTx;
    },

    stakeChorusOne: async (web3, options) => {
        /*
        * Function will stake eth on Chorus One
        */

        const filterOptions = options;
        filterOptions.function = "stakeLido()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const { liquidStakingId, from, amount, gas, gasPriority } = filterOptions;

        const isValidUser = await isValidContractAddress(web3, from);
        if (!isValidUser) return throwErrorMessage("invalidAddress");

        const { opusPool } = config.liquidStaking[liquidStakingId];
        const {referrer} = config;
        const opusPoolContract = new web3.eth.Contract(opusPoolABI, opusPool);

        const data = await opusPoolContract.methods.deposit(from, referrer || "0x0000000000000000000000000000000000000000").encodeABI();

        const txPayload = {
            chainId: config.liquidStaking[liquidStakingId].chainId,
            from,
            to: opusPool,
            value: amount,
            gas,
            data
        };

        if (gasPriority) {
            txPayload.gasPrice = await getGasPrice(web3, { gasPriority }).then(res => res.gasPrice);
        };

        return txPayload;
    }
};

