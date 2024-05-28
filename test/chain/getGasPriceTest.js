/* 
 * Test file for all the possible combination
 * for the given function - getGasPrice()
 * This is a demo file for now, should be re-written as per the mocha framework
 *  
 */

const { getGasPrice } = require('../../src/expand/chain/index');


// Initialise web3 for all EVM chains
const EvmWeb = require('web3');
let evmWeb3 = new EvmWeb('https://goerli.infura.io/v3/eb18cdee12c245ad9340ea54004ae0de');


// Initialise web3 for all Solana
const solanaWeb = require('@solana/web3.js');
let solanaWeb3 = new solanaWeb.Connection('https://rpc.ankr.com/solana');


// Initialise web3 for all Terra
const { LCDClient } = require('@terra-money/terra.js');
let terraWeb3 = new LCDClient({
    URL: 'https://lcd.terra.dev',
    chainID: 'columbus-5',
});


// Initialise web3 for Tron
const TronWeb = require('tronweb')
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.trongrid.io");
const solidityNode = new HttpProvider("https://api.trongrid.io");
const eventServer = new HttpProvider("https://api.trongrid.io/");
const tronWeb3 = new TronWeb(fullNode,solidityNode,eventServer);

// Initialize near web3
const nearApi = require('near-api-js');

const getGasPriceEvmTest = async() => {
    let gasPrice = await getGasPrice(evmWeb3, {
        "from": "0x6Fb447Ae94F5180254D436A693907a1f57696900",
        "to": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        "data": "0x38ed1739000000000000000000000000000000000000000000000000000000e8d4a5100000000000000000000000000000000000000000000000000000000000000186a000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000006fb447ae94f5180254d436a693907a1f5769690000000000000000000000000000000000000000000000000000000000647136230000000000000000000000000000000000000000000000000000000000000002000000000000000000000000b4fbf271143f4fbf7b91a5ded31805e42b2208d6000000000000000000000000dc31ee1784292379fbb2964b3b9c4124d8f89c60",
        // "chainId": '5'
    });
    
    console.log(gasPrice);
    
}

const getGasPriceSolanaTest = async() => {
    let gasPrice = await getGasPrice(solanaWeb3, {
        'chainId': '900'
    });
    console.log(gasPrice);
}

const getGasPriceTerraTest = async() => {
    let gasPrice = await getGasPrice(terraWeb3, {
        'chainId': '1000'
    });
    console.log(gasPrice);
}

const getGasPriceTronTest = async() => {
    let gasPrice = await getGasPrice(tronWeb3, {
        'chainId': '1100'
    });
    console.log(gasPrice);
}

const getGasPriceNearTest = async() => {

    const near = await nearApi.connect({
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org'
    });

    let gasPrice = await getGasPrice(near, {
        'chainId': '1200'
    });
    console.log(gasPrice);
}


getGasPriceEvmTest();
