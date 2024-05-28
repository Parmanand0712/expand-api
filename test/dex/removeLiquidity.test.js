const { removeLiquidity, swap } = require('../../src/expand/dex/index');
const EvmWeb = require('web3');
const evmWeb3 = new EvmWeb(new EvmWeb.providers.HttpProvider('https://aged-bold-general.quiknode.pro/aca755115e18fb7c58c55a9e7c1af78e55e9cde2/'));

describe("dex tests", () => {
    // test("remove Liquidity curveV2", async () => {
    //     const result = await removeLiquidity(evmWeb3, {
    //         "dexId": "1500",
    //         "path": ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xae7ab96520de3a18e5e111b5eaab095312d7fe84"],
    //         "amountOut": ["1000","10000"],
    //         "amountIn": "10000000",
    //         "gas": "2307200",
    //         "from": "0xaC1c52434464378Ea160E49d86866b2Ad134B515",
    //         "privateKey": "20cc6ae82fb3e398ff5f0be6def1cedf2fa88eb82c1863185d55f5efe01fb4d3"
    //     });
    //     console.log(result);
    //     expect(result).toBeTruthy();
    // });

    test("swap Liquidity Balancer", async () => {
        const result = await swap(evmWeb3, {
                "dexId": "1400",
                "swapKind": "0",
                "path": [
                    "0xae78736cd615f374d3085123a210448e74fc6393",
                    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
                ],
                "amountIn": "10000000000000000000",
                "gas": "800000",
                "gasPriority": "medium",
                "from": "0x4C99D660A51D41bE5D47D66a3d89d5B83D92f27E",
                "deadline": "1868973383"
        });
        console.log(result);
        expect(result).toBeTruthy();
    });

    // test("remove Liquidity Balancer", async () => {
    //     const result = await removeLiquidity(evmWeb3, {
    //         "dexId": "1400",
    //         "path": ["0x596192bb6e41802428ac943d2f1476c1af25cc0e", "0xbf5495efe5db9ce00f80364c8b423567e58d2110", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
    //         "amountOut": ["0","100000000"],
    //         "amountIn": "2427326557218525461",
    //         "toInternalBalance": false,
    //         "gas": "2307200",
    //         "from": "0x6851056c0f382C99fC29328159A34B5418775F84",
    //         "to": "0x6851056c0f382C99fC29328159A34B5418775F84",
    //         "privateKey": "1c2579f41e3177f8597f25117d2f9abb93daa1caa976d85b265d40433de8558b"
    //     });
    //     console.log(result);
    //     expect(result).toBeTruthy();
    // });

    // test("remove Liquidity Balancer", async () => {
    //     const result = await removeLiquidity(evmWeb3, {
    //         "dexId": "1400",
    //         "path": ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "0xdacf5fa19b1f720111609043ac67a9818262850c", "0xf1c9acdc66974dfb6decb12aa385b9cd01190e38"],
    //         "amountOut": ["100000000000000000", "100000000000000000", "0"],
    //         "amountIn": "100000000",
    //         "gas": "2307200",
    //         "toInternalBalance": true,
    //         "to": "0xaC1c52434464378Ea160E49d86866b2Ad134B515",
    //         "from": "0xaC1c52434464378Ea160E49d86866b2Ad134B515",
    //         "privateKey": "20cc6ae82fb3e398ff5f0be6def1cedf2fa88eb82c1863185d55f5efe01fb4d3"
    //     });
    //     console.log(result);
    //     expect(result).toBeTruthy();
    // });

    jest.setTimeout(30000);

});

describe("dex tests negative", () => {
    // test("remove Liquidity curveV2", async () => {
    //     const result = await removeLiquidity(evmWeb3, {
    //         "dexId": "1500",
    //         "path": ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","0xae7ab96520de3a18e5e111b5eaab095312d7fe84"],
    //         "amountOut": ["1000","10000"],
    //         "amountIn": "10000000",
    //         "gas": "2307200",
    //         "from": "0xaC1c52434464378Ea160E49d86866b2Ad134B515",
    //         "privateKey": "20cc6ae82fb3e398ff5f0be6def1cedf2fa88eb82c1863185d55f5efe01fb4d3"
    //     });
    //     console.log(result);
    //     expect(result).toBeTruthy();
    // });

    // test("remove Liquidity Balancer", async () => {
    //     const result = await removeLiquidity(evmWeb3, {
    //         "dexId": "100",
    //         "path": ["0x596192bb6e41802428ac943d2f1476c1af25cc0e", "0xbf5495efe5db9ce00f80364c8b423567e58d2110", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
    //         "amountOut": ["0","100000000"],
    //         "amountIn": "2427326557218525461",
    //         "toInternalBalance": false,
    //         "gas": "2307200",
    //         "from": "0x6851056c0f382C99fC29328159A34B5418775F84",
    //         "to": "0x6851056c0f382C99fC29328159A34B5418775F84",
    //         "privateKey": "1c2579f41e3177f8597f25117d2f9abb93daa1caa976d85b265d40433de8558b"
    //     });
    //     console.log(result);
    //     expect(result).toBeTruthy();
    // });

    // test("remove Liquidity Balancer", async () => {
    //     const result = await removeLiquidity(evmWeb3, {
    //         "dexId": "1400",
    //         "path": [ "0xdacf5fa19b1f720111609043ac67a9818262850c", "0xf1c9acdc66974dfb6decb12aa385b9cd01190e38"],
    //         "amountOut": ["100000000000000000", "100000000000000000", "0"],
    //         "amountIn": "100000000",
    //         "gas": "2307200",
    //         "toInternalBalance": true,
    //         "to": "0xaC1c52434464378Ea160E49d86866b2Ad134B515",
    //         "from": "0xaC1c52434464378Ea160E49d86866b2Ad134B515",
    //         "privateKey": "20cc6ae82fb3e398ff5f0be6def1cedf2fa88eb82c1863185d55f5efe01fb4d3"
    //     });
    //     console.log(result);
    //     expect(result).toBeTruthy();
    // });

    // jest.setTimeout(30000);

});