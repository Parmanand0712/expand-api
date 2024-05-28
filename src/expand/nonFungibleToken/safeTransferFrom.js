/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a erc 721 safeTransferFrom response
    {
      from: '0x8e7D7a97b4aa8B6D857968058A03cd25707Ed025',
      to: '0xf86ee4c21be45daa7d6f7f76a928f37c171c1ed7',
      gas: '200000',
      data: '0x42842e0e0000000000000000000000008e7d7a97b4aa8b6d857968058a03cd25707ed025000000000000000000000000731fdbd6871ad5cd905ee560a84615229ed8197a0000000000000000000000000000000000000000000000000000000000000002'
    }
*/

const Common = require("../../../common/common");
const schemaValidator = require('../../../common/configuration/schemaValidator');
const { getGasPrice } = require('../chain/index');

module.exports = {

    safeTransferFromEvm: async (evmWeb3, options) => {
        /*
            * Function will prepare the erc 721 safeTransferFrom 
        */

        const filterOptions = options;
        filterOptions.function = "safeTransferFrom()";
        const validJson = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return (validJson);
        }

        const data = await Common.encodeFunctionData(evmWeb3, {
            "functionHash": "0x42842e0e",
            "parametersType": ["address", "address", "uint256"],
            "parameters": [filterOptions.from, filterOptions.to, filterOptions.tokenId]
        });

        const transactionObject = {
            "chainId": filterOptions.chainId,
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
