const { getBalance } = require('../../src/expand/yieldAggregator/index');
const EvmWeb = require('web3');
const evmWeb3 = new EvmWeb(new EvmWeb.providers.HttpProvider('http://localhost:8545'));

describe("yearn finance tests", () => {

    test("get balance", async () => {
   // we need to send either (tokenAddress) or (tokenAddress & vaultNumber) or (vaultAddress)
        const result = await getBalance(evmWeb3, {
            address: '0xC7565379C190014449eE83CF9FD7475206E59f9e',
            tokenAddress:'0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            // vaultNumber: 1,
            // vaultAddress: '0xa258C4606Ca8206D8aA700cE2143D7db854D168c',
            yieldAggregatorId: '5000'
        });
        console.log(result);
        expect(result).toBeTruthy();
    });

});

describe("harvest finance tests", () => {

    test("get balance", async () => {
    // poolAddress should be sent if token was deposited and staked
        const result = await getBalance(evmWeb3, {
            address: '0xC7565379C190014449eE83CF9FD7475206E59f9e',
            tokenAddress:'0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            // vaultAddress: '0xFE09e53A81Fe2808bc493ea64319109B5bAa573e',
            poolAddress: '0x3DA9D911301f8144bdF5c3c67886e5373DCdff8e',
            yieldAggregatorId: '5100'
        });
        console.log(result);
        expect(result).toBeTruthy();
    });

});