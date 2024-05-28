/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a Pool response
    {
        "transactionHash": "0x61f77b95990e4facfaee10b993e9c68cc5d8a8c74ebbcbc122011c5e79afa9cc"
    }
 */

    const cometAbi = require('../../../assets/abis/compound3Comet.json');
    const config = require('../../../common/configuration/config.json');
    const errorMessage = require('../../../common/configuration/errorMessage.json');
    const schemaValidator = require('../../../common/configuration/schemaValidator');
    
    const throwErrorMessage = (msg) => ({
        'message': errorMessage.error.message[msg],
        'code': errorMessage.error.code.invalidInput
      });

    module.exports = {

        getAssetInfoAaveV2: async () => throwErrorMessage("notApplicable"),
        getAssetInfoAaveV3: async () => throwErrorMessage("notApplicable"),
        getAssetInfoCompound: async () => throwErrorMessage("notApplicable"),
    
        getAssetInfoCompoundV3: async( web3, options ) => {
    
            const filterOptions = options;
            filterOptions.function = "getAssetInfoCompV3()";
            const validJson = await schemaValidator.validateInput(filterOptions);
    
            if ( !validJson.valid ) {
                return (validJson);
            }

            const { lendborrowId , market , asset } = filterOptions;
            
            if(web3.utils.isAddress(asset) === false) return throwErrorMessage("invalidEOAAddress");
            
            const cometContract = new web3.eth.Contract(cometAbi , config.lendborrow[lendborrowId][market].comet);

            if(!(asset in config.lendborrow[lendborrowId][market].assets)) return throwErrorMessage("invalidToken");
            const assetData = await cometContract.methods.getAssetInfoByAddress(asset).call();

            return {
                index:assetData[0],
                priceFeedAddress:assetData[1],
                borrowCollateralFactor:((assetData[4] / 10 ** 18) * 100).toString(),
                liquidateCollateralFactor:((assetData[5] / 10 ** 18) * 100).toString(),
                liquidationFactor: Math.round((1 - (assetData[6] / 10 ** 18)) * 100).toString()
            };
        
        },
        


    
    };