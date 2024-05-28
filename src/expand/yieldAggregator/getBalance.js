/* 
 * All the function in this file
 * should be returning the following schema
 * 
    {
        "vaultBalance": "1000000", // wei
        "poolBalance": "1000" // only for harvest finance
    }
*/

const yearnFinanceRegistriesContractAbi = require('../../../assets/abis/yearnFinanceRegistry.json');
const yearnFinanceVaultContractAbi = require('../../../assets/abis/yearnVaultContract.json');
const harvestFinanceVaultContractAbi = require('../../../assets/abis/harvestVaultContract.json');
const harvestFinancePoolContractAbi = require('../../../assets/abis/harvestPoolContract.json');
const config = require('../../../common/configuration/config.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');

module.exports = {

    getBalanceYearnFinance: async (evmWeb3, options) => {
        /*
            * Function will fetch the balance for given wallet from yearn vault
        */

        const filterOptions = options;
        filterOptions.function = "getBalanceYearnFinance()";
        const validJson = await schemaValidator.validateInput(options);
        if ( !validJson.valid ) {
            return (validJson);
        }

        let balance = 0;
        const response = {};

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

        // fetching the balance for computed vaultAddress
        const yearnVaultContract = new evmWeb3.eth.Contract(yearnFinanceVaultContractAbi, filterOptions.vaultAddress);
        balance = await yearnVaultContract.methods.balanceOf(filterOptions.address).call();

        response.vaultBalance = balance.toString();
        return (response);
    },

    getBalanceHarvestFinance: async (evmWeb3, options) => {
        /*
            * Function will fetch the balance for given wallet from harvest vault or pool
        */

        const filterOptions = options;
        filterOptions.function = "getBalanceHarvestFinance()";
        const validJson = await schemaValidator.validateInput(options);
        if ( !validJson.valid ) {
            return (validJson);
        }

        let vaultBalance = 0;
        let poolBalance = 0;
        const response = {};

        if (filterOptions.tokenAddress) {
            const harvestFinanceVault = config.yieldAggregator[filterOptions.yieldAggregatorId].harvestVaults.find((vault) => 
                vault.tokenAddress === filterOptions.tokenAddress
            );
            if (harvestFinanceVault) {
                filterOptions.poolAddress = harvestFinanceVault.poolAddress;
                filterOptions.vaultAddress = harvestFinanceVault.vaultAddress;
            }
        }

        // fetching the balance for vaultAddress and poolAddress
        if (filterOptions.poolAddress) {
            const harvestPoolContract = new evmWeb3.eth.Contract(harvestFinancePoolContractAbi, filterOptions.poolAddress);
            poolBalance = await harvestPoolContract.methods.balanceOf(filterOptions.address).call();
        }
        if (filterOptions.vaultAddress) {
            const harvestVaultContract = new evmWeb3.eth.Contract(harvestFinanceVaultContractAbi, filterOptions.vaultAddress);
            vaultBalance = await harvestVaultContract.methods.balanceOf(filterOptions.address).call();
        }

        response.vaultBalance = vaultBalance.toString();
        response.poolBalance = poolBalance.toString();
        return (response);
    },
};
