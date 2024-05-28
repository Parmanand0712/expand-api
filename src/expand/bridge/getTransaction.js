const { default: axios } = require('axios');
const DstWeb3 = require('web3');
const { createClient } = require('@layerzerolabs/scan-client');
const http = require('http');
const https = require('https');
const config = require('../../../common/configuration/config.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');

const errorMessage = require('../../../common/configuration/errorMessage.json');

const timeout = 800;


function timeoutPromise(publicRpc) {
    return new Promise((resolve) => {
        setTimeout(() => (resolve(publicRpc)), timeout);
    });
}

function isRpcworking(rpc, publicRpc) {
    const protocol = rpc.startsWith('https') ? https : http;
    return new Promise((resolve) => {
        protocol.get(rpc, (res) => {
            const { statusCode } = res;
            if (statusCode === 200) {
                resolve(rpc);
            } else {
                resolve(publicRpc);
            }
        }).on('error', () => {
            resolve(publicRpc);
        });
    });
};

module.exports = {

    getTransactionStargate: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "getTransactionStargate";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        let response = {};
        try {
            const client = createClient(filterOptions.network);
            const { messages } = await client.getMessagesBySrcTxHash(filterOptions.transactionHash);
            // eslint-disable-next-line prefer-destructuring
            response = messages[0];
            if (messages[0] === undefined) {
                return { "message": errorMessage.error.message.wrongHash, "code": errorMessage.error.code.pendingState };
            }
            const srcTx = await web3.eth.getTransaction(messages[0].srcTxHash);
            filterOptions.dstChain = messages[0].dstChainId;
            const IDs = config.bridge[filterOptions.bridgeId].chainId;
            for (const keys in IDs) {
                if (IDs[keys] === messages[0].dstChainId) {
                    filterOptions.dstChain = keys;
                }
            }
            let dstRpc;
            try {
                dstRpc = config.chains[filterOptions.dstChain].rpc;
                console.log(dstRpc);
            } catch (error) {
                // return (invalidChainId);
            }

            await Promise.race([
                isRpcworking(config.chains[filterOptions.dstChain].rpc, config.chains[filterOptions.dstChain].publicRpc),
                timeoutPromise(config.chains[filterOptions.dstChain].publicRpc)
            ])
                .then((result) => {
                    dstRpc = result;
                });
            const dstweb3 = new DstWeb3(dstRpc);
            const dstTx = await dstweb3.eth.getTransaction(messages[0].dstTxHash);
            response.data = {
                srcTx,
                dstTx
            };
        } catch (error) {
            if (error.toString() === "Error: Returned error: invalid argument 0: json: cannot unmarshal non-string into Go value of type common.Hash")
                return { "message": errorMessage.error.message.pendingState, "code": errorMessage.error.code.pendingState };
            else if (error.toString() === "Error: CONNECTION ERROR: Couldn't connect to node http://localhost:8545.")
                return { "message": errorMessage.error.message.nodeFailure, "code": errorMessage.error.code.pendingState };

        }

        return (response);

    },

    getTransactionSquidRouter: async (web3, options) => {
        /*
         * Function will get the transaction details from squid router
         */

        const filterOptions = options;
        filterOptions.function = "getTransactionSquidRouter()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }
        let response = {};

        const { transactionHash, bridgeId } = filterOptions;
        const { apiBaseUri } = config.bridge[bridgeId];

        const apiConfig = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${apiBaseUri}status?transactionId=${transactionHash}`,
            headers: {
                'accept': 'application/json'
            },
        };

        try {
            const res = await axios.request(apiConfig);
            response = {
                "srcTx": res.data.fromChain,
                "dstTx": res.data.toChain.chainData ? res.data.toChain : {
                    "message": errorMessage.error.message.pendingState,
                    "code": errorMessage.error.code.notFound
                }
            };
        } catch (err) {
            if (err.response.data) return err.response.data;
            return (err);
        };
        return (response);
    }
};
