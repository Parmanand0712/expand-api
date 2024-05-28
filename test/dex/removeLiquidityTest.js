// Initialise web3 for all EVM chains
const { removeLiquidity } = require('../../src/expand/dex/index');

const EvmWeb = require('web3');
let evmWeb3 = new EvmWeb('https://mainnet.infura.io/v3/fc5d23096e754d64a5f261f5f07170d5');
// let evmWeb3Goerli = new EvmWeb('https://goerli.infura.io/v3/eb18cdee12c245ad9340ea54004ae0de');

// const removeLiquidityTest = async() => {

//     let transactionReceipt = await removeLiquidity(evmWeb3, {
//         "tokenA": '0xB88339C3B8F525Cfe46c7E0a3D7d748f356C79cd',
//         "tokenB": '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
//         "liquidity": 1581138830084,
//         "amountAMin": 996492488,
//         "amountBMin": 536797681302,
//         "to": '0xD60e5141ea19a77739eF4545279188bDfA2256D9',
//         "deadline": 1655490414,
//         "approveMax": true,
//         "v": 28,
//         "r": '0xaea3b64b32b611ed71d5e6789adec1e3d9cba6ef3eca1834bef5a747c779817d',
//         "s": '0x04b697bc089f23982c377853fffe308ba0b505f2c2d8bc8757ff962b9c6293f8',
//         "from": '0x63056E00436Da25BcF48A40dfBbDcc7089351006',
//         "gas": 24212,
//         "privateKey": '7651ba833cddc29490504f68e64cde9d1ff95bcae2a211d81ccda384e0620713', 
//     });

//     console.log(transactionReceipt);

// }

// const removeLiquidityUniswapV3Test = async() => {
    
//     let transactionReceipt = await removeLiquidity(evmWeb3, {
//         "dexId": 1300,
//         "tokenId": 12799,
//         "liquidity": '37876117565296290229',
//         "amount0Min": '0',
//         "amount1Min": '0',
//         "deadline": 1656479500,
//         "recipient1": "0x0000000000000000000000000000000000000000",
//         "amount0Max": "340282366920938463463374607431768211455",
//         "amount1Max": "340282366920938463463374607431768211455",
//         "amountMinimum1": "444340379098868",
//         "recipient2": "0x63056e00436da25bcf48a40dfbbdcc7089351006",
//         "token": "0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa",
//         "to": '0xD60e5141ea19a77739eF4545279188bDfA2256D9',
//         "amountMinimum2": "1558338619952374448",
//         "approveMax": true,
//         "v": 28,
//         "r": '0xaea3b64b32b611ed71d5e6789adec1e3d9cba6ef3eca1834bef5a747c779817d',
//         "s": '0x04b697bc089f23982c377853fffe308ba0b505f2c2d8bc8757ff962b9c6293f8',
//         "from": '0x63056E00436Da25BcF48A40dfBbDcc7089351006',
//         "gas": 2421200,
//         "privateKey": '7651ba833cddc29490504f68e64cde9d1ff95bcae2a211d81ccda384e0620713', 
//     });

//     console.log(transactionReceipt);

// }
const removeLiquidityBalancerv2 = async () => {

    var transactionReceipt = await removeLiquidity(evmWeb3, {
        "dexId": "1400",
        "path": ["0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0", "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9"],
        "amountOut": ["0","100000000"],
        "amountIn": "2427326557218525461",
        "toInternalBalance": false,
        "gas": "2307200",
        "from": "0x6851056c0f382C99fC29328159A34B5418775F84",
        "to": "0x6851056c0f382C99fC29328159A34B5418775F84",
        "privateKey": "1c2579f41e3177f8597f25117d2f9abb93daa1caa976d85b265d40433de8558b"
    });

    console.log(transactionReceipt);

}

removeLiquidityBalancerv2();
