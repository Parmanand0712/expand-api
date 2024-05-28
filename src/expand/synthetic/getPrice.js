/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a price response
    {
        'peggedToProtocolToken': '422025880120940631'
    }
 */

const config = require('../../../common/configuration/config.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const syntheticDepoAbis = require('../../../assets/abis/syntheticDepo.json');

module.exports = {

    getPriceSynthetix: async(web3, options) => {

        const filterOptions = options;
        filterOptions.function = "getPriceSynthetix()";
        const validJson = await schemaValidator.validateInput(options);
        if ( !validJson.valid ) {
            return validJson;
        }

        const response = {};
        filterOptions.depoAddress = await config.synthetic[filterOptions.syntheticId].address.depot;

        const depo = new web3.eth.Contract(
            syntheticDepoAbis,
            filterOptions.depoAddress
        );

        const price = await depo.methods.synthetixReceivedForSynths(
            filterOptions.amount,
        ).call(); 

        response.peggedToProtocolToken = price.toString();

        return response;

    }

};

