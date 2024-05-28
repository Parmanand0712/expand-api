const { swap, getPrice } = require('../../src/expand/dex/index');
const { initialiseWeb3 } = require('../../common/intialiseWeb3');
const { expect } = require('chai');


describe("JUPiter", () => {

    test("swap 001", async () => {
        connection = await initialiseWeb3({ chainId: '900', chainName: 'Solana' });
        const swapResponse = await getPrice(connection, {
            "dexId": "2600",
            "from": "kAtVAPfxVnCGYnYQoQkhPTeRFBgH7ebKfohufiMTGKq",
            "amountIn": "100000",
            "path": ["EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
            ]
        });
        console.log(swapResponse);
    });

    test("price 002", async () => {
        connection = await initialiseWeb3({ chainId: '900', chainName: 'Solana' });
        const swapResponse = await getPrice(connection, {
            "dexId": "2600",
            "from": "kAtVAPfxVnCGYnYQoQkhPTeRFBgH7ebKfohufiMTGKq",
            "amountIn": "600000",
            "path": ["EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
            ]
        });
        console.log(swapResponse);
    });

    test("swap 002", async () => {
        connection = await initialiseWeb3({ chainId: '900', chainName: 'Solana' });
        const swapResponse = await swap(connection, {
            "dexId": "2600",
            "from": "kAtVAPfxVnCGYnYQoQkhPTeRFBgH7ebKfohufiMTGKq",
            "amountIn": "100000",
            "path": ["EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
            ]
        });
        console.log(swapResponse);
    });

    test("swap 003", async () => {
        connection = await initialiseWeb3({ chainId: '900', chainName: 'Solana' });
        const swapResponse = await swap(connection, {
            "dexId": "2600",
            "from": "kAtVAPfxVnCGYnYQoQkhPTeRFBgH7ebKfohufiMTGKq",
            "amountIn": "12s",
            "path": ["EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
            ]
        });
        console.log(swapResponse);
    });

    jest.setTimeout(30000);

});
