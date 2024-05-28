/* 
 * All the function in this file
 * should be returning the following schema for yearn finance and for harvest finance
 * response is hardcoded.
    {
        tokenVaults: [
          {
            vaultAddress: '0xa9fE4601811213c340e850ea305481afF02f5b28',
            apy: '12.88' // percentage
            vaultNumber: 0, // only for yearn finance
            poolAddress: '0x3DA9D911301f8144bdF5c3c67886e5373DCdff8e' // only for harvest finance
          },
          {
            vaultAddress: '0xa258C4606Ca8206D8aA700cE2143D7db854D168c',
            apy: '0.21' // percentage
            vaultNumber: 1, // only for yearn finance
            poolAddress: '0x3DA9D911301f8144bdF5c3c67886e5373DCdff8e' // only for harvest finance
          }
        ]
    }
*/

const yearnFinanceVaultContractAbi = require('../../../assets/abis/yearnVaultContract.json');
const yearnFinanceRegistriesContractAbi = require('../../../assets/abis/yearnFinanceRegistry.json');
const config = require('../../../common/configuration/config.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const apiCallHelper = require('../../../common/api-call-helper');

module.exports = {

    getVaultsYearnFinance: async (evmWeb3, options) => {
        /*
            * Function will fetch the yearn vaults for a given token
        */

        const filterOptions = options;
        filterOptions.function = "getVaultsYearnFinance()";
        const validJson = await schemaValidator.validateInput(options);
        if (!validJson.valid) {
            return (validJson);
        }

        const totalVaults = [];
        const response = {};
        const tokenArray = {};

        const yearnFinanceRegistryAddress = config.yieldAggregator[filterOptions.yieldAggregatorId].yearnFinanceRegisteryAddress;
        const yearnFinanceRegistryContract = new evmWeb3.eth.Contract(yearnFinanceRegistriesContractAbi, yearnFinanceRegistryAddress);

        try {

            if (filterOptions.tokenAddress === null || filterOptions.tokenAddress === undefined) {

                const tokenVaultData = async () => {

                    const numVaults = await yearnFinanceRegistryContract.methods.numTokens().call();

                    const promises = [];
                    for (let i = 0; i < numVaults; i += 1) {
                        promises.push((async () => {
                            const tokenAddress = await yearnFinanceRegistryContract.methods.tokens(i).call();
                            const totalVaultsCount = await yearnFinanceRegistryContract.methods.numVaults(tokenAddress).call();

                            const tokenData = [];
                            for (let j = 0; j < totalVaultsCount; j += 1) {
                                // eslint-disable-next-line no-await-in-loop
                                const vaultAddress = await yearnFinanceRegistryContract.methods.vaults(tokenAddress, j).call();
                                const yearnVaultContract = new evmWeb3.eth.Contract(yearnFinanceVaultContractAbi, vaultAddress);
                                // eslint-disable-next-line no-await-in-loop
                                const [latestPrice, oldPrice] = await Promise.all([
                                    yearnVaultContract.methods.pricePerShare().call(),
                                    // eslint-disable-next-line no-await-in-loop
                                    yearnVaultContract.methods.pricePerShare().call(null, await evmWeb3.eth.getBlockNumber() - 192000),
                                ]);

                                const vaultAPY = ((((latestPrice / oldPrice) ** 12) - 1) * 100).toFixed(2);

                                tokenData.push({ vaultAddress, apy: vaultAPY, vaultNumber: j });
                            }

                            tokenArray[tokenAddress] = tokenData;
                        })());
                    }

                    await Promise.all(promises);
                    return tokenArray;

                };
                const res = await tokenVaultData();
                response.tokenVaults = res;

                return (response);

            }

            else {

                const totalVaultsCount = await yearnFinanceRegistryContract.methods.numVaults(filterOptions.tokenAddress).call();

                for (let i = 0; i < totalVaultsCount; i += 1) {
                    // eslint-disable-next-line no-await-in-loop
                    const vaultAddress = await yearnFinanceRegistryContract.methods.vaults(filterOptions.tokenAddress, i).call();

                    // APY calculation
                    const yearnVaultContract = new evmWeb3.eth.Contract(yearnFinanceVaultContractAbi, vaultAddress);
                    // eslint-disable-next-line no-await-in-loop
                    const latestPrice = await yearnVaultContract.methods.pricePerShare().call();
                    // eslint-disable-next-line no-await-in-loop
                    yearnVaultContract.defaultBlock = await evmWeb3.eth.getBlockNumber() - 192000;
                    // eslint-disable-next-line no-await-in-loop
                    const oldPrice = await yearnVaultContract.methods.pricePerShare().call();

                    const vaultAPY = ((((latestPrice / oldPrice) ** 12) - 1) * 100).toFixed(2);

                    totalVaults.push({ 'vaultAddress': vaultAddress, 'apy': vaultAPY, 'vaultNumber': i });
                }

                response.tokenVaults = totalVaults;

                return (response);
            }
        }
        catch (error) {
            return (error);
        }
    },

    getVaultsHarvestFinance: async (web3, options) => {
        /*
            * Function will fetch the harvest vaults
        */

        const filterOptions = options;
        const totalVaults = [];
        const response = {};

        filterOptions.function = "getVaultsHarvestFinance()";
        const validJson = await schemaValidator.validateInput(options);
        if (!validJson.valid) {
            return (validJson);
        }

        const harvestFinanceVaults = config.yieldAggregator[filterOptions.yieldAggregatorId].harvestVaults;
        try {
            await Promise.all(
                harvestFinanceVaults.map(async (vault) => {
                    if (vault.tokenAddress === filterOptions.tokenAddress) {

                        // Apy Calculation

                        let poolApy = 0;
                        let vaultApy = 0;

                        // vault Apy Calculation
                        const vaults = await apiCallHelper.apiCall(
                            config.yieldAggregator[filterOptions.yieldAggregatorId].harvestFinanceVaultsUrl,
                            'GET',
                            {},
                            {
                                Accept: 'application/json',
                            }
                        );

                        if (vaults.eth[vault.vaultName]) {
                            vaultApy = Number(vaults.eth[vault.vaultName].estimatedApy);
                        }

                        // pool Apy calculation
                        const pools = await apiCallHelper.apiCall(
                            config.yieldAggregator[filterOptions.yieldAggregatorId].harvestFinancePoolsUrl,
                            'GET',
                            {},
                            {
                                Accept: 'application/json',
                            }
                        );

                        for (let i = 0; i < pools.eth.length; i += 1) {
                            if (pools.eth[i].id === vault.vaultName) {
                                poolApy = Number(pools.eth[i].boostedRewardAPY);
                                break;
                            }
                        }

                        totalVaults.push({
                            'vaultAddress': vault.vaultAddress,
                            'apy': (poolApy + vaultApy).toFixed(2),
                            'poolAddress': vault.poolAddress,
                        });

                    }

                    else if (filterOptions.tokenAddress === undefined) {

                        let poolApy = 0;
                        let vaultApy = 0;

                        // vault Apy Calculation
                        const vaults = await apiCallHelper.apiCall(
                            config.yieldAggregator[filterOptions.yieldAggregatorId].harvestFinanceVaultsUrl,
                            'GET',
                            {},
                            {
                                Accept: 'application/json',
                            }
                        );

                        if (vaults.eth[vault.vaultName]) {
                            vaultApy = Number(vaults.eth[vault.vaultName].estimatedApy);
                        }

                        // pool Apy calculation
                        const pools = await apiCallHelper.apiCall(
                            config.yieldAggregator[filterOptions.yieldAggregatorId].harvestFinancePoolsUrl,
                            'GET',
                            {},
                            {
                                Accept: 'application/json',
                            }
                        );

                        for (let i = 0; i < pools.eth.length; i += 1) {
                            if (pools.eth[i].id === vault.vaultName) {
                                poolApy = Number(pools.eth[i].boostedRewardAPY);
                                break;
                            }
                        }

                        totalVaults.push({
                            [vault.tokenAddress]: { 
                                'vaultAddress': vault.vaultAddress,
                                'apy': (poolApy + vaultApy).toFixed(2),
                                'poolAddress': vault.poolAddress,
                            }
                        });
                    }
                }),
            );

            response.tokenVaults = totalVaults;
            return (response);
        }

        catch (error) {
            return (error);
        }
    },
};
