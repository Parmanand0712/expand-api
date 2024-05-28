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

        transferAaveV2: async () => throwErrorMessage("notApplicable"),
        transferAaveV3: async () => throwErrorMessage("notApplicable"),
        transferCompound: async () => throwErrorMessage("notApplicable"),

        transferCompoundV3: async (evmWeb3, options) => {

            const filterOptions = options;
            filterOptions.function = "transferCompV3()";
            const validJson = await schemaValidator.validateInput(filterOptions);

            if (!validJson.valid) {
                return (validJson);
            }

            let transactionObject = {};
            let data;

            const { asset, lendborrowId, amount, from, gas, market, to, chainId } = filterOptions;
            const { comet, assets } = config.lendborrow[lendborrowId][market];

            const isValid = [ from , to ].every(address => evmWeb3.utils.isAddress(address));
            if(asset !== undefined && evmWeb3.utils.isAddress(asset) === false) return throwErrorMessage("invalidEOAAddress");
            if(isValid === false) return throwErrorMessage("invalidEOAAddress");

            if (asset !== undefined &&  !(asset in assets) ) return throwErrorMessage("invalidToken");
            if (asset === undefined) {
                data = await Common.encodeFunctionData(evmWeb3, {
                    "functionHash": "0xa9059cbb",
                    "parametersType": ["address", "uint256"],
                    "parameters": [to, amount]
                });
            }
            else {
                data = await Common.encodeFunctionData(evmWeb3, {
                    "functionHash": "0x439e2e45",
                    "parametersType": ["address", "address", "uint256"],
                    "parameters": [to, asset, amount]
                });
            }


            transactionObject = {
                "chainId": chainId,
                "from": from,
                "to": comet,
                "value": "0",
                "gas": gas,
                "data": data
            };

            if (filterOptions.gasPriority !== undefined) {
                transactionObject.gasPrice = await getGasPrice(evmWeb3, {
                    gasPriority: filterOptions.gasPriority
                }).then(res => res.gasPrice);
            }

            return (transactionObject);
        }
        
    
    };