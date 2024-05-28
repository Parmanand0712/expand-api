/* 
 * Test file for all the possible combination
 * for the given function - getStorage()
 * This is a demo file for now, should be re-written as per the mocha framework
 *  
 */

const { getStorage } = require('../../src/expand/chain/index');


// Initialise web3 for all EVM chains
const EvmWeb = require('web3');
let evmWeb3 = new EvmWeb('https://mainnet.infura.io/v3/eb18cdee12c245ad9340ea54004ae0de');


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


const getStorageEvmTest = async() => {
    let storage = await getStorage(evmWeb3, {
        'address': '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
        'index': '0'
    });
    console.log(storage);
}


getStorageEvmTest();
