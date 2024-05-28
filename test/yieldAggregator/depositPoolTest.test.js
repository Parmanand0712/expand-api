const { depositPool } = require('../../src/expand/yieldAggregator/index');
const EvmWeb = require('web3');
const evmWeb3 = new EvmWeb(new EvmWeb.providers.HttpProvider('http://localhost:8545'));
const { approve } = require('../../src/expand/erc20/index');

describe("harvest finance tests", () => {
    test("deposit Pool", async () => {

        // harvest pool is erc20 approved first
        const erc20Approve = await approve(evmWeb3, {
            from: '0xC7565379C190014449eE83CF9FD7475206E59f9e',
            tokenAddress:'0xFE09e53A81Fe2808bc493ea64319109B5bAa573e',
            amount: '4934226', // erc20 token
            to: '0x3DA9D911301f8144bdF5c3c67886e5373DCdff8e',
            gas: '2307200',
            chainId: '1',
            // privateKey: '43bebe45264429d6c641c9a886735a2f966916ca594aca8c75f2e8b7e570b290'
        });
        console.log(erc20Approve);

        const result = await depositPool(evmWeb3, {
            from: '0xC7565379C190014449eE83CF9FD7475206E59f9e',
            // poolAddress: '0x3DA9D911301f8144bdF5c3c67886e5373DCdff8e',
            tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            amount: '4934226', // erc20 token
            gas: '2307200',
            yieldAggregatorId: '5100',
            // privateKey: '43bebe45264429d6c641c9a886735a2f966916ca594aca8c75f2e8b7e570b290'
        });
        console.log(result);
        expect(result).toBeTruthy();
    });

});