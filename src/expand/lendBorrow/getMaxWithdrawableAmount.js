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
   
    const config = require('../../../common/configuration/config.json');
    const schemaValidator = require('../../../common/configuration/schemaValidator');
    const errorMessage = require('../../../common/configuration/errorMessage.json');
    const cometAbi = require('../../../assets/abis/compound3Comet.json');

    const throwErrorMessage = (msg) => ({
        'message': errorMessage.error.message[msg],
        'code': errorMessage.error.code.invalidInput
    });

    module.exports = {
    
        getMaxAmountsAaveV2: async() => throwErrorMessage("notApplicable"),

        getMaxAmountsAaveV3: async() => throwErrorMessage("notApplicable"),
        
        getMaxAmountsCompound: async() => throwErrorMessage("notApplicable"),

        getMaxAmountsCompoundV3: async( web3, options ) => {
            /*
             * Function will fetch the details for a user from CompoundV3
             */

            const filterOptions = options;
            filterOptions.function = "getMaxAmountsCompV3()";
            const validJson = await schemaValidator.validateInput(filterOptions);
    
            if ( !validJson.valid ) {
                return (validJson);
            }
            
            const {address , lendborrowId , market , asset } = filterOptions;
            const isValid = [address , asset ].every(addr => web3.utils.isAddress(addr));
            if(isValid === false) return throwErrorMessage("invalidAddress");

            const myAddress = filterOptions.address;
            const comet = new web3.eth.Contract(cometAbi , config.lendborrow[lendborrowId][market].comet);
            
            const infos = await comet.methods.getAssetInfoByAddress(filterOptions.asset).call();

            const { priceFeed , borrowCollateralFactor } = infos;
            const {balance} = await comet.methods.userCollateral(myAddress, asset).call();
            const price = await comet.methods.getPrice(priceFeed).call();
            
            const baseTokenPriceFeed = await comet.methods.baseTokenPriceFeed().call();
            const basePrice = +((await comet.methods.getPrice(baseTokenPriceFeed).call()) / 1e8);
            const baseDecimals = +(await comet.methods.decimals().call());

            const borrowBalance = +(await comet.methods.borrowBalanceOf(myAddress).call());
            const borrowedInUsd = borrowBalance / (10 ** baseDecimals) * basePrice;

            const borrowedInBase = borrowedInUsd / basePrice;
            const withdrawAmount = ((((price / (10 ** 8)) * balance / (10 ** 18)) - 
            ((borrowedInBase * basePrice) / ((borrowCollateralFactor) /  (10 ** 18)))) / ( price / (10 ** 8))); 
        
            const response = {
                'maxWithdrawalAmount': (withdrawAmount.toFixed(4)).toString(),
                'maxBorrowableAmount': ((((withdrawAmount * price ) * ((borrowCollateralFactor) /  (10 ** 18))) 
                / (basePrice)) / 10 ** 8).toFixed(4).toString()
            };

            return response;
            
        },
        
    
    };