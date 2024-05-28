/* eslint-disable no-unused-vars */
/* 
 * All the function in this file
 * should be returning the following schema
 * 
    {
        "transactionHash": "0x61f77b95990e4facfaee10b993e9c68cc5d8a8c74ebbcbc122011c5e79afa9cc"
    }  
 */

const axios = require('axios');
const ethers = require('ethers');
const solanasdk = require('@solana/web3.js');
const algosdk = require('algosdk');
const nearApi = require('near-api-js');
const { TransactionBuilder } = require('stellar-sdk');

require("dotenv").config({ path: '../../../.env' });
const config = require('../../../common/configuration/config.json');
const { error } = require("../../../common/configuration/errorMessage.json");
const errorMessage = require('../../../common/configuration/errorMessage.json');

const privateTransactionNotSupported = {
    "status": 300,
    "msg": "private transactions on this chain not supported yet"
};

const throwErrorMessage = (msg) => ({
    'message': msg,
    'code': errorMessage.error.code.invalidInput
});

module.exports = {

    sendTransactionEvm: async (evmWeb3, options) => {
        /*
         * Function will send a transaction on ethereum based chains
         */

        try {
            const response = {};
            if (options.bdnTransaction === true) {

                const data = JSON.stringify({
                    "method": "blxr_tx",
                    "id": "1",
                    "params": {
                        "transaction": options.rawTransaction
                    }
                });

                const conf = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://api.blxrbdn.com',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': process.env.BDN_AUTH
                    },
                    data
                };

                const transaction = await axios.request(conf);
                return transaction.data.result;

            }

            if (options.privateTransaction === true) {

                let rpc;
                try {
                    rpc = config.privateTransaction.chains[options.chainId];
                } catch (err) {
                    return privateTransactionNotSupported;
                }
                const authSigner = new ethers.Wallet(process.env.auth_key);
                const rawTransaction = options.rawTransaction.toString();

                const data = JSON.stringify({
                    "jsonrpc": "2.0",
                    "method": "eth_sendPrivateTransaction",
                    "id": "1",
                    "params": [
                        {
                            "tx": rawTransaction,
                        }
                    ]
                });

                // eslint-disable-next-line prefer-template
                const signature = authSigner.address + ":" + await authSigner.signMessage(ethers.utils.id(data));

                const conf = {
                    method: "post",
                    maxBodyLength: Infinity,
                    maxContentLength: Infinity,
                    url: rpc,
                    headers: {
                        "Content-Type": "application/json",
                        "X-Flashbots-Signature": signature
                    },
                    data
                };

                const txHash = await axios.request(conf);
                return {
                    "transactionHash": txHash.data.result
                };
            }

            if (options.mevProtection === true) {

                let url;
                try {
                    url = config.privateTransaction.chains[options.chainId];
                } catch (err) {
                    return privateTransactionNotSupported;
                }
                const keyAuth = new ethers.Wallet(process.env.auth_key);
                const signedTx = options.rawTransaction.toString();

                const data = JSON.stringify({
                    "jsonrpc": "2.0",
                    "method": "eth_sendPrivateTransaction",
                    "id": "1",
                    "params": [
                        {
                            "tx": signedTx
                        }
                    ]
                });

                // eslint-disable-next-line prefer-template
                const signature = keyAuth.address + ":" + await keyAuth.signMessage(ethers.utils.id(data));

                const conf = {
                    method: "post",
                    maxBodyLength: Infinity,
                    maxContentLength: Infinity,
                    url,
                    headers: {
                        "Content-Type": "application/json",
                        "X-Flashbots-Signature": signature
                    },
                    data
                };

                const txHash = await axios.request(conf);
                return {
                    "transactionHash": txHash.data.result
                };
            }


            if (options.transactionHash) {
                evmWeb3.eth.sendSignedTransaction(options.rawTransaction);
                response.transactionHash = options.transactionHash;
                return response;
            }

            const receipt = await evmWeb3.eth.sendSignedTransaction(options.rawTransaction);
            response.transactionHash = receipt.transactionHash;
            return response;
        }
        catch (err) {
            console.log(err);
            return throwErrorMessage(errorMessage.error.message.executionReverted);
        }

    },

    sendTransactionSolana: async (solanaWeb3, options) => {

        const response = {};
        try {
            const receipt = await solanasdk.sendAndConfirmRawTransaction(
                solanaWeb3,
                Buffer.from(options.rawTransaction, "base64")
            );
            response.transactionHash = receipt;
            return response;
        } catch (err) {
            return throwErrorMessage(errorMessage.error.message.executionReverted);
        }
    },

    sendTransactionAVAX: async (evmWeb3, transactionHash) => {
        /*
         * Function will fetch the transaction metadata from ethereum based chains
         */

        const response = {};

        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;

        return (response);

    },

    sendTransactionAlgorand: async (algorandWeb3, options) => {
        /*
         * Function will send a transaction on Algorand chain
         */


        const response = {};
        try {
            const receipt = await axios.post(
                `${config.chains[options.chainId].rpc}tx/send` ,
                {
                  "tx":options.rawTransaction 
                } ,
                {
                    headers:{
                        'X-API-Key':config.chains[options.chainId].key
                    }
                }
              );
            response.transactionHash = receipt.data.id;
            return (response);
        } catch (err) {
            return throwErrorMessage(errorMessage.error.message.executionReverted);
        }

    },

    sendTransactionNear: async (nearWeb3, options) => {

        const response = {};
        const provider = new nearApi.providers.JsonRpcProvider(config.chains[options.chainId].rpc);

        // sends transaction to NEAR blockchain via JSON RPC call and records the result
        try {
            const receipt = await provider.sendJsonRpc("broadcast_tx_commit", [options.rawTransaction]);
            response.transactionHash = receipt.transaction.hash;
            return response;
        } catch (err) {
            return throwErrorMessage(err.type);
        }
    },

    sendTransactionTron: async (tronWeb3, options) => {

        const response = {};
        try {
            const parsedRawTx = JSON.parse(Buffer.from(options.rawTransaction, "base64").toString());
            const receipt = await tronWeb3.trx.sendRawTransaction(parsedRawTx);
            response.transactionHash = receipt.txid;
            return response;
        } catch (err) {
            return throwErrorMessage(errorMessage.error.message.executionReverted);
        }
    },

    sendTransactionSui: async (suiWeb3, options) => {

        const response = {};
        try {
            const receipt = await suiWeb3.executeTransactionBlock({
                transactionBlock: options.rawTransaction,
                signature: options.signature,
            });
            response.transactionHash = receipt;
            return response;
        } catch (err) {
            return throwErrorMessage(errorMessage.error.message.executionReverted);
        }

    },

    sendTransactionAptos: async (aptosweb3, options) => {

        /*
         * Function will send a transaction on Aptos chain
         */

        const response = {};
        try {
            const receipt = await aptosweb3.submitSignedBCSTransaction(Buffer.from(options.rawTransaction, "base64"));
            response.transactionHash = receipt;
            return response;
        }
        catch (err) {
            return throwErrorMessage(err.errorCode);
        }

    },

    sendTransactionStarkNet: async (starknetweb3, options) => {
        try {
            const params = JSON.parse(Buffer.from(options.rawTransaction, "base64").toString());
            const axiosParams = {
                headers: { "Content-Type": "application/json" },
                method: "post",
                url: config.chains[options.chainId].invokeRpc,
                data: JSON.stringify({ method: config.chains[options.chainId].starkNetInvocationMethod, jsonrpc: "2.0", params, id: 0 }),
            };
            const receipt = await axios(axiosParams);
            if (receipt.data.error) return throwErrorMessage(receipt.data.error.message);
            return receipt.data;
        }
        catch (err) {
            return err;
        }
    },

    sendTransactionStellar: async (_, options) => {
        /*
         * Function will send a transaction on Algorand chain
         */

        const { chainId, rawTransaction } = options;
        
            try {
                const apiConfig = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: config.chains[chainId].sorobanRpc,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: {
                        "jsonrpc": "2.0",
                        "id": 8675309,
                        "method": "sendTransaction",
                        "params": {
                            "transaction": rawTransaction
                        }
                    }
                };
                const response = await axios.request(apiConfig);
                return { chainId, transactionHash: response.data?.result?.hash };
            } catch (err) {
                return throwErrorMessage(errorMessage.error.message.executionReverted);
            }
    },
};
