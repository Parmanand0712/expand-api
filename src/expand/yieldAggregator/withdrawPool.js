/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a yield aggregator withdraw response
    {
      from: '0x05EEdB60190c626DB28F786D7bdDbBbeEfdfFA73',
      to: '0x3DA9D911301f8144bdF5c3c67886e5373DCdff8e',
      value: '0',
      gas: '2307200',
      data: '0x2e1a7d4d0000000000000000000000000000000000000000000000000000000000000001'
    }
*/

const Common = require("../../../common/common");
const schemaValidator = require('../../../common/configuration/schemaValidator');
const config = require('../../../common/configuration/config.json');
const { getGasPrice } = require('../chain/index');

module.exports = {
    withdrawPoolHarvestFinance: async (evmWeb3, options) => {
        /*
            * Function will withdraw the value from harvest pool
        */

        const filterOptions = options;
        filterOptions.function = "withdrawPoolHarvestFinance()";
        const validJson = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return (validJson);
        }

        if (filterOptions.tokenAddress) {
            const harvestFinanceVault = config.yieldAggregator[filterOptions.yieldAggregatorId].harvestVaults.find((vault) =>
                vault.tokenAddress === filterOptions.tokenAddress
            );
            if (harvestFinanceVault) filterOptions.poolAddress = harvestFinanceVault.poolAddress;
        }

        const withdrawData = await Common.encodeFunctionData(evmWeb3, {
            "functionHash": "0x2e1a7d4d",
            "parametersType": ["uint256"],
            "parameters": [evmWeb3.utils.toHex(filterOptions.amount)]
        });

        const transactionObject = {
            "chainId": filterOptions.chainId,
            "from": filterOptions.from,
            "to": filterOptions.poolAddress,
            "value": "0",
            "gas": filterOptions.gas,
            "data": withdrawData
        };

        if (filterOptions.gasPriority !== undefined) {
            transactionObject.gasPrice = await getGasPrice(evmWeb3, {
                gasPriority: filterOptions.gasPriority
            }).then(res => res.gasPrice);
        }

        return transactionObject;
    },
};
