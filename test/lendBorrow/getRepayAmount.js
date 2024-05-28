

// Initialise web3 for all EVM chains
const EvmWeb = require('web3');
const { getRepayAmount } = require('../../src/expand/lendBorrow');

const evmWeb3 = new EvmWeb('https://goerli.infura.io/v3/eb18cdee12c245ad9340ea54004ae0de');


const getRepayAmountAave = async() => {
    
    const res = await getRepayAmount(evmWeb3, {
        'asset': '0x65E2fe35C30eC218b46266F89847c63c2eDa7Dc7', 
        'user': '0x2CAaCea2068312bbA9D677e953579F02a7fdC4A9',
        'lendborrowId': '1001'
    });
    console.log(res);
};
getRepayAmountAave();