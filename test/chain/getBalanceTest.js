/* 
 * Test file for all the possible combination
 * for the given function - getBalance()
 * This is a demo file for now, should be re-written as per the mocha framework
 *  
 */

const { getBalance } = require('../../src/expand/chain/index');


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


// Initialize near web3
const nearApi = require('near-api-js');

// Initialize Algorand web3
const algosdk=require('algosdk');
const server="https://testnet-algorand.api.purestake.io/ps2";
const port="";
const token={
	"x-api-key": "ZRJLa44Mxr7ZDfpvB0VcN6SxcUaMRLEjaxadc1w9" // fill in yours
};
let algorandWeb3=new algosdk.Algodv2(token,server,port);


const getBalanceEvmTest = async() => {
    let balance = await getBalance(evmWeb3, {
        'address': '0x24BA1542F8a0a20e8251d096213384Cfb0eE3dbC',
        'tokenAddress': '0x6B175474E89094C44Da98b954EedeAC495271d0F'
    });
    console.log(balance);
}

const getBalanceSolanaTest = async() => {
    let balance = await getBalance(solanaWeb3, {
        'address': 'aK2dDzV4B5kyxNrF9C5mwNP3yZJMHKeSSUe8LbuZhJY',
        'chainId': '900'
    });
    console.log(balance);
}


const getBalanceTerraTest = async() => {
    let balance = await getBalance(terraWeb3, {
        'address': 'terra16jsypha5lv6e3mc24veqzfw3rznfqu92dmteem',
        'chainId': '1000'
    });
    console.log(balance);
}

const getBalanceTronTest = async() => {
    let balance = await getBalance(tronWeb3, {
        'address': 'relay.aurora',
        'chainId': '1200'
    });
    console.log(balance);
}

const getBalanceAlgorandTest = async() => {
    let balance = await getBalance(algorandWeb3, {
        'address': 'GMO7N35PGI476TB5HEUBKMC5ENF4YAS22FUWCMVKGO47LAE4LPF6HNONFI',
        'chainId': '1300'
    });
    console.log(balance);
}

const getBalanceNearTest = async() => {

    const near = await nearApi.connect({
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org'
    });

    let balance = await getBalance(near, {
        'address': 'relay.aurora',
        'chainId': '1200'
    });
    
    console.log(balance);
}

const invalidInput = async() => {
    let balance = await getBalance(evmWeb3, {});
    console.log(balance);
}


getBalanceSolanaTest();