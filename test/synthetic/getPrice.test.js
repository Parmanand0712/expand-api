const { getPrice } = require('../../src/expand/synthetic/index');
const { initialiseWeb3 } = require('../../common/intialiseWeb3');


describe('Synthetic Test',()=>{

    test('SNX latest round data, price' , async() => {
        // evmWeb3 = await initialiseWeb3({rpc:"https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", chainId:'1', chainName:'EVM'})
        // const price = await getPrice(evmWeb3, {
        //     amount : '9999'
        // });
        // console.log(price)
    });

    // jest.setTimeout(50000);

})