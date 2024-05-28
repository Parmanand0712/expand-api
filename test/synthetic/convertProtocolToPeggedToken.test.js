const { convertProtocolToPeggedToken } = require('../../src/expand/synthetic/index');
const evmWeb = require('web3');
const evmWeb3 = new evmWeb(new evmWeb.providers.HttpProvider('https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'));
const axios = require('axios');

describe("Synthetics tests", () => {

    test("issue Synths", async () => {  

        const result = await convertProtocolToPeggedToken(evmWeb3, {
            from: '0x8e7D7a97b4aa8B6D857968058A03cd25707Ed025',
            amount: '23000000000000000',
            gas: '300000',
            syntheticId: '6001'
        });
        console.log(result);

        var signedTransaction = await evmWeb3.eth.accounts.signTransaction(result, "b9207ab7362685095c3d57c6c599cdc43628fea3caa0b8c29b6a343e504ff6ee");
        console.log(signedTransaction);

        const apiURL = 'https://uat.expand.network/chain/sendtransaction/';
        const params = {
            method: "post",
            url: apiURL,
            data: signedTransaction.rawTransaction,
            headers: {
                "x-api-key" : "9iJU9jHvEf8rURIhIdKMB5SLBQMrLWCq37wMg7vL"
              }
        };
        const transactionHash = await axios(params);
        console.log (transactionHash.data);
    });
    jest.setTimeout(50000)
   
    });