const { withdrawPeggedToken } = require('../../src/expand/synthetic/index');
const evmWeb = require('web3');
const evmWeb3 = new evmWeb(new evmWeb.providers.HttpProvider('https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'));
const axios = require('axios');

describe("Synthetics tests", () => {
    test("withdraw Synths", async () => {
        const result = await withdrawPeggedToken(evmWeb3, {
            from: '0x63056E00436Da25BcF48A40dfBbDcc7089351006',
            gas: "300000",
            syntheticId: '6001'
        });
        console.log(result);

        var signedTransaction = await evmWeb3.eth.accounts.signTransaction(result, "7651ba833cddc29490504f68e64cde9d1ff95bcae2a211d81ccda384e0620713");
        console.log(signedTransaction);

    });
    jest.setTimeout(50000);
});