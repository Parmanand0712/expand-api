const { default: axios } = require('axios');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const squidRouterCommon = require('../../../common/squidRouterCommon');
const errorMessage = require('../../../common/configuration/errorMessage.json');

module.exports = {
    // eslint-disable-next-line no-unused-vars
    getPriceStargate: async (web3, options) => {

        /*
         * Function will fetch the swap price from stargate
        */

        const response = {};

        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;

        return (response);
    },

    getPriceSquidRouter: async (web3, options) => {
        /*
         * Function will fetch the swap price from squid router
         */

        const filterOptions = options;
        filterOptions.function = "getPriceSquidRouter()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        let response = {};
        const { srcChainId, dstChainId, srcTokenSymbol, dstTokenSymbol, amountIn } = filterOptions;

        const apiConfig = await squidRouterCommon.getSwapRoute(filterOptions, true);
        if (apiConfig.code === 400) return apiConfig;

        try {
            const res = await axios.request(apiConfig);
            response = { ...response, srcChainId, dstChainId, srcTokenSymbol, dstTokenSymbol, amountIn, amountOut: res.data.route.estimate.toAmount };
        } catch (err) {
            if (err.response.data) return { 'message': err.response.data.errors, 'code': errorMessage.error.code.notFound };
            return (err);
        }
        return (response);
    }
};
