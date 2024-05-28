/* eslint-disable prefer-destructuring */
const schemaValidator = require('../../../common/configuration/schemaValidator');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const config = require('../../../common/configuration/config.json');
const GetPrice = require('./getPrice');

const swapNotAvailable = {
    'message': errorMessage.error.message.swapNotAvailable,
    'code': errorMessage.error.code.invalidInput
};

module.exports = {

    getPoolDex: async (web3, options) => {
        try {
            const filterOptions = { ...options, function: "getPoolDex()" };
            const validJson = await schemaValidator.validateInput(filterOptions);
    
            if (!validJson.valid) {
                return validJson;
            }
    
            const poolInfoPromises = filterOptions.dexId.map(async (dex) => {
                try {
                    const result = {};
                    const {dexName} = config.dex[dex];
                    const res = await GetPrice[`getPrice${dexName}`](web3, { ...filterOptions, dexId: dex });
                    result.dexId = dex;
                    result.value = res.amountsOut[1];
                    return result;
                } catch (error) {
                    console.log(swapNotAvailable);
                    return null;
                }
            });
    
            const poolInfo = await Promise.all(poolInfoPromises);
            return poolInfo.filter(info => info !== null); // Filter out null values
        } catch (error) {
            console.error("Error occurred:", error);
            return [];
        }
    }
};
