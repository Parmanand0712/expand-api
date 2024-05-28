const EvmWeb = require('web3');
const evmWeb3 = new EvmWeb(new EvmWeb.providers.HttpProvider('http://localhost:8545'));
const { transferFrom } = require('../../src/expand/erc20/index');

describe("erc20 tests", () => {

    test("erc20 transferFrom for ethereum", async () => {

        const result = await transferFrom(evmWeb3, {
            from: '0xF4f7c657D76E3A26137A99752eAED2941C06b336',
            reciever: '0x3e21aCc8439Cea0080C23fe0aeF906bC282cdbeD',
            tokenAddress:'0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            amount: '5', // erc20 token
            to: '0x6672a7e294aca680BCB2087F446BAe0Dc5A57769',
            gas: '2307200',
            chainId: '1',
            // privateKey: '56dad4de8a6887fd74f9c48bc311e847536d2b02bfd145f06f1cb8700412a3d3'
        });
        console.log(result);
        expect(result).toBeTruthy();
    });

});
