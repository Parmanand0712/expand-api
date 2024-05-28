/* 
 * Test file for all the possible combination
 * for the given function - sendTransaction()
 * This is a demo file for now, should be re-written as per the mocha framework
 *  
 */


const { sendTransaction } = require('../../src/expand/chain/index');

let Tx = require('ethereumjs-tx').Transaction;

// Initialise web3 for all EVM chains
const EvmWeb = require('web3');
let evmWeb3 = new EvmWeb('https://ropsten.infura.io/v3/eb18cdee12c245ad9340ea54004ae0de');

// Initialise web3 for solana
let solanaWeb = require('@solana/web3.js');
const solanaWeb3 = new solanaWeb.Connection(
    solanaWeb.clusterApiUrl('testnet'),
    'confirmed',
);

// Initialise web3 for algorand
const algosdk=require('algosdk');
const server="https://testnet-algorand.api.purestake.io/ps2";
const port="";
const token={
	"x-api-key": "ZRJLa44Mxr7ZDfpvB0VcN6SxcUaMRLEjaxadc1w9" // fill in yours
};
let client=new algosdk.Algodv2(token,server,port);


const sendTransactionTest = async() => {
    
    let transactionReceipt = await sendTransaction(evmWeb3, {
        "from": "0x63056E00436Da25BcF48A40dfBbDcc7089351006",
        "to": "0x63056E00436Da25BcF48A40dfBbDcc7089351006",
        "gas": 21000,
        "privateKey": "7651ba833cddc29490504f68e64cde9d1ff95bcae2a211d81ccda384e0620713"
    });
    console.log(transactionReceipt);
}

const sendTransactionSolanaTest = async() => {
    
    let transactionReceipt = await sendTransaction(solanaWeb3, {
        "chainId": 900,
        "from": "3NxmBht2nhPp38NLoGEBpCGCcgFe8gARQtoM7wRndS9E",
        "to": "4ETf86tK7b4W72f27kNLJLgRWi9UfJjgH4koHGUXMFtn",
        "gas": 123098,
        "privateKey": "3tPR59hfccbWcMZhk7V9Poa9Y29gxgJ8ELfkBPWKjF9a2pAJzDsKKAmviRXk79dkKpP5n8CAosUPDXGx3csXxVqA",
        "value": "10000"
    });
    console.log(transactionReceipt);
    
}

const sendTransactionAlgorandTest = async() => {
    
    let mneo = "laugh stairs place chase now symbol script north resist square wrestle midnight gadget end layer pave swallow hurdle shop learn wheel neutral fall abandon balance";

    let transactionReceipt = await sendTransaction(client, {
        "chainId": 1300,
        "from": "GMO7N35PGI476TB5HEUBKMC5ENF4YAS22FUWCMVKGO47LAE4LPF6HNONFI",
        "to": "JVUJKFVXOCROVEMTNF2AA7XAQNZ7AMLN4JS6BI5HMFHWB2WIC6LIBL3GGE",
        "gas": 1,
        "privateKey": mneo,
        "value": "1000000"
    });
    console.log(transactionReceipt);
    
}

const sendTransactionNearTest = async() => {
    
    let key = "key";

    let transactionReceipt = await sendTransaction(client, {
        "chainId": 1200,
        "from": "kushagra-test.testnet",
        "to": "kushagra-test2.testnet",
        "privateKey": key,
        "value": "1",
        "gas": 123,
        "networkId": "testnet"
    });
    console.log(transactionReceipt);
    
}

sendTransactionNearTest();