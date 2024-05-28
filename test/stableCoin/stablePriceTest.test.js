const {getPrice} = require('../../src/expand/stableCoin/index');
const {initialiseWeb3} = require('../../common/intialiseWeb3');
const config = require('../../common/configuration/config.json');


describe('StableCoin Test',()=>{
    test('Should give Price of USDC or USDT' , async() => {
        evmWeb3 = await initialiseWeb3({rpc:process.env.EVM_RPC,chainId:'1',chainName:'EVM'})
        const price = await getPrice(evmWeb3,{asset:'USDC'});
        console.log(price)
        expect(price.roundId).toBeTruthy();
        expect(price.answer).toBeTruthy();
        expect(price.startedAt).toBeTruthy();
        expect(price.updatedAt).toBeTruthy();
        expect(price.answeredInRound).toBeTruthy();
    })

    jest.setTimeout(50000)
})

