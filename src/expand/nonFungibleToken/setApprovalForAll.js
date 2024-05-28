/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a erc 721 setApprovalForAll response
    {
      from: '0x731FDBd6871aD5cD905eE560A84615229eD8197a',
      to: '0xf86ee4c21be45daa7d6f7f76a928f37c171c1ed7',
      gas: '99999',
      data: '0xa22cb4650000000000000000000000008e7d7a97b4aa8b6d857968058a03cd25707ed0250000000000000000000000000000000000000000000000000000000000000001'
    }
*/

const Common = require("../../../common/common");
const schemaValidator = require('../../../common/configuration/schemaValidator');
const { getGasPrice } = require('../chain/index');

module.exports = {

    setApprovalForAllEvm: async (evmWeb3, options) => {
        /*
            * Function will prepare the erc 721 setApprovalForAll 
        */

        const filterOptions = options;
        filterOptions.function = "setApprovalForAll()";
        const validJson = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return (validJson);
        }

        const data = await Common.encodeFunctionData(evmWeb3, {
            "functionHash": "0xa22cb465",
            "parametersType": ["address", "bool"],
            "parameters": [filterOptions.operatorAddress, filterOptions.approved]
        });

        const transactionObject = {
            "chainId": filterOptions.chainId,
            // "contractAddress" : filterOptions.contractAddress,
            "from": filterOptions.from,
            "to": filterOptions.contractAddress,
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
};
