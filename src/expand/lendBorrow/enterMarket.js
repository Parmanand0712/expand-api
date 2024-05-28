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
const schemaValidator = require('../../../common/configuration/schemaValidator');
const { getGasPrice } = require('../chain/index');
const errorMessage = require('../../../common/configuration/errorMessage.json');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});


module.exports = {

    enterMarketCompound: async( evmWeb3, options ) => {

        const filterOptions = options;
        filterOptions.function = "enterMarketCompound()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if ( !validJson.valid ) {
            return (validJson);
        }

        const token = `c${(filterOptions.asset).toUpperCase()}`;
        filterOptions.cTokenAddress = await config.lendborrow[filterOptions.lendborrowId].ctokens[token];

        const data = await Common.encodeFunctionData( evmWeb3, {
            "functionHash": "0xc2998238",
            "parametersType": [ "address[]" ],
            "parameters": [ [filterOptions.cTokenAddress] ]
        });

        const transactionObject = {
            "chainId": filterOptions.chainId,
            "from": filterOptions.from,
            "to": config.lendborrow[filterOptions.lendborrowId].Comptroller,
            "value": "0",
            "gas": filterOptions.gas,
            "data": data
        };

        if (filterOptions.gasPriority !== undefined) {
            transactionObject.gasPrice = await getGasPrice(evmWeb3, {
                gasPriority: filterOptions.gasPriority
            }).then(res => res.gasPrice);
        }
    
        return (transactionObject);
    
    },

    getAssetInfoCompound: async () => throwErrorMessage("notApplicable"),

};