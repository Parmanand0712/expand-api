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

const yearnFinanceRegistriesContractAbi = require('../../../assets/abis/yearnFinanceRegistry.json');
const Common = require("../../../common/common");
const config = require('../../../common/configuration/config.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const { getGasPrice } = require('../chain/index');

module.exports = {

    depositVaultYearnFinance: async (evmWeb3, options) => {
        /*
            * Function will deposit the value to yearn vault if it's erc20 approved
        */

        const filterOptions = options;
        filterOptions.function = "depositVaultYearnFinance()";
        const validJson = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return (validJson);
        }

        // yearn vault Address is calculated as per tokenAddress and vault Number

        if (!filterOptions.vaultAddress) {

            const yearnFinanceRegistryAddress = config.yieldAggregator[filterOptions.yieldAggregatorId].yearnFinanceRegisteryAddress;
            const yearnFinanceRegistryContract = new evmWeb3.eth.Contract(yearnFinanceRegistriesContractAbi, yearnFinanceRegistryAddress);

            if (!Number.isInteger(filterOptions.vaultNumber))
                filterOptions.vaultNumber = await yearnFinanceRegistryContract.methods.numVaults(filterOptions.tokenAddress).call() - 1;

            filterOptions.vaultAddress = await yearnFinanceRegistryContract.methods.vaults(
                filterOptions.tokenAddress, filterOptions.vaultNumber
            ).call();

        }

        // yearn vault deposit is called

        const data = await Common.encodeFunctionData(evmWeb3, {
            "functionHash": "0xb6b55f25",
            "parametersType": ["uint256"],
            "parameters": [evmWeb3.utils.toHex(filterOptions.amount)]
        });

        const transactionObject = {
            "chainId": filterOptions.chainId,
            "from": filterOptions.from,
            "to": filterOptions.vaultAddress,
            "value": "0",
            "gas": filterOptions.gas,
            "data": data
        };

        if (filterOptions.gasPriority !== undefined) {
            transactionObject.gasPrice = await getGasPrice(evmWeb3, {
                gasPriority: filterOptions.gasPriority
            }).then(res => res.gasPrice);
        }

        return transactionObject;
    },

    depositVaultHarvestFinance: async (evmWeb3, options) => {
        /*
            * Function will deposit the value to harvest vault if it's erc20 approved
        */

        const filterOptions = options;
        filterOptions.function = "depositVaultHarvestFinance()";
        const validJson = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return (validJson);
        }

        if (filterOptions.tokenAddress) {
            const harvestFinanceVault = config.yieldAggregator[filterOptions.yieldAggregatorId].harvestVaults.find((vault) =>
                vault.tokenAddress === filterOptions.tokenAddress
            );
            if (harvestFinanceVault) filterOptions.vaultAddress = harvestFinanceVault.vaultAddress;
        }

        // harvest vault deposit is called
        const data = await Common.encodeFunctionData(evmWeb3, {
            "functionHash": "0xb6b55f25",
            "parametersType": ["uint256"],
            "parameters": [evmWeb3.utils.toHex(filterOptions.amount)]
        });

        const transactionObject = {
            "chainId": filterOptions.chainId,
            "from": filterOptions.from,
            "to": filterOptions.vaultAddress,
            "value": "0",
            "gas": filterOptions.gas,
            "data": data
        };

        if (filterOptions.gasPriority !== undefined) {
            transactionObject.gasPrice = await getGasPrice(evmWeb3, {
                gasPriority: filterOptions.gasPriority
            }).then(res => res.gasPrice);
        }

        return transactionObject;
    },
};
