const { getPrice } = require('../../src/expand/dex/index');
const EvmWeb = require('web3');
const evmWeb3 = new EvmWeb(new EvmWeb.providers.HttpProvider('http://localhost:8545'));

describe("dex get price tests", () => {

    test("get price balancer", async () => {
        const result = await getPrice(evmWeb3, {
            'dexId': '1400',
            'path': ["0x596192bb6e41802428ac943d2f1476c1af25cc0e", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
            'amountIn': "1000000000000000000"
        });
        console.log(result);
        expect(result).toBeTruthy();
    });
    jest.setTimeout(30000);

    test("get price balancer", async () => {
        const result = await getPrice(evmWeb3, {
            'dexId': '1400',
            'path': ["0x596192bb6e41802428ac943d2f1476c1af25cc0e", "0xbf5495efe5db9ce00f80364c8b423567e58d2110"],
            'amountIn': "1000000000000000000"
        });
        console.log(result);
        expect(result).toBeTruthy();
    });
    jest.setTimeout(30000);

    test("get price balancer", async () => {
        const result = await getPrice(evmWeb3, {
            'dexId': '1400',
            'path': ["0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0", "0x93d199263632a4ef4bb438f1feb99e57b4b5f0bd"],
            'amountIn': "1000000000000000000"
        });
        console.log(result);
        expect(result).toBeTruthy();
    });
    jest.setTimeout(30000);

    test("get price balancer", async () => {
        const result = await getPrice(evmWeb3, {
            'dexId': '1400',
            'path': ["0x848a5564158d84b8a8fb68ab5d004fae11619a54", "0xfae103dc9cf190ed75350761e95403b7b8afa6c0"],
            'amountIn': "1000000000000000000"
        });
        console.log(result);
        expect(result).toBeTruthy();
    });
    jest.setTimeout(30000);

    test("get price balancer", async () => {
        const result = await getPrice(evmWeb3, {
            'dexId': '1400',
            'path': ["0x848a5564158d84b8a8fb68ab5d004fae11619a54", "0xbf5495efe5db9ce00f80364c8b423567e58d2110"],
            'amountIn': "1000000000000000000"
        });
        console.log(result);
        expect(result).toBeTruthy();
    });
    jest.setTimeout(30000);

});
