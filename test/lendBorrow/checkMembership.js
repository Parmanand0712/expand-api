const EvmWeb = require('web3');
const { checkMembership } = require('../../src/expand/lendBorrow/index');



const evmWeb3 = new EvmWeb('https://mainnet.infura.io/v3/eb18cdee12c245ad9340ea54004ae0de');


const membershipStats = async() => {
    
    const membership = await checkMembership(evmWeb3, {
         // Need to asset symbol for compound, address don't work there
        'lendborrowId': '1100',
        'account': '0x945294C67752BD0A453975c04e3078c487a858df',
    });
    console.log(membership);

};

membershipStats();