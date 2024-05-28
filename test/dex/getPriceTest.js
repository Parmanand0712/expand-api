/* 
 * Test file for all the possible combination
 * for the given function - getGasPrice()
 * This is a demo file for now, should be re-written as per the mocha framework
 *  
 */

const { getPrice } = require('../../src/expand/dex/index');


// Initialise web3 for all EVM chains
const EvmWeb = require('web3');
let evmWeb3 = new EvmWeb('https://mainnet.infura.io/v3/eb18cdee12c245ad9340ea54004ae0de');

let evmWeb3Bsc = new EvmWeb('https://bsc-dataseed1.binance.org/');


const getPriceEvmTest = async() => {
    let price = await getPrice(evmWeb3, {
        'dexId': '1000',
        'path': ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2','0xdac17f958d2ee523a2206206994597c13d831ec7'],
        'amountIn': '10000000000000000000'
    });
    console.log(price);
}

const getPriceEvmTest2 = async() => {
    let price = await getPrice(evmWeb3Bsc, {
        'dexId': '1200',
        'path': ['0xe9e7cea3dedca5984780bafc599bd69add087d56','0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'],
        'amountIn': '100000000000000000'
    });
    console.log(price);
}

const getPriceUniswapV3EvmTest = async() => {
    let price = await getPrice(evmWeb3, {
        'dexId': '13001312',
        'path': ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', '0xdac17f958d2ee523a2206206994597c13d831ec7'],
        'amountIn': '10000000000000000000'
    });
    console.log(price);
}

const getPriceBalancerV2EvmTest = async() => {
    let price = await getPrice(evmWeb3, {
        'dexId': '1400',
        'path': ["0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "0xdAC17F958D2ee523a2206206994597C13D831ec7"], // WETH - USDT
        'amountIn': "1000000000000000000"
    });
    console.log(price);
}


// getPriceEvmTest();
// getPriceUniswapV3EvmTest();.
getPriceBalancerV2EvmTest()
