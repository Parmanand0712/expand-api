const { getVaults } = require('../../src/expand/yieldAggregator/index');
const EvmWeb = require('web3');
const evmWeb3 = new EvmWeb(new EvmWeb.providers.HttpProvider('http://localhost:8545'));

describe("yearn finance tests", () => {

    test("get balance", async () => {
        // this will return vaults for a certain token address
        const result = await getVaults(evmWeb3, {
            tokenAddress:'0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            yieldAggregatorId: '5000'
        });
        console.log(result);
        expect(result).toBeTruthy();
    });

});

describe("harvest finance tests", () => {

    test("get balance", async () => {
        // this will return vaults for a certain token address
        const result = await getVaults(evmWeb3, {
            tokenAddress:'0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            yieldAggregatorId: '5100'
        });
        console.log(result);
        expect(result).toBeTruthy();
    });

});