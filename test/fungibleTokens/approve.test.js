const EvmWeb = require('web3');
const evmWeb3 = new EvmWeb(new EvmWeb.providers.HttpProvider('http://localhost:8545'));
const { approve } = require('../../src/expand/fungibleTokens/index');
const {initialiseWeb3} = require('../../common/intialiseWeb3');

describe("erc20 tests", () => {

    // test("erc20 approve for ethereum", async () => {

    //     const result = await approve(evmWeb3, {
    //         from: '0xaC1c52434464378Ea160E49d86866b2Ad134B515',
    //         tokenAddress:'0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
    //         amount: '1000000000000000000', // erc20 token
    //         to: '0x828b154032950c8ff7cf8085d841723db2696056',
    //         gas: '2307200',
    //         chainId: '1',
    //         privateKey: '20cc6ae82fb3e398ff5f0be6def1cedf2fa88eb82c1863185d55f5efe01fb4d3'
    //     });
    //     console.log(result);
    //     expect(result).toBeTruthy();
    // });
    test('Should approve FT Token' , async() => {
        connection = await initialiseWeb3({chainId:'901',chainName:'Solana'});
        const balance = await connection.getTokenAccountBalance("BP2cHVeLCsyFAVkye2gsj6DS6hw4ZXiCmsWZD1SU7SnH");
        console.log(balance);
        // const tx = await approve(connection,{ owner:'kAtVAPfxVnCGYnYQoQkhPTeRFBgH7ebKfohufiMTGKq', token: 'AoAH8NBws97Fn4QFt9wpThBPzaTZt6aYqFqepTji3yT6', delegate:'Wdd8BBG31WyomAmztJLhpEEdfyyj5GYVq28H23UbrWM', chainId: '901', amount: '' }); // chainName: 'Solana'});
        // console.log(tx);
        //   expect(tx).toBeTruthy();
        // expect(metadata).toBeTruthy();
  });
  jest.setTimeout(50000);

});
