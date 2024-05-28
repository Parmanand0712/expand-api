const { swap, getPrice, addLiquidity, removeLiquidity, getLiquidity, getPoolLiquidity, getTokenLiquidity } = require('../../src/expand/dex/index');
const { initialiseWeb3 } = require('../../common/intialiseWeb3');
const { expect } = require('chai');


describe("Orca", () => {

    test("swap 001", async () => {
        connection = await initialiseWeb3({ chainId: '900', chainName: 'Solana' });
        const swapResponse = await swap(connection, {
            "dexId": "2500",
            "from": "kAtVAPfxVnCGYnYQoQkhPTeRFBgH7ebKfohufiMTGKq",
            "amountIn": "100000",
            "path": ["EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
            ]
        });
        console.log(swapResponse);
    });

    test("swap 002", async () => {
        connection = await initialiseWeb3({ chainId: '901', chainName: 'Solana' });
        const swapResponse = await swap(connection, {
            "dexId": "2501",
            "from": "kAtVAPfxVnCGYnYQoQkhPTeRFBgH7ebKfohufiMTGKq",
            "amountIn": "100000",
            "path": [
                "So11111111111111111111111111111111111111112",
                "BRjpCHtyQLNCo8gqRUr8jtdAj5AjPYQaoqbvcZiHok1k"
            ]
        });
        console.log(swapResponse);
    });

    test("getPrice 001", async () => {
        connection = await initialiseWeb3({ chainId: '901', chainName: 'Solana' });
        const swapResponse = await getPrice(connection, {
            "dexId": "2501",
            "amountIn": "100000",
            "path": ["So11111111111111111111111111111111111111112",
                "BRjpCHtyQLNCo8gqRUr8jtdAj5AjPYQaoqbvcZiHok1k"]
        });
        console.log(swapResponse);
    })

    test("add 001", async () => {
        connection = await initialiseWeb3({ chainId: '901', chainName: 'Solana' });
        const swapResponse = await addLiquidity(connection, {
            "dexId": "2501",
            "from": "kAtVAPfxVnCGYnYQoQkhPTeRFBgH7ebKfohufiMTGKq",
            "amountIn": "100000",
            "path": ["Jd4M8bfJG3sAkd82RsGWyEXoaBXQP7njFzBwEaCTuDa",
                "BRjpCHtyQLNCo8gqRUr8jtdAj5AjPYQaoqbvcZiHok1k"],
                "slippage": "15"
        });
        console.log(swapResponse);
    });

    test("remove 001", async () => {
        connection = await initialiseWeb3({ chainId: '901', chainName: 'Solana' });
        const swapResponse = await removeLiquidity(connection, {
            "dexId": "2501",
            "from": "kAtVAPfxVnCGYnYQoQkhPTeRFBgH7ebKfohufiMTGKq",
            "liquidity": "1000000",
            "positionAddress": "8dE99BEz8VN6uk3EeyAtLkSHjhqy8gEsoayVpS1PATAF",
            "path": ["Jd4M8bfJG3sAkd82RsGWyEXoaBXQP7njFzBwEaCTuDa",
                "BRjpCHtyQLNCo8gqRUr8jtdAj5AjPYQaoqbvcZiHok1k"]
        });
        console.log(swapResponse);
    });

    test("getLiqui 001", async () => {
        connection = await initialiseWeb3({ chainId: '901', chainName: 'Solana' });
        const swapResponse = await getLiquidity(connection, {
            "dexId": "2501",
            "positionNFT": "EmDL7bY8QeGwvVAd5SUjRHbtUNys7QwzEQa1EDfAc3E6"
        });
        console.log(swapResponse);
    })

    test("poolLiqui", async () => {
        connection = await initialiseWeb3({ chainId: '900', chainName: 'Solana' });
        const swapResponse = await getPoolLiquidity(connection, {
            "dexId": "2500",
            "poolAddress": "5y2jFFA3A8GNjRnVMg8LfTHbBg7y2vivopiK8LmGRP2B"
        });
        console.log(swapResponse);

    })

    test("poolLiqui", async () => {
        connection = await initialiseWeb3({ chainId: '900', chainName: 'Solana' });
        const swapResponse = await getPoolLiquidity(connection, {
            "dexId": "2500",
            "poolAddress": "5y2jFFA3A8GNjRnVMg8LfTHbBg7y2vivopiK8LmGRP2B"
        });
        console.log(swapResponse);

    })

    test("tokenLiqui", async () => {
        connection = await initialiseWeb3({ chainId: '900', chainName: 'Solana' });
        const swapResponse = await getTokenLiquidity(connection, {
            "dexId": "2500",
            "poolAddress": "HJPjoWUrhoZzkNfRpHuieeFk9WcZWjwy6PBjZ81ngndJ"
        });
        console.log(swapResponse);

    })
    jest.setTimeout(1000000)
})

describe("Orca Negative", () => {

    test("swap 001", async () => {
        connection = await initialiseWeb3({ chainId: '900', chainName: 'Solana' });
        const swapResponse = await swap(connection, {
            "dexId": "2500",
            "from": "kAtVAPfxVnCGYnYQoQkhPTeRFBgH7ebKfohufiMTGKq",
            // "amountIn": "100000",
            "path": ["Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
                "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"]
        });
        console.log(swapResponse);
    });

    test("swap 002", async () => {
        connection = await initialiseWeb3({ chainId: '901', chainName: 'Solana' });
        const swapResponse = await swap(connection, {
            "dexId": "2501",
            // "from": "kAtVAPfxVnCGYnYQoQkhPTeRFBgH7ebKfohufiMTGKq",
            "amountIn": "100000",
            "path": ["So11111111111111111111111111111111111111112",
                "BRjpCHtyQLNCo8gqRUr8jtdAj5AjPYQaoqbvcZiHok1k"]
        });
        console.log(swapResponse);
    });

    test("getPrice 001", async () => {
        connection = await initialiseWeb3({ chainId: '901', chainName: 'Solana' });
        const swapResponse = await getPrice(connection, {
            "dexId": "2501",
            "from": "kAtVAPfxVnCGYnYQoQkhPTeRFBgH7ebKfohufiMTGKq",
            "amountIn": "100000",
            // "path": ["So11111111111111111111111111111111111111112",
            // "BRjpCHtyQLNCo8gqRUr8jtdAj5AjPYQaoqbvcZiHok1k"]
        });
        console.log(swapResponse);
    })

    test("add 001", async () => {
        connection = await initialiseWeb3({ chainId: '901', chainName: 'Solana' });
        const swapResponse = await addLiquidity(connection, {
            "dexId": "2501",
            "from": "kAtVAfxVnCGYnYQoQkhPTeRFBgH7ebKfohufiMTGKq",
            "amountIn": "100000",
            "path": ["Jd4M8bfJG3sAkd82RsGWyEXoaBXQP7njFzBwEaCTuDa",
                "BRjpCHtyQLNCo8gqRUr8jtdAj5AjPYQaoqbvcZiHok1k"]
        });
        console.log(swapResponse);
    });

    test("remove 001", async () => {
        connection = await initialiseWeb3({ chainId: '901', chainName: 'Solana' });
        const swapResponse = await removeLiquidity(connection, {
            "dexId": "2501",
            "from": "kAtVAPfxVnCGYnYQoQkhPTeRFBgH7ebKfohufiMTGKq",
            "deltaToRemove": "10",
            "positionAddress": "8d99BEz8VN6uk3EeyAtLkSHjhqy8gEsoayVpS1PATAF",
            "path": ["Jd4M8bfJG3sAkd82RsGWyEXoaBXQP7njFzBwEaCTuDa",
                "BRjpCHtyQLNCo8gqRUr8jtdAj5AjPYQaoqbvcZiHok1k"]
        });
        console.log(swapResponse);
    });

    test("getLiqui 001", async () => {
        connection = await initialiseWeb3({ chainId: '900', chainName: 'Solana' });
        const swapResponse = await getLiquidity(connection, {
            "dexId": "2500",
            "pairAddress": "HJPjoWrhoZzkNfRpHuieeFk9WcZWjwy6PBjZ81ngndJ"
        });
        console.log(swapResponse);
    });
    jest.setTimeout(1000000)
})