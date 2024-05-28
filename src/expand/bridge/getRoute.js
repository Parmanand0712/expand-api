const { default: axios } = require('axios');
const schemaValidator = require('../../../common/configuration/schemaValidator');

const errorMessage = require('../../../common/configuration/errorMessage.json');
const squidRouterCommon = require('../../../common/squidRouterCommon');

const throwErrorMessage = (msg, code) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code[code]
});

module.exports = {

    // eslint-disable-next-line no-unused-vars
    getRouteStargate: async (web3, options) => 

        /*
         * Function will fetch the swap route of tokens in stargate
        */

        throwErrorMessage('notApplicable', 'notApplicable')
    ,

    getRouteSquidRouter: async (web3, options) => {

        /*
         * Function will fetch the swap route of tokens in squid router
         */

        const filterOptions = options;
        filterOptions.function = "getPriceSquidRouter()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        if (!(/^\+?\d+$/.test(filterOptions.amountIn))) return {
        'message': 
        `Error: invalid BigNumber string (argument="${"value"}", value="${filterOptions.amountIn}", code=INVALID_ARGUMENT, version=bignumber/5.7.0)`,
        'code': errorMessage.error.code.invalidInput
        }; 
        const apiConfig = await squidRouterCommon.getSwapRoute(filterOptions, true);
        if (apiConfig.code === 400) return apiConfig;

        try {
            const res = await axios.request(apiConfig);
            console.log(res);
            return res.data.route.estimate;
        } catch (err) {
            if (err.response.data)
            return { 'message': err.response.data.errors, 'code': errorMessage.error.code.notFound };
            return (err);
        }
    }
};
