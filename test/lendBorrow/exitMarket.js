const EvmWeb = require('web3');
const { exitMarket } = require('../../src/expand/lendBorrow/index');


const evmWeb3 = new EvmWeb('https://goerli.infura.io/v3/eb18cdee12c245ad9340ea54004ae0de');


const exitMarketTest = async() => {
    
    const transactionReceipt = await exitMarket(evmWeb3, {
        "lendborrowId": "1101",
        "chainId":'5',
        "asset": "DAI",
        "deadline": '1755585025',
        "from": '0x902c3bdF5c0d54fB0eC901AFF8293f14750c6d45',
        "gas": "209880",
        "privateKey": '49ca85836fad2c5f9f32c56de365b954548e13e92e3aac3cd4318375a72a8ffa'
    });
    console.log(transactionReceipt);

};

exitMarketTest();