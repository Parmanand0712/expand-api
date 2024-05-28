// Initialise web3 for all EVM chains
const { swap } = require('../../src/expand/dex/index');

const EvmWeb = require('web3');
let evmWeb3 = new EvmWeb(new EvmWeb.providers.HttpProvider("http://127.0.0.1:8545/"));
let evmWeb3Goerli = new EvmWeb('https://goerli.infura.io/v3/eb18cdee12c245ad9340ea54004ae0de');
let bscNodeLink= new EvmWeb('https://data-seed-prebsc-1-s1.binance.org:8545/');
const swapTest = async() => {
    
    let transactionReceipt = await swap(evmWeb3, {
        "dexId": 1200,
        "amountIn": '10000000000000000',
        "amountOutMin": '0',
        "path": ['0xd0a1e359811322d97991e03f863a0c30c2cf029c', '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa'],
        "to": "0x63056E00436Da25BcF48A40dfBbDcc7089351006",
        "deadline": 1655585025,
        "from": '0x63056E00436Da25BcF48A40dfBbDcc7089351006',
        "gas": 229880,
        "privateKey": '7651ba833cddc29490504f68e64cde9d1ff95bcae2a211d81ccda384e0620713'
    });
    console.log(transactionReceipt);

}

const uniswapV2Test = async() => {
    
    let transactionReceipt = await swap(bscNodeLink, {
        "dexId": "1201",
        "amountIn": '699784816189789637535821027598',
        "amountOutMin": '0',
        "path": ['0xFa60D973F7642B748046464e165A65B7323b0DEE','0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd'],
        "to": "0x902c3bdF5c0d54fB0eC901AFF8293f14750c6d45",
        "deadline": "1675585025",
        "involveBaseToken": '1',
        "from": '0x902c3bdF5c0d54fB0eC901AFF8293f14750c6d45',
        "gas": "500000",
        "privateKey": '49ca85836fad2c5f9f32c56de365b954548e13e92e3aac3cd4318375a72a8ffa'
    });
    console.log(transactionReceipt);

}

const uniswapV3Test = async() => {
    
    let transactionReceipt = await swap(evmWeb3, {
        "dexId": "1300",
        "amountIn": '830956861433113148664',
        "amountOutMin": '0',
        "path": ['0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2','0x6B175474E89094C44Da98b954EedeAC495271d0F'],
        "to": "0xE2a5151A989665C54E18D8DD0C54278210ed8259",
        "deadline": "1975585025",
        "involveBaseToken": '1',
        "from": '0xE2a5151A989665C54E18D8DD0C54278210ed8259',
        "gas": "500000",
        "privateKey": '0xd0e0911a7512cbdab896f1f0cfd54dbbd9f79a1a86288eb04bb7fbc4c04799c9'
    });
    console.log(transactionReceipt);

}

const swapBalancerV2Test = async() => {
    
    let transactionReceipt = await swap(evmWeb3Goerli, {
        "dexId": "1401",
        "swapKind": "0",
        "path": ['0x0000000000000000000000000000000000000000','0x8c9e6c40d3402480ACE624730524fACC5482798c'],
        "amountIn": "1000000000",
        "gas": "99000",
        "involveBaseToken": '1',
        "from": "0x902c3bdF5c0d54fB0eC901AFF8293f14750c6d45",
        "deadline": "1688973383",
        "privateKey": "49ca85836fad2c5f9f32c56de365b954548e13e92e3aac3cd4318375a72a8ffa"
    });
    console.log(transactionReceipt);

}

uniswapV3Test();