/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema response
    {
        transactionObject: {
            "from": "0x63056E00436Da25BcF48A40dfBbDcc7089351006",
            "to": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
            "value": "0",
            "gas": 229880,
            "data": "0x38ed1739000000000000000000000000000000000000000000000000002386f26fc10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000063056e00436da25bcf48a40dfbbdcc70893510060000000000000000000000000000000000000000000000000000000062ae394b0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000d0a1e359811322d97991e03f863a0c30c2cf029c0000000000000000000000004f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa"
        }
    }
*/

const common = require("../../../common/common");
const schemaValidator = require('../../../common/configuration/schemaValidator');
const config = require('../../../common/configuration/config.json');
const { getGasPrice } = require('../chain/index');

module.exports = {

    depositPeggedTokenSynthetix: async (evmWeb3, options) => {
        /*
         * Function to convert Ethers to equivalent SUSD Tokens
         *
         */

        const filterOptions = options;
        filterOptions.function = "depositPeggedTokenSynthetix()";
        const validJson = await schemaValidator.validateInput(options);
        if (!validJson.valid) {
            return validJson;
        }

        const data = await common.encodeFunctionData(evmWeb3, {
            "functionHash": "0xdc8fa6c2",
            "parametersType": ["uint256"],
            "parameters": [filterOptions.amount]
        });

        const transactionObject = {
            "chainId": filterOptions.chainId,
            "from": filterOptions.from,
            "value": '0',
            "gas": filterOptions.gas,
            "data": data,
            "to": config.synthetic[filterOptions.syntheticId].address.depot
        };

        if (filterOptions.gasPriority !== undefined) {
            transactionObject.gasPrice = await getGasPrice(evmWeb3, {
                gasPriority: filterOptions.gasPriority
            }).then(res => res.gasPrice);
        }

        return transactionObject;

    }

};
