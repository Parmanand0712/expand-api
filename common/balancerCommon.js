const { defaultAbiCoder } = require('@ethersproject/abi');

const StablePoolExitKind = {
    EXACT_BPT_IN_FOR_ONE_TOKEN_OUT: 0,
    EXACT_BPT_IN_FOR_TOKENS_OUT: 1,
    BPT_IN_FOR_EXACT_TOKENS_OUT: 2,
};

const StablePoolJoinKind = {
    INIT: 0,
    EXACT_TOKENS_IN_FOR_BPT_OUT: 1,
    TOKEN_IN_FOR_EXACT_BPT_OUT: 2,
    ALL_TOKENS_IN_FOR_EXACT_BPT_OUT: 3,
    ADD_TOKEN: 4,
};


module.exports = {

    joinExactTokensInForBPTOut: (amountsIn, minimumBPT) =>
        defaultAbiCoder.encode(
            ['uint256', 'uint256[]', 'uint256'],
            [StablePoolJoinKind.EXACT_TOKENS_IN_FOR_BPT_OUT, amountsIn, minimumBPT]
        ),

    exitExactBPTInForOneTokenOut: (bptAmountIn, exitTokenIndex) =>
        defaultAbiCoder.encode(
            ['uint256', 'uint256', 'uint256'],
            [StablePoolExitKind.EXACT_BPT_IN_FOR_ONE_TOKEN_OUT, bptAmountIn, exitTokenIndex]
        ),

    exitBPTInForExactTokensOut: (amountsOut, maxBPTAmountIn) =>
        defaultAbiCoder.encode(
            ['uint256', 'uint256[]', 'uint256'],
            [StablePoolExitKind.BPT_IN_FOR_EXACT_TOKENS_OUT, amountsOut, maxBPTAmountIn]
        ),

    exitExactBPTInForTokensOut: (bptAmountIn) =>
        defaultAbiCoder.encode(
            ['uint256', 'uint256'],
            [StablePoolExitKind.EXACT_BPT_IN_FOR_TOKENS_OUT, bptAmountIn]
    ),
    
    DecodejoinExactTokensInForBPTOut: (data) =>
        defaultAbiCoder.decode(['uint256', 'uint256[]', 'uint256'], data),
};