const errorMessage = require('../../../common/configuration/errorMessage.json');
const config = require('../../../common/configuration/config.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');

const throwErrorMessage = (msg, code) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code[code]
});

module.exports = {

    getChainsSupportedStargate: async () => 

        /*
         * Function will fetch the chains supported by stargate
        */

        throwErrorMessage('notApplicable', 'notApplicable')
    ,

    getChainsSupportedSquidRouter: async (_, options) => {
        /*
         * Function will fetch the chains supported by squid router
         */

        const filterOptions = options;
        filterOptions.function = "getChainsSupportedSquidRouter()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const { bridgeId } = filterOptions;
        return config.bridge[bridgeId].supportedDstChains;
    }
};
