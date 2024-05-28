const EvmWeb = require('web3');
const evmWeb3 = new EvmWeb(new EvmWeb.providers.HttpProvider('http://localhost:8545'));
const { getName, getSymbol, getDecimals } = require('../../src/expand/fungibleTokens/index');
const {initialiseWeb3} = require('../../common/intialiseWeb3');

describe("fungibleToken tests", () => {

    // test("fungibleToken getName for ethereum", async () => {

    //     const result = await getName(evmWeb3, {
    //         tokenAddress:'0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    //         chainId: '1'
    //     });
    //     console.log(result);
    //     expect(result).toBeTruthy();
    // });

    // test("Solana getName() ", async () => {

    //     connection = await initialiseWeb3({chainId:'901',chainName:'Solana'});
    //     // console.log('connected: ',connection)
    //     const result = await getName(connection,{publickey:'kAtVAPfxVnCGYnYQoQkhPTeRFBgH7ebKfohufiMTGKq',token: 'AoAH8NBws97Fn4QFt9wpThBPzaTZt6aYqFqepTji3yT6',chainId: '901'});
    //     console.log(result);
    //     expect(result).toBeTruthy();
    // });
    test("Solana getSymbol() ", async () => {

        connection = await initialiseWeb3({chainId:'901',chainName:'Solana'});
        // console.log('connected: ',connection)
        const result = await getSymbol(connection,{token: 'EaHHKVB9dqsUtkdJ8iWutwTYAkiRjnMi17YQsgEM6jfp',chainId: '901'});
        console.log(result);
        expect(result).toBeTruthy();
    });
    // test("Solana getDecimal() ", async () => {

    //     connection = await initialiseWeb3({chainId:'901',chainName:'Solana'});
    //     // console.log('connected: ',connection)
    //     const result = await getDecimals(connection,{token: 'AoAH8NBws97Fn4QFt9wpThBPzaTZt6aYqFqepTji3yT6',chainId: '901'});
    //     console.log(result);
    //     expect(result).toBeTruthy();
    // });

});
