/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a response
    {
        transactionObject
    }
 */

const config = require('../../../common/configuration/config.json');
const Common = require("../../../common/common");
const schemaValidator = require('../../../common/configuration/schemaValidator');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const { getGasPrice } = require('../chain/index');


module.exports = {

    setUserEModeAaveV3: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "setUserEModeAaveV3()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const data = await Common.encodeFunctionData(evmWeb3, {
            "functionHash": "0x28530a47",
            "parametersType": ["uint8"],
            "parameters": [filterOptions.categoryId]
        });

        const transactionObject = {
            "chainId": filterOptions.chainId,
            "from": filterOptions.from,
            "to": config.lendborrow[filterOptions.lendborrowId].poolAddress,
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

    // eslint-disable-next-line no-unused-vars
    setUserEModeAaveV2: async (evmWeb3, options) => {

        const response = {};

        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;

        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    setUserEModeCompoundV3: async (evmWeb3, options) => {

        const response = {};

        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;

        return (response);
    }

};