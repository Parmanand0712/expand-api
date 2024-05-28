/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a Pool response
    {
        'tokenAddress': '0x75Ab5AB1Eef154C0352Fc31D2428Cef80C7F8B33',
        'variableBorrowAmount': '86876786767',
        'stableBorrowAmount': '86876786767',
    }
 */
    const comptrollerAbi = require('../../../assets/abis/compoundComptroller.json');
    const cometAbi = require('../../../assets/abis/compound3Comet.json');
    const config = require('../../../common/configuration/config.json');
    const schemaValidator = require('../../../common/configuration/schemaValidator');
    const errorMessage = require('../../../common/configuration/errorMessage.json');
    const { getPriceChainLink } = require('../oracle/getPrice');

    const throwErrorMessage = (msg) => ({
        'message': errorMessage.error.message[msg],
        'code': errorMessage.error.code.invalidInput
      });

    module.exports = {

        getBorrowAmountCompound: async( web3, options ) => {
            /*
             * Function will fetch the Borrow amount for a user from Compound
             */

            const filterOptions = options;
            filterOptions.function = "getBorrowAmountCompound()";
            const validJson = await schemaValidator.validateInput(filterOptions);
    
            if ( !validJson.valid ) {
                return (validJson);
            }
            
            const token = `c${(filterOptions.asset).toUpperCase()}`;
            filterOptions.cTokenAddress = await config.lendborrow[filterOptions.lendborrowId].ctokens[token];

            const comptrollerAddress = config.lendborrow[filterOptions.lendborrowId].Comptroller;
            const comptroller = new web3.eth.Contract(comptrollerAbi, comptrollerAddress);

            let { 1: liquidity } = await comptroller.methods.getAccountLiquidity(filterOptions.user).call();
            liquidity /= 1e18;
            let assetPrice;

            try {
                const EvmWeb = require('web3');
                const evmWeb3 = new EvmWeb(new EvmWeb.providers.HttpProvider(config.chains['1'].publicRpc));
                assetPrice = await getPriceChainLink(evmWeb3, { asset: filterOptions.asset, oracleId : '1000' });
            } catch (e) {
                return throwErrorMessage("invalidInput");
            }

            const response = {
                tokenAddress: filterOptions.cTokenAddress,
                borrowAmount: (liquidity/assetPrice.answer) * 1e18
            };

            return (response);
    
        },
        getBorrowAmountCompoundV3: async( web3, options ) => {
            /*
             * Function will fetch the Borrow amount for a user from Compound
             */

            const filterOptions = options;
            filterOptions.function = "getBorrowCompV3()";
            const validJson = await schemaValidator.validateInput(filterOptions);
    
            if ( !validJson.valid ) {
                return (validJson);
            }
            
            const response = {};

            
            if(web3.utils.isAddress(filterOptions.address) === false) return throwErrorMessage("invalidEOAAddress");

            const cometContract = new web3.eth.Contract(cometAbi , config.lendborrow[filterOptions.lendborrowId][filterOptions.market].comet);

            [response.tokenAddress , response.borrowAmount] = await Promise.all([cometContract.methods.baseToken().call() 
            ,cometContract.methods.borrowBalanceOf(filterOptions.address).call() ]);

            return (response);
    
        },
    
    };