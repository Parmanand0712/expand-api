const EvmWeb = require('web3');
const evmWeb3 = new EvmWeb(new EvmWeb.providers.HttpProvider('http://localhost:8545'));
const { convertWrapTokenToBaseToken } = require('../../src/expand/erc20/index');

describe("erc20 tests", () => {

    test("erc20 convertWrapTokenToBaseToken for ethereum", async () => {

        const result = await convertWrapTokenToBaseToken(evmWeb3, {
            from: '0x739951Ef3Cee61B0f54bbA97AFb7814A6bFaaEf9',
            tokenAddress:'0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            amount: '5', // erc20 token
            gas: '2307200',
            chainId: '1',
            // privateKey: 'e730706646b38f80fc016675e9fec8b149148f12b00c4214b313914b708bb863'
        });
        console.log(result);
        expect(result).toBeTruthy();
    });

});
