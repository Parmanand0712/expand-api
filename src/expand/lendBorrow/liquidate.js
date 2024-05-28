/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a Pool response
    {
        "transactionHash": "0x61f77b95990e4facfaee10b993e9c68cc5d8a8c74ebbcbc122011c5e79afa9cc"
    }
 */

const config = require('../../../common/configuration/config.json');
const Common = require("../../../common/common");
const schemaValidator = require('../../../common/configuration/schemaValidator');
const { getGasPrice } = require('../chain/index');
const errorMessage = require('../../../common/configuration/errorMessage.json');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});

module.exports = {

    liquidateAaveV2: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "liquidateAave()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        filterOptions.lendPoolAddress = await config.lendborrow[filterOptions.lendborrowPoolId].poolAddress;

        const data = await Common.encodeFunctionData(evmWeb3, {
            "functionHash": "0x00a718a9",
            "parametersType": ["address", "address", "address", "uint256", "bool"],
            "parameters": [filterOptions.collateralAsset, filterOptions.debtAsset, filterOptions.user,
            filterOptions.debtToCover, filterOptions.receiveAToken]
        });

        const transactionObject = {
            "chainId": filterOptions.chainId,
            "from": filterOptions.from,
            "to": filterOptions.lendPoolAddress,
            "value": "0",
            "gas": filterOptions.gas,
            "data": data
        };

        if (filterOptions.gasPriority !== undefined) {
            transactionObject.gasPrice = await getGasPrice(evmWeb3, {
                gasPriority: filterOptions.gasPriority
            }).then(res => res.gasPrice);
        }

        return (transactionObject);

    },

    liquidateAaveV3: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "liquidateAave()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        filterOptions.lendPoolAddress = await config.lendborrow[filterOptions.lendborrowPoolId].poolAddress;

        const data = await Common.encodeFunctionData(evmWeb3, {
            "functionHash": "0x00a718a9",
            "parametersType": ["address", "address", "address", "uint256", "bool"],
            "parameters": [filterOptions.collateralAsset, filterOptions.debtAsset, filterOptions.user,
            filterOptions.debtToCover, filterOptions.receiveAToken]
        });

        const transactionObject = {
            "chainId": filterOptions.chainId,
            "from": filterOptions.from,
            "to": filterOptions.lendPoolAddress,
            "value": "0",
            "gas": filterOptions.gas,
            "data": data
        };

        if (filterOptions.gasPriority !== undefined) {
            transactionObject.gasPrice = await getGasPrice(evmWeb3, {
                gasPriority: filterOptions.gasPriority
            }).then(res => res.gasPrice);
        }

        return (transactionObject);

    },

    liquidateCompound: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "liquidateCompound()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const debtToken = `c${filterOptions.debtAsset}`;

        filterOptions.cTokenAddress = await config.lendborrow[filterOptions.lendPoolAddress].ctokens[debtToken];

        const data = await Common.encodeFunctionData(evmWeb3, {
            "functionHash": "0xf5e3c462",
            "parametersType": ["address", "uint256", "address"],
            "parameters": [filterOptions.user, filterOptions.debtToCover, filterOptions.collateralToken]
        });

        const transactionObject = {
            "chainId": filterOptions.chainId,
            "from": filterOptions.from,
            "to": filterOptions.lendPoolAddress,
            "value": "0",
            "gas": filterOptions.gas,
            "data": data
        };

        if (filterOptions.gasPriority !== undefined) {
            transactionObject.gasPrice = await getGasPrice(evmWeb3, {
                gasPriority: filterOptions.gasPriority
            }).then(res => res.gasPrice);
        }

        return (transactionObject);

    },

    liquidateCompoundV3: async () => throwErrorMessage("notApplicable"),

};