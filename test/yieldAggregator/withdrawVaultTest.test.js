const EvmWeb = require('web3');
const { withdrawVault } = require('../../src/expand/yieldAggregator/index');


const evmWeb3 = new EvmWeb(new EvmWeb.providers.HttpProvider('http://localhost:8545'));

describe("yearn finance tests", () => {

    test("yearn vault withdraw", async () => {
   // we need to send either (tokenAddress) or (tokenAddress & vaultNumber) or (vaultAddress)
        const result = await withdrawVault(evmWeb3, {
            from: '0xC7565379C190014449eE83CF9FD7475206E59f9e',
            tokenAddress:'0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            amount: '4881310', // erc20 token
            gas: 2307200,
            vaultNumber: 1,
            // vaultAddress: '0xa258C4606Ca8206D8aA700cE2143D7db854D168c',
            yieldAggregatorId: '5000',
            privateKey: '43bebe45264429d6c641c9a886735a2f966916ca594aca8c75f2e8b7e570b290'
        });
        console.log(result);
        expect(result).toBeTruthy();
    });

});

describe("harvest finance tests", () => {
    // poolAddress should be sent if token was deposited and staked
    test("harvest vault withdraw", async () => {
        const result = await withdrawVault(evmWeb3, {
            from: '0xC7565379C190014449eE83CF9FD7475206E59f9e',
            amount: '4934226', // erc20 token
            gas: '2307200',
            vaultAddress: '0xFE09e53A81Fe2808bc493ea64319109B5bAa573e',
            yieldAggregatorId: '5100',
            // tokenAddress:'0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            privateKey: '43bebe45264429d6c641c9a886735a2f966916ca594aca8c75f2e8b7e570b290'
        });
        console.log(result);
        expect(result).toBeTruthy();
    });

});
