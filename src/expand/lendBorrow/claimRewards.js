/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a Pool response
    {
        "transactionHash": "0x61f77b95990e4facfaee10b993e9c68cc5d8a8c74ebbcbc122011c5e79afa9cc"
    }
 */

    const config = require('../../../common/configuration/config.json');
    const Common = require("../../../common/common");
    const errorMessage = require('../../../common/configuration/errorMessage.json');
    const schemaValidator = require('../../../common/configuration/schemaValidator');
    const { getGasPrice } = require('../chain/index');
    
    const throwErrorMessage = (msg) => ({
        'message': errorMessage.error.message[msg],
        'code': errorMessage.error.code.invalidInput
    });
    
    module.exports = {

        claimRewardsAaveV2: async () => throwErrorMessage("notApplicable"),
        claimRewardsAaveV3: async () => throwErrorMessage("notApplicable"),
        claimRewardsCompound: async () => throwErrorMessage("notApplicable"),

    
        claimRewardsCompoundV3: async( evmWeb3, options ) => {
    
            const filterOptions = options;
            filterOptions.function = "claimRewardsCompV3()";
            const validJson = await schemaValidator.validateInput(filterOptions);
    
            if ( !validJson.valid ) {
                return (validJson);
            }
            
            const {lendborrowId , market , chainId , from , gas , gasPriority } = filterOptions;
            const {comet , reward } = config.lendborrow[lendborrowId][market];

            if(evmWeb3.utils.isAddress(from) === false) return throwErrorMessage("invalidAddress");

            const data = await Common.encodeFunctionData( evmWeb3, {
                "functionHash": "0xb7034f7e",
                "parametersType": [ "address" , "address" , "bool"],
                "parameters": [ comet , from , true]
            });
    
            const transactionObject = {
                "chainId": chainId,
                "from": from,
                "to": reward,
                "value": "0",
                "gas": gas,
                "data": data
            };
    
            if (gasPriority !== undefined) {
                transactionObject.gasPrice = await getGasPrice(evmWeb3, {
                    gasPriority
                }).then(res => res.gasPrice);
            }
        
            return (transactionObject);
        
        }
    
    };