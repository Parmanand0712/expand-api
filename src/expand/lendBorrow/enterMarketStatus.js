const comptrollerAbi = require('../../../assets/abis/compoundComptroller.json');
const config = require('../../../common/configuration/config.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const errorMessage = require('../../../common/configuration/errorMessage.json');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});


 /*
     * Function will fetch the status of enter market details from Compound
     */
module.exports = {

    enterMarketStatusCompound: async( web3, options ) => {
        /*
         * Function will fetch the pool details from Compound
         */

        const filterOptions = options;
        filterOptions.function = "enterMarketStatus()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if ( !validJson.valid ) {
            return (validJson);
        }
        const comptrollerAddress = config.lendborrow[filterOptions.lendborrowId].Comptroller;
        const comptroller = new web3.eth.Contract(
            comptrollerAbi, comptrollerAddress
        );
        const enterMarketStatus = await comptroller.methods.getAssetsIn(filterOptions.account).call();
        const response = {
            enterMarketStatus
        };
        
        return (response);
    },

    enterMarketStatusCompoundV3: async () => throwErrorMessage("notApplicable"),
};