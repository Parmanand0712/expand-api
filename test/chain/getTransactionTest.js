/* 
 * Test file for all the possible combination
 * for the given function - getTransaction()
 * This is a demo file for now, should be re-written as per the mocha framework
 *  
 */

const { getTransaction } = require('../../src/expand/chain/index');


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
const server="https://testnet-algorand.api.purestake.io/idx2";
const port="";
const token={
	"x-api-key": "ZRJLa44Mxr7ZDfpvB0VcN6SxcUaMRLEjaxadc1w9" // fill in yours
};
let algorandWeb3=new algosdk.Indexer(token,server,port);

const getTransactionEvmTest = async() => {
    let transaction = await getTransaction(evmWeb3, {
        'transactionHash': '0x90e788df83b2e3a23725fab8a74a625186cb660b8a7dd2674f00841f1812d8c2',
    });
    console.log(transaction);
}


const getTransactionSolanaTest = async() => {
    let transaction = await getTransaction(solanaWeb3, {
        'transactionHash': '4i9zxTMkKfEK82xrmSLfBLpxCrFAYv82Sh6HFRvuoUZqjZPTKpF3DZBEc7cjkNERXPaucjnVx11kAzUuCWnszdgx',
        'chainId': '900'
    });
    console.log(transaction);
}


const getTransactionTerraTest = async() => {
    let transaction = await getTransaction(terraWeb3, {
        'transactionHash': 'BD18F4932B15C98DE954DC3F3711A0647F40AE3BC34B856272B2F49119BAE1E8',
        'chainId': '1000'
    });
    console.log(transaction);
}


const getTransactionTronTest = async() => {
    let transaction = await getTransaction(tronWeb3, {
        'transactionHash': 'c16f8c05015b64aa70707ea4b53d87175655a7e9669416284316ce48127aa10c',
        'chainId': '1100'
    });
    console.log(transaction);
}


const getTransactionNearTest = async() => {

    const near = await nearApi.connect({
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org'
    });

    let transaction = await getTransaction(near, {
        'transactionHash': 'DvZ4XNfSoEipUgZwikJ9hsjJs99Q9WRJf7FJUFj3kxNx',
        'chainId': '1200'
    });
    console.log(transaction);
}


const invalidInput = async() => {
    
    let transaction = await getTransaction(evmWeb3, {});
    console.log(transaction);
}


const getTransactionAlgorandTest = async() => {
    let transaction = await getTransaction(algorandWeb3, {
        'transactionHash': 'K3JRV4JVFZKGCVRJ34NFF2ESXWCOYUVSKNPVRCK7HQUGBZZWFHNA',
        'chainId': '1300'
    });
    console.log(transaction);
}


getTransactionAlgorandTest();
