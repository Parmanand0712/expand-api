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
    const compoundCTokenAbis = require('../../../assets/abis/compoundCToken.json');
    const aaveV2DataProviderAbis = require('../../../assets/abis/aaveV2DataProvider.json');
    const cometAbi = require('../../../assets/abis/compound3Comet.json');
    const config = require('../../../common/configuration/config.json');
    const schemaValidator = require('../../../common/configuration/schemaValidator');
    const errorMessage = require('../../../common/configuration/errorMessage.json');

    const throwErrorMessage = (msg) => ({
        'message': errorMessage.error.message[msg],
        'code': errorMessage.error.code.invalidInput
    });

    module.exports = {
    
        getRepayAmountAaveV2: async( web3, options ) => {
            /*
             * Function will fetch the repay amount of a particular token for the user from aave V2
             */
    
            const filterOptions = options;
            filterOptions.function = "getRepayAmountAaveV2()";
            const validJson = await schemaValidator.validateInput(filterOptions);
    
            if ( !validJson.valid ) {
                return (validJson);
            }

            let response = {};
            filterOptions.protocolDataProvider = await config.lendborrow[filterOptions.lendborrowId].dataProvider;

            const protocolDataProvider = new web3.eth.Contract(
                aaveV2DataProviderAbis,
                filterOptions.protocolDataProvider
            );

            const data = await protocolDataProvider.methods.getUserReserveData(
                filterOptions.asset, filterOptions.user
            ).call();
    
            response = {
                'tokenAddress': filterOptions.asset,
                'variableRepayAmount': data.currentVariableDebt,
                'stableRepayAmount': data.currentStableDebt    
            };
    
            return (response);
        
        },

        getRepayAmountAaveV3: async( web3, options ) => {
            /*
             * Function will fetch the repay amount of a particular token for the user from aave V2
             */
    
            const filterOptions = options;
            filterOptions.function = "getRepayAmountAaveV3()";
            const validJson = await schemaValidator.validateInput(filterOptions);
    
            if ( !validJson.valid ) {
                return (validJson);
            }

            let response = {};
            filterOptions.protocolDataProvider = await config.lendborrow[filterOptions.lendborrowId].dataProvider;

            const protocolDataProvider = new web3.eth.Contract(
                aaveV2DataProviderAbis,
                filterOptions.protocolDataProvider
            );

            const data = await protocolDataProvider.methods.getUserReserveData(
                filterOptions.asset, filterOptions.from
            ).call();
    
            response = {
                'tokenAddress': filterOptions.asset,
                'variableRepayAmount': data.currentVariableDebt,
                'stableRepayAmount': data.currentStableDebt    
            };
    
            return (response);
        
        },
        
        getRepayAmountCompound: async( web3, options ) => {
            /*
             * Function will fetch the repay amount for a user from Compound
             */

            const filterOptions = options;
            filterOptions.function = "getRepayAmountCompound()";
            const validJson = await schemaValidator.validateInput(filterOptions);
    
            if ( !validJson.valid ) {
                return (validJson);
            }

            const token = `c${(filterOptions.asset).toUpperCase()}`;
            filterOptions.cTokenAddress = await config.lendborrow[filterOptions.lendborrowId].ctokens[token];

            const cToken = new web3.eth.Contract(
                compoundCTokenAbis, 
                filterOptions.cTokenAddress
            );

            let repayAmount;
            try {
                repayAmount = await cToken.methods.borrowBalanceStored(filterOptions.user).call();
            } catch (e) {
                return throwErrorMessage("invalidInput");
            }

            const response = {
                'tokenAddress': filterOptions.cTokenAddress,
                'repayAmount': repayAmount
            };

            return (response);
    
        },
        getRepayAmountCompoundV3: async( web3, options ) => {
            /*
             * Function will fetch the repay amount for a user from Compound
             */

            const filterOptions = options;
            filterOptions.function = "getRepayAmountCompV3()";
            const validJson = await schemaValidator.validateInput(filterOptions);
    
            if ( !validJson.valid ) {
                return (validJson);
            }
            
            const {address , lendborrowId , market} = filterOptions;

            if(web3.utils.isAddress(address) === false) return throwErrorMessage("invalidEOAAddress");

            const response = {};
            const cometContract = new web3.eth.Contract(cometAbi , config.lendborrow[lendborrowId][market].comet);

            [response.tokenAddress , response.repayAmount] = await Promise.all([cometContract.methods.baseToken().call() 
                ,cometContract.methods.borrowBalanceOf(address).call() ]);

            return (response);
    
        },
    
    };