const { getPrice } = require('../oracle');
const schemaValidator = require('../../../common/configuration/schemaValidator');

module.exports = {
 
    getPriceEvm: async(web3,options) => {
        
        const filterOptions = options;
        if ( filterOptions.asset ) {
            filterOptions.asset = filterOptions.asset.toUpperCase();
        }
        filterOptions.function = "getPriceEvm()";
        
        const validJson = await schemaValidator.validateInput(options);
        if ( !validJson.valid ) {
            return (validJson);
        }

        const price = await getPrice(web3,  {
            asset: filterOptions.asset
        });

        return (price);

    }

};