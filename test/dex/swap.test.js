const { swap, getLiquidity} = require('../../src/expand/bridge/index');
const EvmWeb = require('web3');
const evmWeb3 = new EvmWeb(new EvmWeb.providers.HttpProvider('https://goerli.infura.io/v3/eb18cdee12c245ad9340ea54004ae0de'));

describe("dex Stargate tests", () => {

   
    test("get swap Stargate", async () => {
        const result = await getLiquidity(evmWeb3, {
            "chainId": "10",
            "poolAddress": "0xDecC0c09c3B5f6e92EF4184125D5648a66E35298"
        });
        console.log(result);
        expect(result).toBeTruthy();
    });
    jest.setTimeout(30000);

    test("get liqui Stargate", async () => {
        const result = await getLiquidity(evmWeb3, {
            "dexId": "100",
            // "from": "0x902c3bdF5c0d54fB0eC901AFF8293f14750c6d45",
            "poolAddress": "0xA02e1F8c4546367763FA78fc077ba89291D4bc6C"
        });
        console.log(result);
        expect(result).toBeTruthy();
    });
    jest.setTimeout(30000);

    

});
