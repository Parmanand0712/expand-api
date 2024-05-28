/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a tokens response
    {
        supportedTokens: [list of tokens] 
    }
    */


const { PublicKey } = require('@solana/web3.js');

const { parseBaseData, parseProductData, parsePriceData } = require('./pythHelper');

const schemaValidator = require('../../../common/configuration/schemaValidator');

const config = require('../../../common/configuration/config.json');

module.exports = {

    getSupportedTokensChainLink: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "getSupportedTokensOracle()";

        const validJson = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return (validJson);
        }

        return (config.oracle[filterOptions.oracleId].tokens);

    },
    getSupportedTokensWinkLink: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "getSupportedTokensOracle()";

        const validJson = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return (validJson);
        }

        return (config.oracle[filterOptions.oracleId].tokens);

    },

    getSupportedTokensPyth: async (web3, options) => {
        const filterOptions = options;
        filterOptions.function = "getSupportedTokensOracle()";

        const validJson = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return (validJson);
        }

        const { oracleId } = filterOptions;
        const priceDataQueue = {};
        const productAccountKeyToProduct = new Map();

        const accountList = await web3.getProgramAccounts(new PublicKey(config.oracle[oracleId].pythProgramAddress));
        const currentSlot = await web3.getSlot('finalized');

        await Promise.all(
            accountList.map(async (singleAccount) => {
                const base = await parseBaseData(singleAccount.account.data);
                if (base) {
                    if (base.type === 2) {
                        const productData = await parseProductData(singleAccount.account.data);
                        if ((productData.product.asset_type) === ('Crypto') && (productData.product.quote_currency === 'USD')) {
                            productAccountKeyToProduct.set(singleAccount.pubkey.toBase58(), productData.product);
                        }
                    } else if (base.type === 3) {
                        const price = await parsePriceData(singleAccount.account.data, currentSlot);
                        if (price.price !== undefined
                            && productAccountKeyToProduct.has(price.productAccountKey.toBase58())) {
                                priceDataQueue[productAccountKeyToProduct.get(price.productAccountKey.toBase58()).base] = 
                                price.productAccountKey.toBase58();

                        }
                    }
                }
            })
        );


        return priceDataQueue;
    },
};