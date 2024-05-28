const EvmWeb = require('web3');
const { getUserBalance } = require('../../src/expand/fungibleTokens/index');
const evmWeb3 = new EvmWeb('https://mainnet.infura.io/v3/eb18cdee12c245ad9340ea54004ae0de');

describe("fungibleToken tests",  () => {

    test("fungibleToken getBalance for ethereum ERC20 Token", async () => {

        const result = await getUserBalance(evmWeb3, {
            tokenAddress:'0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            chainId: '1',
            user: '0x6Fb447Ae94F5180254D436A693907a1f576969000'
        });
        console.log(result);
        expect(result).toBeTruthy();
    });
})