const { addLiquidity } = require('../../src/expand/dex/index');
const EvmWeb = require('web3');
const evmWeb3 = new EvmWeb(new EvmWeb.providers.HttpProvider("https://mainnet.infura.io/v3/fc5d23096e754d64a5f261f5f07170d5"));

describe("dex tests", () => {
    test("add Liquidity Balancer", async () => {
        const result = await addLiquidity(evmWeb3, {
            "dexId": "1400",
            "chainId": "1",
            "path": ["0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0","0x93d199263632a4ef4bb438f1feb99e57b4b5f0bd","0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
            "amountIn": ["0", "0","0"," 10000000"],
            "amountOut": "100000000",
            "fromInternalBalance": true,
            "to": "0x205fA46fDd16e216bFE526b05646FeA8DdfCC4Cb",
            "from": "0x205fA46fDd16e216bFE526b05646FeA8DdfCC4Cb",            
            "gas": "2307200",
        });
        console.log(result);
        expect(result).toBeTruthy();
    });

    jest.setTimeout(30000);

    test("add Liquidity Balancer", async () => {
        const result = await addLiquidity(evmWeb3, {
            "dexId": "1400",
            "chainId": "1",
            "path": ["0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0","0x93d199263632a4ef4bb438f1feb99e57b4b5f0bd","0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
            "amountIn": ["10000", "0",],
            "amountOut": "100000000",
            "fromInternalBalance": true,
            "to": "0xaC1c52434464378Ea160E49d86866b2Ad134B515",
            "from": "0xaC1c52434464378Ea160E49d86866b2Ad134B515",            
            "gas": "2307200",
        });
        console.log(result);
        expect(result).toBeTruthy();
    });

    jest.setTimeout(30000);

    test("add Liquidity Balancer", async () => {
        const result = await addLiquidity(evmWeb3, {
            "dexId": "1400",
            "chainId": "1",
            "path": ["0xae78736cd615f374d3085123a210448e74fc6393","0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
            "amountIn": ["10000", "0",],
            "amountOut": "100000000",
            "fromInternalBalance": true,
            "to": "0xaC1c52434464378Ea160E49d86866b2Ad134B515",
            "from": "0xaC1c52434464378Ea160E49d86866b2Ad134B515",            
            "gas": "2307200",
        });
        console.log(result);
        expect(result).toBeTruthy();
    });

    jest.setTimeout(30000);


    
    test("add Liquidity Balancer", async () => {
        const result = await addLiquidity(evmWeb3, {
            "dexId": "1400",
            "path": ["0xae78736cd615f374d3085123a210448e74fc6393", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
            "amountIn": ["100000000000000000", "100000000000000000"],
            "amountOut": "100000000",
            "gas": "2307200",
            "fromInternalBalance": true,
            "to": "0xaC1c52434464378Ea160E49d86866b2Ad134B515",
            "from": "0xaC1c52434464378Ea160E49d86866b2Ad134B515",
            "privateKey": "20cc6ae82fb3e398ff5f0be6def1cedf2fa88eb82c1863185d55f5efe01fb4d3"
        });
        console.log(result);
        expect(result).toBeTruthy();
    });

    jest.setTimeout(30000);

    test("add Liquidity Balancer", async () => {
        const result = await addLiquidity(evmWeb3, {
            "dexId": "1400",
            "path": ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "0xdacf5fa19b1f720111609043ac67a9818262850c", "0xf1c9acdc66974dfb6decb12aa385b9cd01190e38"],
            "amountIn": ["100000000000000000", "100000000000000000", "1000"] ,
            "amountOut": "100000000",
            "gas": "2307200",
            "fromInternalBalance": true,
            "to": "0xaC1c52434464378Ea160E49d86866b2Ad134B515",
            "from": "0xaC1c52434464378Ea160E49d86866b2Ad134B515",
            "privateKey": "20cc6ae82fb3e398ff5f0be6def1cedf2fa88eb82c1863185d55f5efe01fb4d3"
        });
        console.log(result);
        expect(result).toBeTruthy();
    });

    jest.setTimeout(30000);


});

describe("dex tests negative", () => {

    test("add Liquidity Balancer", async () => {
        const result = await addLiquidity(evmWeb3, {
            "dexId": "1400",
            "chainId": "1",
            "path": ["0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0","0x93d199263632a4ef4bb438f1feb99e57b4b5f0bd","0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
            "amountIn": ["0", "0","0"," 10000000"],
            "amountOut": "100000000",
            "fromInternalBalance": true,
            "to": "0x205fA46fDd16e216bFE526b05646FeA8DdfCC4Cb",
            "from": "0x205fA46fDd116bFE526b05646FeA8DdfCC4Cb",            
            "gas": "2307200",
        });
        console.log(result);
        expect(result).toBeTruthy();
    });
    test("add Liquidity Balancer", async () => {
        const result = await addLiquidity(evmWeb3, {
            "dexId": "18224",
            "chainId": "1",
            "path": ["0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0","0x93d199263632a4ef4bb438f1feb99e57b4b5f0bd","0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
            "amountIn": ["0", "0","0"," 10000000"],
            "amountOut": "100000000",
            "fromInternalBalance": true,
            "to": "0x205fA46fDd16e216bFE526b05646FeA8DdfCC4Cb",
            "from": "0x205fA46fDd16e216bFE526b05646FeA8DdfCC4Cb",            
            "gas": "2307200",
        });
        console.log(result);
        expect(result).toBeTruthy();
    });

    jest.setTimeout(30000);

    test("add Liquidity Balancer", async () => {
        const result = await addLiquidity(evmWeb3, {
            "dexId": "1400",
            "chainId": "1",
            "path": ["0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0","0x93d199263632a4ef4bb438f1feb99e57b4b5f0bd","0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
            "amountIn": ["10000", "0",],
            "amountOut": "100000000",
            "fromInternalBalance": true,
            "to": "0xaC1c5243378Ea160E49d86866b2Ad134B515",
            "from": "0xaC1c52434464378Ea160E49d86866b2Ad134B515",            
            "gas": "2307200",
        });
        console.log(result);
        expect(result).toBeTruthy();
    });

    jest.setTimeout(30000);

    
    test("add Liquidity Balancer", async () => {
        const result = await addLiquidity(evmWeb3, {
            "dexId": "1400",
            "path": ["0xae78736cd615f374d3085123a210448e74fc6393", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
            "amountIn": ["100000000000000000", "100000000000000000"],
            "amountOut": "100000000",
            "gas": "2307200",
            "to": "0xaC1c52434464378Ea160E49d86866b2Ad134B515",
            "from": "0xaC1c52434464378Ea160E49d86866b2Ad134B515",
            "privateKey": "20cc6ae82fb3e398ff5f0be6def1cedf2fa88eb82c1863185d55f5efe01fb4d3"
        });
        console.log(result);
        expect(result).toBeTruthy();
    });

    jest.setTimeout(30000);

    test("add Liquidity Balancer", async () => {
        const result = await addLiquidity(evmWeb3, {
            "dexId": "1400",
            "path": [ "0xdacf5fa19b1f720111609043ac67a9818262850c", "0xf1c9acdc66974dfb6decb12aa385b9cd01190e38"],
            "amountIn": ["100000000000000000", "100000000000000000", "1000"] ,
            "amountOut": "100000000",
            "gas": "2307200",
            "fromInternalBalance": true,
            "to": "0xaC1c52434464378Ea160E49d86866b2Ad134B515",
            "from": "0xaC1c52434464378Ea160E49d86866b2Ad134B515",
            "privateKey": "20cc6ae82fb3e398ff5f0be6def1cedf2fa88eb82c1863185d55f5efe01fb4d3"
        });
        console.log(result);
        expect(result).toBeTruthy();
    });

    jest.setTimeout(30000);


});