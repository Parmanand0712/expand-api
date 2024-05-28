// Initialise web3 for all EVM chains
const { addLiquidity } = require('../../src/expand/dex/index');

const EvmWeb = require('web3');
let evmWeb3 = new EvmWeb('https://kovan.infura.io/v3/eb18cdee12c245ad9340ea54004ae0de');
let evmWeb3Goerli = new EvmWeb('https://goerli.infura.io/v3/eb18cdee12c245ad9340ea54004ae0de');

const addLiquidityTest = async () => {

    let transactionReceipt = await addLiquidity(evmWeb3, {
        "tokenA": '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        "tokenB": '0xdac17f958d2ee523a2206206994597c13d831ec7',
        "amountADesired": '10000000000000000000',
        "amountBDesired": '1078000000',
        "amountAMin": '10000000000000000000',
        "amountBMin": '1078000000',
        "to": '0x63056E00436Da25BcF48A40dfBbDcc7089351006',
        "deadline": '1655585025',
        "from": '0x63056E00436Da25BcF48A40dfBbDcc7089351006',
        "gas": 2307200,
        // "privateKey": '7651ba833cddc29490504f68e64cde9d1ff95bcae2a211d81ccda384e0620713',
    });

    console.log(transactionReceipt);

}
addLiquidityTest();
