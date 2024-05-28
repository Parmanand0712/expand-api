const EvmWeb = require('web3');
const evmWeb3 = new EvmWeb(new EvmWeb.providers.HttpProvider('https://goerli.infura.io/v3/fc5d23096e754d64a5f261f5f07170d5'));
const { getAllowance } = require('../../src/expand/fungibleTokens/index');


describe("erc20 tests", () => {

    test("erc20 getAllowance for Token", async () => {

        const result = await getAllowance(evmWeb3, {
            tokenAddress:'0x75Ab5AB1Eef154C0352Fc31D2428Cef80C7F8B33',
            chainId: '5',
            owner: '0x902c3bdF5c0d54fB0eC901AFF8293f14750c6d45',
            spender: '0x4bd5643ac6f66a5237e18bfa7d47cf22f1c9f210'
        });
        console.log(result);
        expect(result).toBeTruthy();
    });

});