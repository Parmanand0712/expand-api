const { getPool } = require('../../src/expand/dex/index');
const EvmWeb = require('web3');
let web3 = new EvmWeb('https://goerli.infura.io/v3/eb18cdee12c245ad9340ea54004ae0de');



const getPoolEvmTest = async() => {
    let price = await getPool(web3, {
            'path': ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2','0xdac17f958d2ee523a2206206994597c13d831ec7'],
            'amountIn': '1000000000000000000',
            'dexId': ['1002']
    });
    console.log(price);
};
getPoolEvmTest();