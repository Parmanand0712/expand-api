/* 
 * Test file for all the possible combination
 * for the given function - getPool()
 * This is a demo file for now, should be re-written as per the mocha framework
 *  
 */

const { getPool } = require('../../src/expand/lendBorrow/index');


// Initialise web3 for all EVM chains
const EvmWeb = require('web3');
let evmWeb3 = new EvmWeb('https://mainnet.infura.io/v3/eb18cdee12c245ad9340ea54004ae0de');


const getPoolAaveTest = async() => {
    
    let price = await getPool(evmWeb3, {
        'asset': '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // Need to asset symbol for compound, address don't work there
        // 'lendborrowId': '1100'
    });
    console.log(price);

}

const getPoolCompoundTest = async() => {
    
    let price = await getPool(evmWeb3, {
        'asset': 'AAVE', // Need to asset symbol for compound, address don't work there
        'lendborrowId': '1100'
    });
    console.log(price);

}

getPoolAaveTest();
getPoolCompoundTest();