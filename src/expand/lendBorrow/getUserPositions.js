/* eslint-disable prefer-destructuring */
/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a positions response
    [
        {
            "aToken": "0x030bA81f1c18d280636F32af80b9AAd02Cf0854e",
            "underlyingAsset": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
            "scaledATokenBalance": "5294314974264415",
            "usageAsCollateralEnabledOnUser": true
        }
    ]
 */
const compoundCTokenAbis = require('../../../assets/abis/compoundCToken.json');
const aaveV2DataProviderAbis = require('../../../assets/abis/aaveV2DataProvider.json');
const config = require('../../../common/configuration/config.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const comptrollerAbi = require('../../../assets/abis/compoundComptroller.json');
const cometAbi = require('../../../assets/abis/compound3Comet.json');
const pooldataABI = require('../../../assets/abis/uipooldataProvider.json');
const { isSmartContract, isValidContractAddress } = require('../../../common/contractCommon');


const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});

module.exports = {

    getUserPositionsAaveV2: async (web3, options) => {
        /*
         * Function will fetch the details of an user from aave V2
         */

        const filterOptions = options;
        filterOptions.function = "getUserPositionsAaveV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const { address } = filterOptions;
        const { dataPoolProvider, lendingPoolAddressProvider, dataProvider } = config.lendborrow[filterOptions.lendborrowId];

        const [isNotUserAddress, isValidAddress] = await Promise.all([
            isSmartContract(web3, address),
            isValidContractAddress(web3, address)
        ]);

        if (isNotUserAddress || !isValidAddress) return throwErrorMessage("invalidUserAddress");

        try {
            const poolDataContract = new web3.eth.Contract(pooldataABI, dataPoolProvider);
            const dataProviderContract = new web3.eth.Contract(aaveV2DataProviderAbis, dataProvider);
            const poolData = await poolDataContract.methods.getUserReservesData(lendingPoolAddressProvider, address).call();
            const data = poolData[0].filter((pool) => pool[1] > 0);
            const promises = data.map(async (element) => {
                const position = {};
                position.aToken = (await dataProviderContract.methods.getReserveTokensAddresses(element[0]).call()).aTokenAddress;
                position.underlyingAsset = element[0];
                position.scaledATokenBalance = element[1];
                position.usageAsCollateralEnabledOnUser = element[2];
                return position;
            });
            const response = await Promise.all(promises);
            return response;
        } catch (error) {
            return error;
        }
    },

    getUserPositionsAaveV3: async (web3, options) => {
        /*
         * Function will fetch the details of an user from aave V3
         */
        const filterOptions = options;
        filterOptions.function = "getUserPositionsAaveV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const { address } = filterOptions;
        const { dataPoolProvider, lendingPoolAddressProvider, dataProvider } = config.lendborrow[filterOptions.lendborrowId];

        const [isNotUserAddress, isValidAddress] = await Promise.all([
            isSmartContract(web3, address),
            isValidContractAddress(web3, address)
        ]);

        if (isNotUserAddress || !isValidAddress) return throwErrorMessage("invalidUserAddress");

        try {
            const poolDataContract = new web3.eth.Contract(pooldataABI, dataPoolProvider);
            const dataProviderContract = new web3.eth.Contract(aaveV2DataProviderAbis, dataProvider);
            const poolData = await poolDataContract.methods.getUserReservesData(lendingPoolAddressProvider, address).call();
            const data = poolData[0].filter((pool) => pool[1] > 0);
            const promises = data.map(async (element) => {
                const position = {};
                position.aToken = (await dataProviderContract.methods.getReserveTokensAddresses(element[0]).call()).aTokenAddress;
                position.underlyingAsset = element[0];
                position.scaledATokenBalance = element[1];
                position.usageAsCollateralEnabledOnUser = element[2];
                return position;
            });
            
            const response = await Promise.all(promises);

            return response;

        } catch (error) {
            return error;
        }

    },

    getUserPositionsCompound: async( web3, options ) => {
        /*
         * Function will fetch the details for a user from Compound
         */

        const filterOptions = options;
        filterOptions.function = "getUserPositionsAaveV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if ( !validJson.valid ) {
            return (validJson);
        }

        const { lendborrowId, address } = filterOptions;
        const [isNotUserAddress, isValidAddress] = await Promise.all([
            isSmartContract(web3, address),
            isValidContractAddress(web3, address)
        ]);

        if (isNotUserAddress || !isValidAddress) return throwErrorMessage("invalidUserAddress");

        const comptrollerAddress = config.lendborrow[lendborrowId].Comptroller;
        const comptroller = new web3.eth.Contract(comptrollerAbi, comptrollerAddress);

        try {
            const inMarkets = await comptroller.methods.getAssetsIn(address).call();
            const userPositions = await Promise.all(inMarkets.map(async (element) => {
                const position = {};
                position.cToken = element;
                const cToken = new web3.eth.Contract(
                    compoundCTokenAbis, 
                    element
                );
                if (element === config.lendborrow[lendborrowId].ctokens.cETH)
                    position.underlyingAsset = config.wethAddress[1];
                else 
                    position.underlyingAsset = await cToken.methods.underlying().call();
                position.scaledCTokenBalance = await  cToken.methods.balanceOf(address).call();
                position.usageAsCollateralEnabledOnUser = true;
                return position;
            }));
            return userPositions;
        } catch(error) {
            return error;
        }
    },
    getUserPositionsCompoundV3: async( web3, options ) => {
        /*
         * Function will fetch the details for a user from CompoundV3
         */

        const filterOptions = options;
        filterOptions.function = "getUserPositionsAaveV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if ( !validJson.valid ) {
            return (validJson);
        }

        const {address, lendborrowId } = filterOptions;
        if(web3.utils.isAddress(address) === false) return throwErrorMessage("invalidUserAddress");

        const allMarkets  = config.lendborrow[lendborrowId].markets;

        const response = [];
        for await (const market of allMarkets) {
            const comet = new web3.eth.Contract(cometAbi , config.lendborrow[lendborrowId][market].comet);
            const balance = await comet.methods.balanceOf(address).call();
            if (balance === "0")
                // eslint-disable-next-line no-continue
                continue;
            const baseToken = await comet.methods.baseToken().call();
            const underlyingAssets = Object.keys(config.lendborrow[lendborrowId][market].assets);
            response.push({
                    'tokenAddress': baseToken,
                    'baseTokenBalance': balance,
                    'underlyingAsset': underlyingAssets,
                    'usageAsCollateralEnabledOnUser': true
            });
        }
        return response;
    }
};