const EvmWeb = require('web3');

const TronWeb = require('tronweb');
const {getPrice} = require('../../src/expand/oracle/index');

const evmWeb3 = new EvmWeb('https://mainnet.infura.io/v3/eb18cdee12c245ad9340ea54004ae0de');

const { HttpProvider } = TronWeb.providers.HttpProvider;
const rpc = 'https://api.trongrid.io';
const fullNode = new HttpProvider(rpc);
const solidityNode = new HttpProvider(rpc);
const eventServer = new HttpProvider(rpc);
const web3 = new TronWeb(fullNode,solidityNode,eventServer);


//  Functions to Check Price - Will rewrite in Jest 
const getPriceChainLink = async()=>{
    const price = await getPrice(evmWeb3,{asset : 'ETC' });
    console.log(price);
};

const getPriceTron = async() =>{
    const price = await getPrice(web3,{asset:'WIN', oracleId:'WinkLink'});
    console.log(price);
};

getPriceChainLink();
getPriceTron();