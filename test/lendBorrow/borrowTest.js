// Initialise web3 for all EVM chains
const { borrow } = require('../../src/expand/lendBorrow/index');

const EvmWeb = require('web3');
let evmWeb3 = new EvmWeb('https://mainnet.infura.io/v3/eb18cdee12c245ad9340ea54004ae0de');

const swapTest = async() => {
    
    let transactionReceipt = await borrow(evmWeb3, {
        "to": "0x63056E00436Da25BcF48A40dfBbDcc7089351006",
        "asset": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        "amount": "10000",
        "interestRateMode": 1,
        "referralCode": 13,
        "onBehalfOf": "0x63056E00436Da25BcF48A40dfBbDcc7089351006",
        "deadline": '1655585025',
        "from": '0x63056E00436Da25BcF48A40dfBbDcc7089351006',
        "gas": 229880,
        "privateKey": '7651ba833cddc29490504f68e64cde9d1ff95bcae2a211d81ccda384e0620713'
    });
    console.log(transactionReceipt);

}

swapTest();