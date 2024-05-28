// Import the multiple different web3 libraries
const EvmWeb = require('web3');
const solanaWeb = require('@solana/web3.js');
const { LCDClient } = require('@terra-money/terra.js');
const TronWeb = require('tronweb');
const nearApi = require('near-api-js');
const algosdk = require('algosdk');
const aptos = require('aptos');
const http = require('http');
const https = require('https');
const { TonClient } = require('@ton/ton');
const { getHttpEndpoint } = require('@orbs-network/ton-access');
const {
    JsonRpcProvider,
    Connection
} = require("@mysten/sui.js");
const {Horizon} = require("stellar-sdk");
const starknet = require('starknet');
const common = require('./common');
const config = require('./configuration/config.json');
const errorMessage = require('./configuration/errorMessage.json');

const invalidChainId = {
    'error': errorMessage.error.message.invalidChainId,
    'code': errorMessage.error.code.invalidInput
};

// eslint-disable-next-line consistent-return
function isRpcworking(rpc) {
    const protocol = rpc.startsWith('https') ? https : http;

    return new Promise((resolve) => {
        protocol.get(rpc, () => {
            resolve(rpc);
        }).on('error', () => {
            resolve(null); // Resolve with null or handle the error as needed
        });
    });

};

exports.initialiseWeb3 = async (data) => {
    /*
     * Initialise a web3 depending on the chain Id or chain Symbol
     *    
     */
    const chainId = await common.getChainId({
        chainId: data.chainId,
        chainSymbol: data.chainSymbol
    });

    let rpc;
    let chainName;

    try {
        rpc = config.chains[chainId].rpc;
        chainName = config.chains[chainId].chainName;
        // eslint-disable-next-line no-param-reassign
        data.chainId = chainId;
    } catch (error) {
        return (invalidChainId);
    }

    if (data.rpc === undefined) {
        const promisesToRace = (config.chains[chainId].thirdPartyRpc !== undefined) ? 
        [
            isRpcworking(config.chains[chainId].thirdPartyRpc)
        ] 
        :
        [
            new Promise((resolve, reject) => {
                isRpcworking(config.chains[chainId].publicRpc)
                    .then(result => resolve(result))
                    .catch(() => {
                        isRpcworking(config.chains[chainId].rpc)
                            .then(result => resolve(result))
                            .catch(error => reject(error));
                    });
            })
        ];
    
        const result = await Promise.race(promisesToRace);
        rpc = result;
    } else {
        rpc = data.rpc;
    }
    console.log(rpc);

    let web3;

    switch (chainName) {
        case 'Evm':
            web3 = new EvmWeb(rpc);
            break;
        case 'Solana':
            web3 = new solanaWeb.Connection(rpc);
            break;
        case 'Terra':
            web3 = new new LCDClient({
                URL: rpc,
                chainID: data.networkId,
            });
            break;
        case 'Tron':
            {
                const { HttpProvider } = TronWeb.providers;
                const fullNode = new HttpProvider(rpc);
                const solidityNode = new HttpProvider(rpc);
                const eventServer = new HttpProvider(rpc);
                const privateKey = config.chains[chainId].defaultPrivateKey;
                web3 = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
                break;
            }

        case 'Near':
            web3 = await nearApi.connect({
                networkId: data.networkId,
                nodeUrl: rpc
            });
            break;
        case 'Algorand':
            {
                const token = {
                    "x-api-key": config.chains[chainId].key // fill in yours
                };
                web3 = new algosdk.Indexer(token, config.chains[chainId].rpc, "");
                break;
            }

        case 'Sui':
            {
                const connection = new Connection({
                    fullnode: config.chains[chainId].rpc,
                });
                web3 = new JsonRpcProvider(connection);
                break;
            }
        case 'Aptos':
            web3 = new aptos.AptosClient(config.chains[chainId].rpc);
            break;
        case 'StarkNet':
            web3 = new starknet.RpcProvider({ nodeUrl: config.chains[chainId].rpc });
            break;
        case 'Ton':
            {
                const endpoint = await getHttpEndpoint({ network: config.chains[chainId].network });
                web3 = new TonClient({ endpoint });
                break;
            }
        case 'Stellar':
            web3 = new Horizon.Server(rpc);
            break;
        default:
            break;
    };
    return web3;
};

exports.initialiseWeb3ForBridges = async (data) => {
    /*
     * Initialise a web3 depending on the chain Id or chain Symbol
     *    
     */
    const srcChainId = await common.getChainId({
        chainId: data.srcChainId,
        chainSymbol: data.srcChainSymbol
    });

    const dstChainId = await common.getChainId({
        chainId: data.dstChainId,
        chainSymbol: data.dstChainSymbol
    });

    const { bridgeId } = data;

    // eslint-disable-next-line no-param-reassign
    data.dstChainId = (bridgeId === "200" || bridgeId === "201") ? data.dstChainId : dstChainId;

    let rpc;
    let chainName;

    try {
        rpc = config.chains[srcChainId].rpc;
        chainName = config.chains[srcChainId].chainName;
        // eslint-disable-next-line no-param-reassign
        data.srcChainId = srcChainId;
    } catch (error) {
        return (invalidChainId);
    }

    if (data.rpc === undefined) {
        const promisesToRace = (config.chains[srcChainId].thirdPartyRpc !== undefined) ? 
        [
            isRpcworking(config.chains[srcChainId].rpc),
            isRpcworking(config.chains[srcChainId].publicRpc),
            isRpcworking(config.chains[srcChainId].thirdPartyRpc)
        ] 
        :
        [
            isRpcworking(config.chains[srcChainId].rpc),
            isRpcworking(config.chains[srcChainId].publicRpc)
        ];

        await Promise.race(promisesToRace)
            // eslint-disable-next-line no-unused-vars
            .then((result) => {
                rpc = result;
            });
    } else {
        rpc = data.rpc;
    } 

    console.log(rpc);
    let web3;

    if (chainName === 'Evm') {

        web3 = new EvmWeb(rpc);

    } else if (chainName === 'Solana') {

        web3 = new solanaWeb.Connection(rpc);

    } else if (chainName === 'Terra') {

        web3 = new LCDClient({
            URL: rpc,
            chainID: data.networkId,
        });

    } else if (chainName === 'Tron') {

        const { HttpProvider } = TronWeb.providers;
        const fullNode = new HttpProvider(rpc);
        const solidityNode = new HttpProvider(rpc);
        const eventServer = new HttpProvider(rpc);
        web3 = new TronWeb(fullNode, solidityNode, eventServer);

    } else if (chainName === 'Near') {

        web3 = await nearApi.connect({
            networkId: data.networkId,
            nodeUrl: rpc
        });

    } else if (chainName === 'Algorand') {

        const token = {
            "x-api-key": config.chains[srcChainId].key // fill in yours
        };
        web3 = new algosdk.Indexer(token, config.chains[srcChainId].rpc, "");

    } else if (chainName === 'Sui') {

        const connection = new Connection({
            fullnode: config.chains[srcChainId].rpc,
        });
        web3 = new JsonRpcProvider(connection);
    }
    else if (chainName === 'Aptos') {

        web3 = new aptos.AptosClient(config.chains[srcChainId].rpc);

    }
    else if (chainName === 'StarkNet') {

        web3 = new starknet.RpcProvider({ nodeUrl: config.chains[srcChainId].rpc });

    }


    return (web3);

};