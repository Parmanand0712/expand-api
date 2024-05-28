const schemaValidator = require("../../../common/configuration/schemaValidator");
const getPrice = require("./getPrice");
const config = require("../../../common/configuration/config.json");

const errorMessage = require('../../../common/configuration/errorMessage.json');
const { isValidContractAddress } = require("../../../common/contractCommon");

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});

module.exports = {
    quoteAggregatorEvm: async (evmWeb3, options) => {
        const filterOptions = options;

        filterOptions.path = filterOptions.path.split(",");
        filterOptions.excludedDexes = filterOptions.excludedDexes && filterOptions.excludedDexes.split(",");

        filterOptions.function = "quoteAggregator()";
        const validJson = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return validJson;
        }

        const { path, amountIn, chainId, excludedDexes } = filterOptions;

        if (!(/^\+?\d+$/.test(amountIn))) return {
            'message': `Error: invalid BigNumber string (argument="${"value"}", value="${amountIn}", code=INVALID_ARGUMENT, version=bignumber/5.7.0)`,
            'code': errorMessage.error.code.invalidInput
        }; 
        
        const [isValidSrcToken, isValidDstToken] = await Promise.all([
            isValidContractAddress(evmWeb3, path[0]),
            isValidContractAddress(evmWeb3, path[1])
        ]);

        if (!isValidSrcToken) return throwErrorMessage("invalidSrcToken");
        if (!isValidDstToken) return throwErrorMessage("invalidDstToken");
        if (path[0] === path[1]) return throwErrorMessage("sameTokenSwap");

        const { defaultNativeToken, swapAggregatorSupportedDexs } = config;

        if ((chainId in swapAggregatorSupportedDexs) === false) return throwErrorMessage("noDexFound");

        let dexConfig = swapAggregatorSupportedDexs[chainId];
        if (excludedDexes)
            dexConfig = dexConfig.filter(dex => !excludedDexes.some(obj => dex.dexId === obj));

        if ((path[0] === defaultNativeToken && path[1] === config.wethAddress[chainId]) ||
            (path[0] === config.wethAddress[chainId] && path[1] === defaultNativeToken)) {
            return {
                amountIn, path, amountsOut: [amountIn, amountIn]
            };
        };

        const involveBaseToken = (path[0] === defaultNativeToken) ? "1" : (path[1] === defaultNativeToken) ? "2" : "0";

        const quotes = await Promise.all(
            dexConfig.map(async ({ dexName, dexId, nativeToken }) => {
                let quote = { amountIn, path };
                try {
                    quote = await getPrice[`getPrice${dexName}`](evmWeb3, {
                        dexId,
                        path: [involveBaseToken === "1" ? nativeToken : path[0], involveBaseToken === "2" ? nativeToken : path[1]],
                        amountIn,
                    });
                    return { dexName, dexId, ...quote };
                } catch (err) {
                    console.log(err);
                    return quote;
                }
            })
        );
        const validQuotes = quotes.filter((quote) => quote.amountsOut);
        if (validQuotes.length === 0) return throwErrorMessage("executionReverted");
        return validQuotes;
    }

};
