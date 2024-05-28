const config = require('./configuration/config.json');
const errorMessage = require('./configuration/errorMessage.json');
const tokenConfig = require('./configuration/squidRouterTokenConfig.json');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});

exports.getSwapRoute = async(params, quoteOnly=false) => {
    /*
     * This functions returns the route for a token swap in squid router 
    */

    const { srcChainId, dstChainId, srcTokenSymbol, dstTokenSymbol, amountIn, bridgeId } = params;
        const { apiBaseUri, slippage, toAddress } = config.bridge[bridgeId];

        if (config.bridge[bridgeId].supportedSrcChains.some(chain => chain.chainId === srcChainId) === false)
            return throwErrorMessage("invalidSrcChainId");
        if (config.bridge[bridgeId].supportedDstChains.some(chain => chain.chainId === dstChainId) === false)
            return throwErrorMessage("invalidDstChainId");

        if (srcChainId === dstChainId) return throwErrorMessage("sameChainNotAllowed");

        const fromToken = tokenConfig[srcChainId][srcTokenSymbol.toUpperCase()];
        const toToken = tokenConfig[dstChainId][dstTokenSymbol.toUpperCase()];

        if (fromToken === undefined) return throwErrorMessage("invalidSrcToken");
        if (toToken === undefined) return throwErrorMessage("invalidDstToken");
        
        const apiConfig = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${apiBaseUri}route`,
            headers: {
                'accept': 'application/json'
            },
            params: {
                "fromChain": srcChainId,
                "toChain": dstChainId,
                fromToken,
                toToken,
                toAddress,
                slippage: (params.slippage === undefined) ? slippage : params.slippage,
                "fromAmount": amountIn,
                quoteOnly
            }
        };

        return apiConfig;

};
