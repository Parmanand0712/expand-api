/* 
 * Test file for all the possible combination
 * for the given function - getBlock()
 * This is a demo file for now, should be re-written as per the mocha framework
 *  
 */

const { getBlock } = require('../../src/expand/chain/index');


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


const getLatestBlockEvmTest = async() => {
    let block = await getBlock(evmWeb3, {});
    console.log(block);
}



const getBlockEvmTest = async() => {
    let block = await getBlock(evmWeb3, {
        'blockNumber': '14778266',
    });
    console.log(block);
}


const getBlockSolanaTest = async() => {
    let block = await getBlock(solanaWeb3, {
        'blockNumber': '133863018',
        'chainId': '900'
    });
    console.log(block);
}


const getBlockTerraTest = async() => {
    let block = await getBlock(terraWeb3, {
        'blockNumber': '7585126',
        'chainId': '1000'
    });
    console.log(block);
}


const invalidInput = async() => {
    let block = await getBlock(evmWeb3, {});
    console.log(block);
}

const getBlockTronTest = async() => {
    let block = await getBlock(tronWeb3, {
        'blockNumber': '40859489',
        'chainId': '1100'
    });
    console.log(block);
}

const getBlockNearTest = async() => {

    const near = await nearApi.connect({
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org'
    });

    let block = await getBlock(near, {
        'blockNumber': '73676002',
        'chainId': '1200'
    });

    console.log(block);
}

const getBlockAlgorandTest = async() => {
    let block = await getBlock(algorandWeb3, {
        'blockNumber': '23166004',
        'chainId': '1300'
    });
    console.log(block);
}

getBlockNearTest();
