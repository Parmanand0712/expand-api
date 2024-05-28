const { convertPeggedToProtocolToken } = require('../../src/expand/synthetic/index');
const evmWeb = require('web3');
const evmWeb3 = new evmWeb(new evmWeb.providers.HttpProvider('https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'));
const axios = require('axios');

describe("Synthetics tests", () => {

    test("exchange sUSD for SNX", async () => {  

        const result = await convertPeggedToProtocolToken(evmWeb3, {
            from: '0x731FDBd6871aD5cD905eE560A84615229eD8197a',
            amount: '2000000000000000000',
            gas: '2307200',
            syntheticId: '6001'
        });
        console.log(result);

        var signedTransaction = await evmWeb3.eth.accounts.signTransaction(result, "f426001016d73000f0b9175ef2035c64b0dbe5ea2cb6a7e95764760a8780c233");
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