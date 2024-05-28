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

const yearnFinanceRegistriesContractAbi = require('../../../assets/abis/yearnFinanceRegistry.json');
const Common = require("../../../common/common");
const config = require('../../../common/configuration/config.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const { getGasPrice } = require('../chain/index');

module.exports = {

    withdrawVaultYearnFinance: async (evmWeb3, options) => {
        /*
            * Function will withdraw the value to yearn vault
        */

        const filterOptions = options;
        filterOptions.function = "getVaultsYearnFinance()";
        const validJson = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return (validJson);
        }

        // fetching the vaultAddress as per tokenAddress and vaultNumber if not provided

        if (!filterOptions.vaultAddress) {

            const yearnFinanceRegistryAddress = config.yieldAggregator[filterOptions.yieldAggregatorId].yearnFinanceRegisteryAddress;
            const yearnFinanceRegistryContract = new evmWeb3.eth.Contract(yearnFinanceRegistriesContractAbi, yearnFinanceRegistryAddress);

            if (!Number.isInteger(filterOptions.vaultNumber))
                filterOptions.vaultNumber = await yearnFinanceRegistryContract.methods.numVaults(filterOptions.tokenAddress).call() - 1;

            filterOptions.vaultAddress = await yearnFinanceRegistryContract.methods.vaults(
                filterOptions.tokenAddress, filterOptions.vaultNumber
            ).call();
        }

        // yearn vault withdraw is called

        const data = await Common.encodeFunctionData(evmWeb3, {
            "functionHash": "0x2e1a7d4d",
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

    withdrawVaultHarvestFinance: async (evmWeb3, options) => {
        /*
            * Function will withdraw the value from harvest vault
        */

        const filterOptions = options;
        filterOptions.function = "withdrawVaultHarvestFinance()";
        const validJson = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return (validJson);
        }
        // harvest withdraw from vault

        if (filterOptions.tokenAddress) {
            const harvestFinanceVault = config.yieldAggregator[filterOptions.yieldAggregatorId].harvestVaults.find((vault) =>
                vault.tokenAddress === filterOptions.tokenAddress
            );
            if (harvestFinanceVault) filterOptions.vaultAddress = harvestFinanceVault.vaultAddress;
        }

        const data = await Common.encodeFunctionData(evmWeb3, {
            "functionHash": "0x2e1a7d4d",
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
