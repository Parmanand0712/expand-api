const schemaValidator = require("../../../common/configuration/schemaValidator");
const swap = require("./swap");
const getPrice = require("./getPrice");
const config = require("../../../common/configuration/config.json");

const errorMessage = require('../../../common/configuration/errorMessage.json');
const convertWrapTokenToBaseToken = require("../fungibleTokens/convertWrapTokenToBaseToken");
const convertBaseTokenToWrapToken = require("../fungibleTokens/convertBaseTokenToWrapToken");
const { isValidContractAddress } = require("../../../common/contractCommon");


const throwErrorMessage = (msg) => ({
  'message': errorMessage.error.message[msg],
  'code': errorMessage.error.code.invalidInput
});

module.exports = {
  swapAggregatorEvm: async (evmWeb3, options) => {
    const filterOptions = options;
    filterOptions.function = "swapAggregator()";
    const validJson = await schemaValidator.validateInput(options);

    if (!validJson.valid) {
      return validJson;
    }

    const { from, to, amountIn, bestSwap, gas, chainId, excludedDexes, path , gasPriority , slippage} = filterOptions;
    const {defaultNativeToken, swapAggregatorSupportedDexs} = config;

    if (path[0].toLowerCase() === defaultNativeToken) path[0] = defaultNativeToken;
    if (path[1].toLowerCase() === defaultNativeToken) path[1] = defaultNativeToken;

    const [isValidSrcToken, isValidDstToken] = await Promise.all([
      isValidContractAddress(evmWeb3, path[0]),
      isValidContractAddress(evmWeb3, path[1])
  ]);

  if (!isValidSrcToken) return throwErrorMessage("invalidSrcToken");
  if (!isValidDstToken) return throwErrorMessage("invalidDstToken");
    if (path[0] === path[1]) return throwErrorMessage("sameTokenSwap");
        
    const amountOutMin = "0";
    const deadline = (Date.now() + 3 * 60 * 1000).toString();

    if ((chainId in swapAggregatorSupportedDexs) === false) return throwErrorMessage("noDexFound");
    let dexConfig = swapAggregatorSupportedDexs[chainId];
   
    if (path[0] === defaultNativeToken && path[1] === config.wethAddress[chainId]) {
      const transaction = await convertBaseTokenToWrapToken.convertBaseTokenToWrapTokenEvm(evmWeb3, {
        from, amount: amountIn, gas, chainId, tokenAddress: path[1]
      });
      return transaction;
    } else if (path[0] === config.wethAddress[chainId] && path[1] === defaultNativeToken) {
      const transaction = await convertWrapTokenToBaseToken.convertWrapTokenToBaseTokenEvm(evmWeb3, {
        from, amount: amountIn, gas, chainId, tokenAddress: path[0]
      });
      return transaction;
    };

    const involveBaseToken = (path[0] === defaultNativeToken) ? "1" : (path[1] === defaultNativeToken) ?  "2" : "0";

    if (excludedDexes && excludedDexes.length > 0)
      dexConfig = dexConfig.filter(dex => !excludedDexes.some(obj => dex.dexId === obj));

    if (!bestSwap) {
      const swapPromises = dexConfig.map(async ({ dexName, dexId, nativeToken }) => {
        const swapResult = await swap[`swap${dexName}`](evmWeb3, {
          dexId,
          path: [involveBaseToken === "1" ? nativeToken : path[0], involveBaseToken === "2" ? nativeToken : path[1]],
          from,
          to,
          amountIn,
          amountOutMin,
          deadline,
          involveBaseToken,
          gas,
          gasPriority,
          slippage
        });
        return [dexName, swapResult.data && swapResult];
      });

      let results = await Promise.all(swapPromises);
      results = results.filter((res) => res[1] !== undefined);
      const result = Object.fromEntries(results);
      return result;

    } else {
      const quotes = await Promise.all(
        dexConfig.map(async ({ dexName, dexId, nativeToken }) => {
          let swapQuote;
          try {
            const res = await getPrice[`getPrice${dexName}`](evmWeb3, {
              dexId,
              path: [involveBaseToken === "1" ? nativeToken : path[0], involveBaseToken === "2" ? nativeToken : path[1]],
              amountIn,
            });
            swapQuote = {amountsOut: res?.amountsOut ? res.amountsOut : [amountIn, 0]};
          } catch (err) {
            swapQuote = { amountsOut: [amountIn, 0] };
          }
          return { path, amountIn, amountsOut: swapQuote.amountsOut, dexName, dexId, nativeToken };
        }
        )
      );

      const maxQuote = quotes.reduce((max, quote, index) => {
        if (quote.amountsOut[1] > max.amountsOut[1]) {
          return { ...quote, ...dexConfig[index] };
        }
        return max;
      }, quotes[0]);

      const { dexName, dexId, amountsOut, nativeToken } = maxQuote;

      const transactionPayload = await swap[`swap${dexName}`](evmWeb3, {
        dexId,
        path: [involveBaseToken === "1" ? nativeToken : path[0], involveBaseToken === "2" ? nativeToken : path[1]],
        from,
        to,
        amountIn,
        amountOutMin,
        deadline,
        involveBaseToken,
        gas,
        gasPriority,
        slippage
      });
      const response = { path, amountIn, dexName, dexId, chainId, amountsOut: amountsOut[1], transactionPayload };
      return response;
    }
  }

};
