/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a yield aggregator deposit response
    {
        transactionObject: {
            from: '0x91971d957f73CE43E41cc6a84d3Da9865040f3EB',
            to: '0xa258C4606Ca8206D8aA700cE2143D7db854D168c',
            value: '0',
            gas: '2307200',
            data: '0xb6b55f250000000000000000000000000000000000000000000000004563918244f40000'
        }
    }
*/

const Common = require("../../../common/common");
const schemaValidator = require('../../../common/configuration/schemaValidator');
const config = require('../../../common/configuration/config.json');
const { getGasPrice } = require('../chain/index');

module.exports = {
    depositPoolHarvestFinance: async (evmWeb3, options) => {
        /*
            * Function will deposit the value to harvest pool if it's erc20 approved
        */

        const filterOptions = options;
        filterOptions.function = "depositPoolHarvestFinance()";
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

        // staking f-asset into pool

        const stakeData = await Common.encodeFunctionData(evmWeb3, {
            "functionHash": "0xa694fc3a",
            "parametersType": ["uint256"],
            "parameters": [evmWeb3.utils.toHex(filterOptions.amount)]
        });

        const transactionObject = {
            "chainId": filterOptions.chainId,
            "from": filterOptions.from,
            "to": filterOptions.poolAddress,
            "value": "0",
            "gas": filterOptions.gas,
            "data": stakeData
        };

        if (filterOptions.gasPriority !== undefined) {
            transactionObject.gasPrice = await getGasPrice(evmWeb3, {
                gasPriority: filterOptions.gasPriority
            }).then(res => res.gasPrice);
        }

        return transactionObject;
    },
};
