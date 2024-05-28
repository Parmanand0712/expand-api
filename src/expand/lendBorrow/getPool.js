/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a Pool response
    {
        'tokenAddress': '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        'variableBorrowRate': '4.83',
        'stableBorrowRate': '5.29',
        'variableSupplyRate': '2.83',
        'stableSupplyRate': '3.29',
    }
 */

const { BigNumber } = require("bignumber.js");
const aaveV2PoolAbis = require('../../../assets/abis/aaveV2Pool.json');
const aaveV2DataProviderAbis = require("../../../assets/abis/aaveV2DataProvider.json");
const aaveV3PoolDataProviderAbis = require("../../../assets/abis/aaveV3PoolDataProvider.json");
const compoundCTokenAbis = require('../../../assets/abis/compoundCToken.json');
const cometAbi = require('../../../assets/abis/compound3Comet.json');
const cometExtAbi = require('../../../assets/abis/compoundV3CometExt.json');
const comptrollerAbi = require('../../../assets/abis/compoundComptroller.json');
const config = require('../../../common/configuration/config.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const { isErc20Contract } = require('../../../common/contractCommon');
const errorMessage = require('../../../common/configuration/errorMessage.json');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});

module.exports = {

    getPoolAaveV2: async (web3, options) => {
        /*
         * Function will fetch the pool from aave V2
         */
        const filterOptions = options;
        filterOptions.function = "getPoolAave()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        let response = {};
        filterOptions.lendPoolAddress = await config.lendborrow[filterOptions.lendborrowId].poolAddress;
        const { dataProvider, poolAddress } = config.lendborrow[filterOptions.lendborrowId];
        const { asset } = filterOptions;

        if (!await isErc20Contract(web3, asset))
            return throwErrorMessage("invalidErc20Contract");

        const { tokens } = config.lendborrow[filterOptions.lendborrowId];

        if (!tokens[asset.toLowerCase()]?.symbol)
            return throwErrorMessage("poolDoesNotExist");

        const pool = new web3.eth.Contract(
            aaveV2PoolAbis,
            filterOptions.lendPoolAddress
        );

        const poolDataContract = new web3.eth.Contract(
            aaveV2DataProviderAbis,
            dataProvider
        );

        const data = await pool.methods.getReserveData(
            filterOptions.asset
        ).call();

        const ltvData = await poolDataContract.methods.getReserveConfigurationData(asset).call();
        const reserveData = await poolDataContract.methods.getReserveData(asset).call();

        const availableLiquidity = new BigNumber(reserveData.availableLiquidity);
        const totalVariableDebt = new BigNumber(reserveData.totalVariableDebt);
        const totalStableDebt = new BigNumber(reserveData.totalStableDebt);

        const reserveSize = availableLiquidity
            .plus(totalVariableDebt)
            .plus(totalStableDebt)
            .toFixed();

        response = {
            'tokenAddress': filterOptions.asset,
            'poolAddress': poolAddress,
            'variableBorrowRate': Number(data[4] / (10 ** 25)).toFixed(2),
            'stableBorrowRate': Number(data[5] / (10 ** 25)).toFixed(2),
            'variableSupplyRate': '0',
            'stableSupplyRate': Number(data[3] / (10 ** 25)).toFixed(2),
            'ltv': parseFloat(ltvData.ltv / 100).toString(),
            'availableLiquidity': reserveData.availableLiquidity,
            'reserveSize': reserveSize
        };

        return (response);

    },

    getPoolAaveV3: async (web3, options) => {
        /*
         * Function will fetch the pool from aave V2
         */
        const filterOptions = options;
        filterOptions.function = "getPoolAave()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        let response = {};
        filterOptions.lendPoolAddress = await config.lendborrow[filterOptions.lendborrowId].poolAddress;
        const { dataProvider, poolAddress } = config.lendborrow[filterOptions.lendborrowId];
        const { asset } = filterOptions;

        if (!await isErc20Contract(web3, asset))
            return throwErrorMessage("invalidErc20Contract");

        const { tokens } = config.lendborrow[filterOptions.lendborrowId];

        if (!tokens[asset.toLowerCase()]?.symbol)
            return throwErrorMessage("poolDoesNotExist");

        const pool = new web3.eth.Contract(
            aaveV2PoolAbis,
            filterOptions.lendPoolAddress
        );

        const poolDataContract = new web3.eth.Contract(
            aaveV3PoolDataProviderAbis,
            dataProvider
        );

        const data = await pool.methods.getReserveData(
            filterOptions.asset
        ).call();

        const ltvData = await poolDataContract.methods.getReserveConfigurationData(asset).call();
        const reserveData = await poolDataContract.methods.getReserveData(asset).call();
        const totalAToken = new BigNumber(reserveData.totalAToken);
        const totalVariableDebt = new BigNumber(reserveData.totalVariableDebt);
        const totalStableDebt = new BigNumber(reserveData.totalStableDebt);

        const availableLiquidity = totalAToken
            .minus(totalVariableDebt)
            .minus(totalStableDebt)
            .toFixed();

        response = {
            'tokenAddress': filterOptions.asset,
            'poolAddress': poolAddress,
            'variableBorrowRate': Number(data[4] / (10 ** 25)).toFixed(2),
            'stableBorrowRate': Number(data[5] / (10 ** 25)).toFixed(2),
            'variableSupplyRate': '0',
            'stableSupplyRate': Number(data[2] / (10 ** 25)).toFixed(2),
            'ltv': parseFloat(ltvData.ltv / 100).toString(),
            'availableLiquidity': availableLiquidity.toString(),
            'reserveSize': reserveData.totalAToken
        };

        return (response);

    },


    getPoolCompound: async (web3, options) => {
        /*
         * Function will fetch the pool details from Compound
         */

        // Constant values as per the compound documentation - https://compound.finance/docs#protocol-math

        const filterOptions = options;
        filterOptions.function = "getPoolCompound()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const ethMantissa = 1e18;
        const blocksPerDay = 7159;
        const daysPerYear = 365;

        const token = `c${(filterOptions.asset).toUpperCase()}`;
        filterOptions.cTokenAddress = await config.lendborrow[filterOptions.lendborrowId].ctokens[token];

        if (!filterOptions.cTokenAddress)
            return throwErrorMessage("poolDoesNotExist");

        const { Comptroller } = config.lendborrow[filterOptions.lendborrowId];

        const cToken = new web3.eth.Contract(
            compoundCTokenAbis,
            filterOptions.cTokenAddress
        );

        const comptroller = new web3.eth.Contract(
            comptrollerAbi,
            Comptroller,
        );

        const threads = [];
        threads.push(cToken.methods.supplyRatePerBlock().call());
        threads.push(cToken.methods.borrowRatePerBlock().call());
        threads.push(cToken.methods.totalReserves().call());
        threads.push(cToken.methods.getCash().call());
        threads.push(comptroller.methods.markets(filterOptions.cTokenAddress).call());


        const [supplyRatePerBlock, borrowRatePerBlock, reserveSize, availableLiquidity, ltvData] = await Promise.all(threads);
        const supplyApy = (((((supplyRatePerBlock / ethMantissa * blocksPerDay) + 1) ** daysPerYear)) - 1) * 100;

        const borrowApy = (((((borrowRatePerBlock / ethMantissa * blocksPerDay) + 1) ** daysPerYear)) - 1) * 100;

        const response = {
            'tokenAddress': filterOptions.cTokenAddress,
            'poolAddress': Comptroller,
            'variableBorrowRate': '0',
            'stableBorrowRate': borrowApy.toString(),
            'variableSupplyRate': '0',
            'stableSupplyRate': supplyApy.toString(),
            'ltv': parseFloat((ltvData.collateralFactorMantissa * 10000 / ethMantissa)/100).toString(),
            'availableLiquidity': availableLiquidity,
            'reserveSize': reserveSize
        };

        return (response);

    },
    getPoolCompoundV3: async (web3, options) => {
        /*
         * Function will fetch the pool details from Compound
         */

        // Constant values as per the compound documentation - https://compound.finance/docs#protocol-math

        const filterOptions = options;
        filterOptions.function = "getPoolCompV3()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const [priceFeedMantissa, usdcMantissa, secondsPerDay, daysInYear] = [1e8, 1e6, 60 * 60 * 24, 365];
        const { lendborrowId, market } = filterOptions;
        const { compPriceFeedAddress, comet, cometExt } = config.lendborrow[lendborrowId][market];

        const cometContract = new web3.eth.Contract(cometAbi, comet);
        const cometExtContract = new web3.eth.Contract(cometExtAbi, cometExt);
        const utilizationRate = await cometContract.methods.getUtilization().call();
        const [supplyRate, borrowRate, baseToken] = await Promise.all([cometContract.methods.getSupplyRate(utilizationRate).call(),
        cometContract.methods.getBorrowRate(utilizationRate).call(), cometContract.methods.baseToken().call()]);

        const supplyApy = ((supplyRate / (10 ** 18) * (secondsPerDay * daysInYear) * 100)).toFixed(2);

        const borrowApy = ((borrowRate / (10 ** 18) * (secondsPerDay * daysInYear) * 100)).toFixed(2);

        const baseIndexScale = +(await cometExtContract.methods.baseIndexScale().call());
        const totalSupply = await cometContract.methods.totalSupply().call();
        const totalBorrow = await cometContract.methods.totalBorrow().call();
        const baseTokenPriceFeed = await cometContract.methods.baseTokenPriceFeed().call();

        const reserves = await cometContract.methods.getReserves().call();
        const collatoralAssets = config.lendborrow[lendborrowId][market].assets;
        console.log(Object.keys(collatoralAssets));

        const ltv = [];
        for await (const address of Object.keys(collatoralAssets)) {
            if (address !== baseToken) {
                const ltvData = {};
                ltvData[address] = (parseFloat((await cometContract.methods.getAssetInfoByAddress(address).call())
                                  .borrowCollateralFactor / 10 ** 14)/100).toString();

                ltv.push(ltvData);
            }
        }

        const compPriceInUsd = +(await cometContract.methods.getPrice(compPriceFeedAddress).call()).toString() / priceFeedMantissa;
        const usdcPriceInUsd = +(await cometContract.methods.getPrice(baseTokenPriceFeed).call()).toString() / priceFeedMantissa;

        const usdcTotalSupply = +totalSupply.toString() / usdcMantissa;
        const usdcTotalBorrow = +totalBorrow.toString() / usdcMantissa;
        const baseTrackingSupplySpeed = +(await cometContract.methods.baseTrackingSupplySpeed().call()).toString();
        const baseTrackingBorrowSpeed = +(await cometContract.methods.baseTrackingBorrowSpeed().call()).toString();

        const compToSuppliersPerDay = baseTrackingSupplySpeed / baseIndexScale * secondsPerDay;
        const compToBorrowersPerDay = baseTrackingBorrowSpeed / baseIndexScale * secondsPerDay;

        const supplyCompRewardApr = ((compPriceInUsd * compToSuppliersPerDay / (usdcTotalSupply * usdcPriceInUsd)) * daysInYear * 100).toFixed(2);
        const borrowCompRewardApr = ((compPriceInUsd * compToBorrowersPerDay / (usdcTotalBorrow * usdcPriceInUsd)) * daysInYear * 100).toFixed(2);
        const availableLiquidity = (new BigNumber(totalSupply))
                                   .minus(new BigNumber(totalBorrow)).toFixed();

        const response = {
            'tokenAddress': baseToken.toString(),
            'poolAddress': comet,
            'stableBorrowRate': '0',
            'variableBorrowRate': (Number(borrowApy) - Number(borrowCompRewardApr)).toString(),
            'stableSupplyRate': '0',
            'variableSupplyRate': (Number(supplyApy) + Number(supplyCompRewardApr)).toString(),
            'ltv': ltv,
            'availableLiquidity': availableLiquidity.toString(),
            'reserveSize': reserves
        };

        return (response);

    },

};