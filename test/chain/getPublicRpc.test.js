const EvmWeb = require('web3');
const evmWeb3 = new EvmWeb(new EvmWeb.providers.HttpProvider('http://localhost:8545'));
const { getPublicRpc } = require('../../src/expand/chain/index');

describe("getPublic Rpc tests", () => {

    test("get public rpc for any chain", async () => {

        const result = await getPublicRpc(evmWeb3, {
            chainId: '3'
        });
        console.log(result);
        expect(result).toBeTruthy();
    });

});
