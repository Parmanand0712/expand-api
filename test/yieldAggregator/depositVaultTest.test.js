const { depositVault } = require('../../src/expand/yieldAggregator/index');
const EvmWeb = require('web3');
const evmWeb3 = new EvmWeb(new EvmWeb.providers.HttpProvider('http://localhost:8545'));
const { approve } = require('../../src/expand/erc20/index');

describe("yearn finance tests", () => {
    test("deposit yearn Vault", async () => {
        // yearn vault is erc20 approved first
        const erc20Approve = await approve(evmWeb3, {
            from: '0xC7565379C190014449eE83CF9FD7475206E59f9e',
            tokenAddress:'0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            amount: '5000000', // erc20 token
            to: '0xa258C4606Ca8206D8aA700cE2143D7db854D168c',
            gas: '2307200',
            chainId: '1',
            privateKey: '43bebe45264429d6c641c9a886735a2f966916ca594aca8c75f2e8b7e570b290'
        });
        console.log(erc20Approve);

        // we need to send either (tokenAddress) or (tokenAddress & vaultNumber) or (vaultAddress)
        const result = await depositVault(evmWeb3, {
            from: '0xC7565379C190014449eE83CF9FD7475206E59f9e',
            tokenAddress:'0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            amount: '5000000', // erc20 token
            vaultNumber: '1',
            // vaultAddress: '0xa258C4606Ca8206D8aA700cE2143D7db854D168c',
            yieldAggregatorId: '5000',
            gas: '2307200',
            privateKey: '43bebe45264429d6c641c9a886735a2f966916ca594aca8c75f2e8b7e570b290'
        });
        console.log(result);
        expect(result).toBeTruthy();
    });

});

describe("harvest finance tests", () => {
    test("deposit Vault", async () => {
        // harvest vault is erc20 approved first
        const erc20Approve = await approve(evmWeb3, {
            from: '0xC7565379C190014449eE83CF9FD7475206E59f9e',
            tokenAddress:'0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            amount: '5000000', // erc20 token
            to: '0xFE09e53A81Fe2808bc493ea64319109B5bAa573e',
            gas: '2307200',
            chainId: '1',
            privateKey: '43bebe45264429d6c641c9a886735a2f966916ca594aca8c75f2e8b7e570b290'
        });
        console.log(erc20Approve);
        
        const result = await depositVault(evmWeb3, {
            from: '0xC7565379C190014449eE83CF9FD7475206E59f9e',
            // vaultAddress: '0xFE09e53A81Fe2808bc493ea64319109B5bAa573e',
            tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            amount: '5000000', // erc20 token
            gas: '2307200',
            yieldAggregatorId: '5100',
            privateKey: '43bebe45264429d6c641c9a886735a2f966916ca594aca8c75f2e8b7e570b290'
        });
        console.log(result);
        expect(result).toBeTruthy();
    });

});