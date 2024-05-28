/* eslint-disable prefer-destructuring */
/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a Pool response
    {
        'tokenAddress': '0x75Ab5AB1Eef154C0352Fc31D2428Cef80C7F8B33',
        'variableRepayAmount': '86876786767',
        'stableRepayAmount': '86876786767',
    }
 */
    const EvmWeb = require('web3');
    const { BigNumber, providers, FixedNumber } = require('ethers');
    const { valueToBigNumber } = require('@aave/math-utils');
    const bigNumber = require('bignumber.js');
    const { UiPoolDataProvider } = require('@aave/contract-helpers');
    const tokenConfig = require("../../../common/configuration/tokenConfig.json");
    const compoundCTokenAbis = require('../../../assets/abis/compoundCToken.json');
    const aaveV2DataProviderAbis = require('../../../assets/abis/aaveV2DataProvider.json');
    const aaveV2PoolAbis = require('../../../assets/abis/aaveV2Pool.json');
    const config = require('../../../common/configuration/config.json');
    const schemaValidator = require('../../../common/configuration/schemaValidator');
    const errorMessage = require('../../../common/configuration/errorMessage.json');
    const comptrollerAbi = require('../../../assets/abis/compoundComptroller.json');
    const cometAbi = require('../../../assets/abis/compound3Comet.json');
    const { getPriceChainLink } = require('../oracle/getPrice');
    const { getDecimalsEvm } = require('../fungibleTokens/getDecimals');
    const { isSmartContract, isValidContractAddress } = require('../../../common/contractCommon');
    

    const throwErrorMessage = (msg) => ({
        'message': errorMessage.error.message[msg],
        'code': errorMessage.error.code.invalidInput
    });

    module.exports = {
    
        getUserAccountDataAaveV2: async( web3, options ) => {
            /*
             * Function will fetch the details of a particular token for the user from aave V2
             */

            const filterOptions = options;
            const flag = filterOptions.function ? filterOptions.function : '';
            filterOptions.function = "getUserAccountDataAaveV2()";
            const validJson = await schemaValidator.validateInput(filterOptions);
    
            if ( !validJson.valid ) {
                return (validJson);
            }

            let response = {
                currentStableDebt: 0,
                currentVariableDebt: 0,
                currentATokenBalance: 0
            };
            let userReserveData = {};
            let maxUserAmountToBorrow = '';
            let borrowErrorMessage = '';
            let maxAmountToWithdraw;
            let healthFactor;
            const threads = [];

            const [isNotUserAddress, isValidAddress] = await Promise.all([
                isSmartContract(web3, filterOptions.address),
                isValidContractAddress(web3, filterOptions.address)
            ]);

            if (isNotUserAddress || !isValidAddress) return throwErrorMessage("invalidUserAddress");

            const { tokens } = config.lendborrow[filterOptions.lendborrowId];

            if (!tokens[filterOptions.asset.toLowerCase()]?.symbol)
                return throwErrorMessage("poolDoesNotExist");

            try {

                // calculating user Reserve Data
                filterOptions.protocolDataProvider = await config.lendborrow[filterOptions.lendborrowId].dataProvider;
                const protocolDataProvider = new web3.eth.Contract(
                    aaveV2DataProviderAbis,
                    filterOptions.protocolDataProvider
                );    
                threads.push(protocolDataProvider.methods.getUserReserveData(filterOptions.asset, filterOptions.address).call());
                // Fetching Reserves
                const provider = new providers.StaticJsonRpcProvider(config.chains[filterOptions.chainId].publicRpc);
                const poolDataProviderContract = new UiPoolDataProvider({
                    uiPoolDataProviderAddress: config.lendborrow[filterOptions.lendborrowId].dataPoolProvider,
                    provider,
                    chainId: Number(filterOptions.chainId),
                });
                threads.push(poolDataProviderContract.getReservesData(
                    {lendingPoolAddressProvider: config.lendborrow[filterOptions.lendborrowId].lendingPoolAddressProvider,
                }));

                // fetching user account data
                filterOptions.poolAddress = config.lendborrow[filterOptions.lendborrowId].poolAddress;
                const poolAddressContract = new web3.eth.Contract(
                    aaveV2PoolAbis,
                    filterOptions.poolAddress
                );
                threads.push(poolAddressContract.methods.getUserAccountData(filterOptions.address).call());

                const res = await Promise.all(threads);

                userReserveData = res[0];
                const reserves = res[1];
                const userAccountData = res[2];
                const reserveSelected = reserves[0].filter((reserve) => reserve.underlyingAsset.toLowerCase() === filterOptions.asset.toLowerCase());

                const { decimals: tokenDecimal, availableLiquidity } = reserveSelected[0];
                const priceInMarketReferenceCurrency = FixedNumber.fromString(reserveSelected[0].priceInMarketReferenceCurrency.toString())
                    .divUnsafe(FixedNumber.fromString(String(10 ** Number(tokenDecimal.toString())))).toString();
                const availableBorrowsMarketReferenceCurrency = FixedNumber.fromString(BigNumber.from(userAccountData['2']).toString())
                    .divUnsafe(FixedNumber.fromString(String(10 ** Number(tokenDecimal.toString())))).toString();

                // borrow logic calculation
                maxUserAmountToBorrow = bigNumber.BigNumber.min(
                    valueToBigNumber(availableBorrowsMarketReferenceCurrency || 0).div(
                        priceInMarketReferenceCurrency
                    ),
                    availableLiquidity.toString()
                );

                if (filterOptions.interestRateMode === '1') {
                    maxUserAmountToBorrow = bigNumber.BigNumber.min(
                      maxUserAmountToBorrow,
                      valueToBigNumber(availableLiquidity.toString()).multipliedBy(0.25)
                    );
                }
                maxUserAmountToBorrow = maxUserAmountToBorrow.multipliedBy(0.99).multipliedBy(10 ** tokenDecimal).toString();

                // error types handling for borrow amount
                if (filterOptions.interestRateMode === '1' && !reserveSelected[0].stableBorrowRateEnabled) {
                    borrowErrorMessage = errorMessage.error.message.disabledStableRate;
                } else if (
                    filterOptions.interestRateMode === '1' &&
                    reserveSelected[0].usageAsCollateralEnabled &&
                    maxUserAmountToBorrow < userReserveData.currentATokenBalance
                ) {
                    borrowErrorMessage = errorMessage.error.message.lowStableRateValue;
                } else if (!reserveSelected[0].borrowingEnabled) {
                    borrowErrorMessage = errorMessage.error.message.disabledBorrowing;
                }

                // calculating withdraw amount
                const totalBorrowsMarketReferenceCurrency = FixedNumber.fromString(BigNumber.from(userAccountData['1']).toString())
                .divUnsafe(FixedNumber.fromString(String(10 ** Number(tokenDecimal.toString())))).toString();
                maxAmountToWithdraw = FixedNumber.fromString(BigNumber.from(userReserveData.currentATokenBalance).toString());
                if (
                    reserveSelected[0].usageAsCollateralEnabled &&
                    reserveSelected[0].reserveLiquidationThreshold !== '0' &&
                    totalBorrowsMarketReferenceCurrency !== '0.0'
                ) {
                    // if we have any borrowings we should check how much we can withdraw to a minimum HF of 1.01
                    let maxCollateralToWithdrawInETH = valueToBigNumber('0');
                    const excessHF = valueToBigNumber(Number(userAccountData.healthFactor/10 ** tokenDecimal)).minus('1.01');
                    if (excessHF.gt('0')) {
                      maxCollateralToWithdrawInETH = excessHF
                        .multipliedBy(totalBorrowsMarketReferenceCurrency)
                        .div(FixedNumber.fromString(BigNumber.from(reserveSelected[0].reserveLiquidationThreshold).toString())
                        .divUnsafe(FixedNumber.fromString('10000')).toString());
                    }
                    maxAmountToWithdraw = bigNumber.BigNumber.min(
                      maxAmountToWithdraw,
                      maxCollateralToWithdrawInETH.dividedBy(priceInMarketReferenceCurrency).multipliedBy(10**tokenDecimal)
                    );
                }
                healthFactor = userAccountData.healthFactor;

            } catch(error) {
                if(flag !== 'getUserBalance()') return throwErrorMessage('invalidToken');
            }

            response = {
                'tokenAddress': filterOptions.asset,
                'repayAmount': filterOptions.interestRateMode === "1" ? userReserveData.currentStableDebt : userReserveData.currentVariableDebt,
                'borrowAmount': maxUserAmountToBorrow.split('.')[0],
                borrowErrorMessage,
                'withdrawAmount': maxAmountToWithdraw.toString().split('.')[0],
                'healthFactor': healthFactor,
            };
    
            return (response);
        
        },

        getUserAccountDataAaveV3: async( web3, options ) => {
            /*
             * Function will fetch the details of a particular token for the user from aave V2
             */

            const filterOptions = options;
            const flag = filterOptions.function ? filterOptions.function : '';
            filterOptions.function = "getUserAccountDataAaveV3()";
            const validJson = await schemaValidator.validateInput(filterOptions);
    
            if ( !validJson.valid ) {
                return (validJson);
            }

            const { tokens } = config.lendborrow[filterOptions.lendborrowId];

            if (!tokens[filterOptions.asset.toLowerCase()]?.symbol)
                return throwErrorMessage("poolDoesNotExist");

            let response = {
                currentStableDebt: 0,
                currentVariableDebt: 0,
                currentATokenBalance: 0
            };
            let userReserveData = {};
            let maxUserAmountToBorrow = '';
            let borrowErrorMessage = '';
            let maxAmountToWithdraw;
            let healthFactor;
            const threads = [];

            try {

                // calculating user Reserve Data
                filterOptions.protocolDataProvider = await config.lendborrow[filterOptions.lendborrowId].dataProvider;
                const protocolDataProvider = new web3.eth.Contract(
                    aaveV2DataProviderAbis,
                    filterOptions.protocolDataProvider
                );    
                threads.push(protocolDataProvider.methods.getUserReserveData(filterOptions.asset, filterOptions.address).call());

                // Fetching Reserves
                const provider = new providers.StaticJsonRpcProvider(config.chains[filterOptions.chainId].publicRpc);
                const poolDataProviderContract = new UiPoolDataProvider({
                    uiPoolDataProviderAddress: config.lendborrow[filterOptions.lendborrowId].dataPoolProvider,
                    provider,
                    chainId: Number(filterOptions.chainId),
                });
                threads.push(poolDataProviderContract.getReservesData(
                    {lendingPoolAddressProvider: config.lendborrow[filterOptions.lendborrowId].lendingPoolAddressProvider,
                }));

                // fetching user account data
                filterOptions.poolAddress = config.lendborrow[filterOptions.lendborrowId].poolAddress;
                const poolAddressContract = new web3.eth.Contract(
                    aaveV2PoolAbis,
                    filterOptions.poolAddress
                );
                threads.push(poolAddressContract.methods.getUserAccountData(filterOptions.address).call());

                const res = await Promise.all(threads);

                userReserveData = res[0];
                const reserves = res[1];
                const userAccountData = res[2];
                const reserveSelected = reserves[0].filter((reserve) => reserve.underlyingAsset.toLowerCase() === filterOptions.asset.toLowerCase());
                const { decimals: tokenDecimal, availableLiquidity } = reserveSelected[0];
                const priceInMarketReferenceCurrency = FixedNumber.fromString(reserveSelected[0].priceInMarketReferenceCurrency.toString())
                    .divUnsafe(FixedNumber.fromString(String(10 ** Number(tokenDecimal.toString())))).toString();
                const availableBorrowsMarketReferenceCurrency = FixedNumber.fromString(BigNumber.from(userAccountData['2']).toString())
                    .divUnsafe(FixedNumber.fromString(String(10 ** Number(tokenDecimal.toString())))).toString();

                // borrow logic calculation
                maxUserAmountToBorrow = bigNumber.BigNumber.min(
                    valueToBigNumber(availableBorrowsMarketReferenceCurrency || 0).div(
                        priceInMarketReferenceCurrency
                    ),
                    availableLiquidity.toString()
                );

                if (filterOptions.interestRateMode === '1') {
                    maxUserAmountToBorrow = bigNumber.BigNumber.min(
                      maxUserAmountToBorrow,
                      valueToBigNumber(availableLiquidity.toString()).multipliedBy(0.25)
                    );
                }
                maxUserAmountToBorrow = maxUserAmountToBorrow.multipliedBy(0.99).multipliedBy(10 ** tokenDecimal).toString();

                // error types handling for borrow amount
                if (filterOptions.interestRateMode === '1' && !reserveSelected[0].stableBorrowRateEnabled) {
                    borrowErrorMessage = errorMessage.error.message.disabledStableRate;
                } else if (
                    filterOptions.interestRateMode === '1' &&
                    reserveSelected[0].usageAsCollateralEnabled &&
                    maxUserAmountToBorrow < userReserveData.currentATokenBalance
                ) {
                    borrowErrorMessage = errorMessage.error.message.lowStableRateValue;
                } else if (!reserveSelected[0].borrowingEnabled) {
                    borrowErrorMessage = errorMessage.error.message.disabledBorrowing;
                }
                else{
                    borrowErrorMessage = errorMessage.error.message.noErrorInBorrowing;
                }

                // calculating withdraw amount
                const totalBorrowsMarketReferenceCurrency = FixedNumber.fromString(BigNumber.from(userAccountData['1']).toString())
                .divUnsafe(FixedNumber.fromString(String(10 ** Number(tokenDecimal.toString())))).toString();
                maxAmountToWithdraw = FixedNumber.fromString(BigNumber.from(userReserveData.currentATokenBalance).toString());
                if (
                    reserveSelected[0].usageAsCollateralEnabled &&
                    reserveSelected[0].reserveLiquidationThreshold !== '0' &&
                    totalBorrowsMarketReferenceCurrency !== '0.0'
                ) {
                    // if we have any borrowings we should check how much we can withdraw to a minimum HF of 1.01
                    let maxCollateralToWithdrawInETH = valueToBigNumber('0');
                    const excessHF = valueToBigNumber(Number(userAccountData.healthFactor/10 ** tokenDecimal)).minus('1.01');
                    if (excessHF.gt('0')) {
                      maxCollateralToWithdrawInETH = excessHF
                        .multipliedBy(totalBorrowsMarketReferenceCurrency)
                        .div(FixedNumber.fromString(BigNumber.from(reserveSelected[0].reserveLiquidationThreshold).toString())
                        .divUnsafe(FixedNumber.fromString('10000')).toString());
                    }
                    maxAmountToWithdraw = bigNumber.BigNumber.min(
                      maxAmountToWithdraw,
                      maxCollateralToWithdrawInETH.dividedBy(priceInMarketReferenceCurrency).multipliedBy(10**tokenDecimal)
                    );
                }
                healthFactor = userAccountData.healthFactor;


            } catch(error) {
                if(flag !== 'getUserBalance()') return error;
            }

            response = {
                'tokenAddress': filterOptions.asset,
                'repayAmount': filterOptions.interestRateMode === "1" ? userReserveData.currentStableDebt : userReserveData.currentVariableDebt,
                'borrowAmount': maxUserAmountToBorrow.split('.')[0],
                borrowErrorMessage,
                'withdrawAmount': maxAmountToWithdraw.toString().split('.')[0],
                'healthFactor': healthFactor,
            };
    
            return (response);
        
        },
        
        getUserAccountDataCompound: async( web3, options ) => {
            /*
             * Function will fetch the details for a user from Compound
             */

            const filterOptions = options;
            const flag = filterOptions.function ? filterOptions.function : '';
            filterOptions.function = "getUserAccountDataCompound()";
            const validJson = await schemaValidator.validateInput(filterOptions);
    
            if ( !validJson.valid ) {
                return (validJson);
            }
            
            // contract initiation to fetch data
            const token = `c${(filterOptions.asset).toUpperCase()}`;
            filterOptions.cTokenAddress = await config.lendborrow[filterOptions.lendborrowId].ctokens[token];

            if (!filterOptions.cTokenAddress)
                return throwErrorMessage("poolDoesNotExist");
            
            const { cTokenAddress, lendborrowId, address, asset } = filterOptions;
            const [isNotUserAddress, isValidAddress] = await Promise.all([
                isSmartContract(web3, address),
                isValidContractAddress(web3, address)
            ]);

            if (isNotUserAddress || !isValidAddress) return throwErrorMessage("invalidUserAddress");

            const cToken = new web3.eth.Contract(
                compoundCTokenAbis, 
                cTokenAddress
            );
            const comptrollerAddress = config.lendborrow[lendborrowId].Comptroller;
            const comptroller = new web3.eth.Contract(comptrollerAbi, comptrollerAddress);

            const threads = [];

            let repayAmount = '0';
            let liquidity = 0;
            let healthFactor = '0';
            let assetPrice = { 'answer': 1 };
            let tokenDecimal = 18;
            let underlyingBalance = '0';
            let accountLiquidityData;

            try {
                // fetching user specific data
                const evmWeb3 = new EvmWeb(new EvmWeb.providers.HttpProvider(config.chains['1'].publicRpc));
                threads.push(cToken.methods.borrowBalanceStored(address).call());
                threads.push(cToken.methods.balanceOfUnderlying(address).call());
                threads.push(comptroller.methods.getAccountLiquidity(address).call());
                threads.push(getPriceChainLink(evmWeb3, { asset, oracleId : '1000' }));
                threads.push(getDecimalsEvm(evmWeb3, { tokenAddress: tokenConfig['1'][asset.toUpperCase()] }));
                [repayAmount, underlyingBalance, accountLiquidityData,  assetPrice, tokenDecimal] = await Promise.all(threads);
                liquidity = accountLiquidityData[1];
                healthFactor = accountLiquidityData[2];
            } catch(error) {
                if(flag !== 'getUserBalance()') return throwErrorMessage('invalidToken');
            }

            // calculating borrow amount
            const borrowAmount = valueToBigNumber(liquidity).div(10 ** 18).div(assetPrice.answer).toString();
            const [borrowAmountBeforeDecimal, borrowAmountAfterDecimal] = borrowAmount.split('.');

            const response = {
                'tokenAddress': filterOptions.cTokenAddress,
                'repayAmount': repayAmount,
                'borrowAmount': ((borrowAmountBeforeDecimal && borrowAmountBeforeDecimal === '0') ? '' : borrowAmountBeforeDecimal)
                    + ((borrowAmountAfterDecimal && borrowAmountAfterDecimal !== '0')
                    ? borrowAmountAfterDecimal.slice(0, Number(tokenDecimal.decimals)) : '0' ),
                'withdrawAmount': underlyingBalance,
                'healthFactor': healthFactor
            };

            return (response);
    
        },
        getUserAccountDataCompoundV3: async( web3, options ) => {
            /*
             * Function will fetch the details for a user from CompoundV3
             */

            const filterOptions = options;
            // const flag = filterOptions.function ? filterOptions.function : '';
            filterOptions.function = "getAccountDataCompV3()";
            const validJson = await schemaValidator.validateInput(filterOptions);
    
            if ( !validJson.valid ) {
                return (validJson);
            }

            const {address, lendborrowId , market} = filterOptions;
            if(web3.utils.isAddress(address) === false) return throwErrorMessage("invalidEOAAddress");
            
            // contract initiation to fetch data
            const myAddress = filterOptions.address;
            const comet = new web3.eth.Contract(cometAbi , config.lendborrow[lendborrowId][market].comet);
            const baseToken = await comet.methods.baseToken().call();

            const baseTokenPriceFeed = await comet.methods.baseTokenPriceFeed().call();
            const basePrice = +((await comet.methods.getPrice(baseTokenPriceFeed).call()) / 1e8);
            const baseDecimals = +(await comet.methods.decimals().call());

            const borrowBalance = +(await comet.methods.borrowBalanceOf(myAddress).call());
            const borrowedInUsd = borrowBalance / (10 ** baseDecimals) * basePrice;
      
            const borrowedInBase = borrowedInUsd / basePrice;

            const isLiquidatable = await comet.methods.isLiquidatable(address).call();

            const response = {
                'tokenAddress': baseToken,
                'repayAmount': borrowedInBase.toString(),
                'borrowAmount': borrowedInBase.toString(),
                'healthFactor': (isLiquidatable) ? "1" : "0"
            };

            return response;
            
        },
        
    
    };