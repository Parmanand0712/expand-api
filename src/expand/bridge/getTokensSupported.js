const errorMessage = require('../../../common/configuration/errorMessage.json');
const tokenConfig = require('../../../common/configuration/squidRouterTokenConfig.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const config = require('../../../common/configuration/config.json');

const throwErrorMessage = (msg, code) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code[code]
});

module.exports = {

    // eslint-disable-next-line no-unused-vars
    getTokensSupportedStargate: async (web3, options) =>

        /*
         * Function will fetch the tokens supported by stargate
        */

        throwErrorMessage('notApplicable', 'notApplicable')
    ,

    // eslint-disable-next-line no-unused-vars
    getTokensSupportedSquidRouter: async (web3, options) => {

        /*
         * Function will fetch the tokens supported by squid router
         */
        const filterOptions = options;
        filterOptions.function = "getTokensSupportedSquidRouter()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const { chainId, bridgeId } = filterOptions;

        if (config.bridge[bridgeId].supportedDstChains.some(supportedChain => supportedChain.chainId === chainId) === false)
            return throwErrorMessage('invalidChainId', 'invalidInput');


        const tokens = tokenConfig[chainId];

        if (tokens)
            return Object.keys(tokens).map((key) => ({ "tokenSymbol": key, "address": tokens[key] }));

        return throwErrorMessage('invalidChainId', 'invalidInput');
    }
};
