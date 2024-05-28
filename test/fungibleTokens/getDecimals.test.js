const EvmWeb = require('web3');
const evmWeb3 = new EvmWeb(new EvmWeb.providers.HttpProvider('http://localhost:8545'));
const { getDecimals } = require('../../src/expand/erc20/index');

describe("erc20 tests", () => {

    test("erc20 getDecimals for ethereum", async () => {

        const result = await getDecimals(evmWeb3, {
            tokenAddress:'0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            chainId: '1'
        });
        console.log(result);
        expect(result).toBeTruthy();
    });

});
