const { liquidate } = require('../../src/expand/synthetic/index');
const evmWeb = require('web3');
const evmWeb3 = new evmWeb(new evmWeb.providers.HttpProvider('https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'));
const axios = require('axios');

describe("Synthetics tests", () => {

    test("liquidate", async () => {  

        const result = await liquidate(evmWeb3, {
            from: '0x8e7D7a97b4aa8B6D857968058A03cd25707Ed025',
            gas: '300000',
            syntheticId: '6001'
        });
        console.log(result);
    });
    jest.setTimeout(50000)
   
    });

    