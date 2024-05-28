const { withdrawPool } = require('../../src/expand/yieldAggregator/index');
const EvmWeb = require('web3');
const evmWeb3 = new EvmWeb(new EvmWeb.providers.HttpProvider('http://localhost:8545'));

describe("harvest finance tests", () => {
    // poolAddress should be sent if token was deposited and staked
    test("deposit withdraw", async () => {
        const result = await withdrawPool(evmWeb3, {
            from: '0xC7565379C190014449eE83CF9FD7475206E59f9e',
            privateKey: '43bebe45264429d6c641c9a886735a2f966916ca594aca8c75f2e8b7e570b290',
            amount: '4934226', // erc20 token
            gas: '2307200',
            tokenAddress:'0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            // poolAddress: '0x3DA9D911301f8144bdF5c3c67886e5373DCdff8e',
            yieldAggregatorId: '5100'
        });
        console.log(result);
        expect(result).toBeTruthy();
    });

});
