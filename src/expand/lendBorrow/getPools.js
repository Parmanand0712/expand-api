/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a Pool response
    [{
        'tokenAddress': '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        'variableBorrowRate': '4.83',
        'stableBorrowRate': '5.29',
        'variableSupplyRate': '2.83',
        'stableSupplyRate': '3.29',
    },]
 */

const async = require('async');
const config = require('../../../common/configuration/config.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const { getPoolAaveV2 , getPoolAaveV3, getPoolCompound } = require('./getPool');
const { getUserBalanceEvm } = require('../fungibleTokens/getUserBalance');
const { getUserAccountDataAaveV2 , getUserAccountDataAaveV3, getUserAccountDataCompound} = require('./getUserAccountData');
const tokenConfig = require("../../../common/configuration/tokenConfig.json");
const errorMessage = require('../../../common/configuration/errorMessage.json');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});

module.exports = {

    getPoolsAaveV2: async (web3, options) => {
        /*
         * Function will fetch the pool from aave V2
         */
        const filterOptions = options;
        filterOptions.function = "getPoolsAave()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }
        const response = {};
        const tokenSymbols = await config.lendborrow[filterOptions.lendborrowId].tokens;
        await async.each(filterOptions.assets, async (tokenAddress) => {
            try{
                const fOptions = {
                    ...filterOptions,
                    asset: tokenAddress,
                };
                fOptions.tokenAddress = tokenAddress;
                const threads = [];
                threads.push(getPoolAaveV2(web3, fOptions));
                if(fOptions.user) {
                    threads.push(getUserBalanceEvm(web3,fOptions));
                    threads.push(getUserAccountDataAaveV2(web3,fOptions));
                    const res = await Promise.all(threads);
                    if (res[0].tokenAddress.toLowerCase() in tokenSymbols) {
                        res[0].tokenSymbol = tokenSymbols[res[0].tokenAddress.toLowerCase()].symbol;
                        response[res[0].tokenSymbol] = {...res[0], ...res[1], ...res[2]};
                    }
                }
                else {
                    const res = await Promise.all(threads);
                    if (res[0].tokenAddress.toLowerCase() in tokenSymbols) {
                        res[0].tokenSymbol = tokenSymbols[res[0].tokenAddress.toLowerCase()].symbol;
                        response[res[0].tokenSymbol] = {...res[0], ...res[1], ...res[2]};
                    }
                }
            } catch (error){
                if(error){
                    console.log(JSON.stringify({ message: 'in async loop', params: { tokenAddress }, error }, null, 2));
                }
            }
            
        });
        return (response);
    },

    getPoolsAaveV3: async (web3, options) => {
        /*
         * Function will fetch the pool from aave V2
         */
        const filterOptions = options;
        filterOptions.function = "getPoolsAave()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }
        const response = {};
        const tokenSymbols = await config.lendborrow[filterOptions.lendborrowId].tokens;
        await async.each(filterOptions.assets, async (tokenAddress) => {
            try{
                const fOptions = {
                    ...filterOptions,
                    asset: tokenAddress,
                };
                fOptions.tokenAddress = tokenAddress;
                const threads = [];
                threads.push(getPoolAaveV3(web3, fOptions));
                if(fOptions.user) {
                    fOptions.address = fOptions.user;
                    threads.push(getUserBalanceEvm(web3,fOptions));
                    threads.push(getUserAccountDataAaveV3(web3,fOptions));
                    const res = await Promise.all(threads);
                    if (res[0].tokenAddress.toLowerCase() in tokenSymbols) {
                        res[0].tokenSymbol = tokenSymbols[res[0].tokenAddress.toLowerCase()].symbol;
                        response[res[0].tokenSymbol] = {...res[0], ...res[1], ...res[2]};
                    }
                }
                else {
                    const res = await Promise.all(threads);
                    if (res[0].tokenAddress.toLowerCase() in tokenSymbols) {
                        res[0].tokenSymbol = tokenSymbols[res[0].tokenAddress.toLowerCase()].symbol;
                        response[res[0].tokenSymbol] = {...res[0], ...res[1], ...res[2]};
                    }
                }
            } catch (error){
                    response.data = error;
            }
            
        });
        return (response);
    },


    getPoolsCompound: async (web3, options) => {
        /*
         * Function will fetch the pool details from Compound
         */

        // Constant values as per the compound documentation - https://compound.finance/docs#protocol-math

        const filterOptions = options;
        filterOptions.function = "getPoolsCompound()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }
        const response = {};
        await async.each(filterOptions.assets, async (asset) => {
            console.log(asset);
            try {
                const fOptions = {
                    ...filterOptions,
                    asset,
                };
                fOptions.tokenAddress = tokenConfig[fOptions.chainId][fOptions.asset.toUpperCase()];
                const threads = [];
                threads.push(getPoolCompound(web3, fOptions));
                if (fOptions.user){
                    threads.push(getUserBalanceEvm(web3,fOptions));
                    threads.push(getUserAccountDataCompound(web3,fOptions));
                    const res = await Promise.all(threads);
                    response[res[0].tokenSymbol] = {...res[0], ...res[1], ...res[2]};
                }
                else {
                    const res = await Promise.all(threads);
                    response[res[0].tokenSymbol] = {...res[0]};
                }
            } catch (error){
                console.log(JSON.stringify({ message: 'in async loop', params: { asset }, error }, null, 2));
            }
        });
        return (response);
    },

    getPoolsCompoundV3: async () => throwErrorMessage("notApplicable"),
};