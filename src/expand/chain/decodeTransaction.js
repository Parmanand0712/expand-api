/* eslint-disable no-unused-vars */
/* 
 * All the function in this file
 * should be returning the following schema
 * 
    {
        "transactionHash": "0x61f77b95990e4facfaee10b993e9c68cc5d8a8c74ebbcbc122011c5e79afa9cc"
    }  
 */

const { utils } = require("ethers");
const  { Transaction } = require("@solana/web3.js");
const nearAPI  = require('near-api-js');
const abiDecoder = require("abi-decoder");
const axios = require("axios");
const {TransactionBuilder} = require("stellar-sdk");

const config = require("../../../common/configuration/config.json");
const errorMessage = require("../../../common/configuration/errorMessage.json");

const throwErrorMessage = (msg) => ({
  'message': errorMessage.error.message[msg],
  'code': errorMessage.error.code.invalidInput
});



module.exports = {
  
  decodeTransactionEvm: async (_, options) => {
    /*
     * Function will decode a transaction on ethereum based chains
     */

    try {
        const response = {};
        const parsedTx = utils.parseTransaction(options.rawTransaction);
        let abi;

        response.parsedTx = parsedTx;
        response.assetChanges = {
          from: parsedTx.from,
          to: parsedTx.to,
          value: parsedTx.value,
        };

        const functionCalls = {};
        try {
            const smartContractAddr = (config.decodeTransactions.proxies[parsedTx.to])?config.decodeTransactions.proxies[parsedTx.to]:parsedTx.to;
            const baseUrl = config.decodeTransactions.baseUrl[options.chainId];
            const apiKey = config.decodeTransactions.apiKey[options.chainId];
            abi = await axios.get(
              `${baseUrl}api?module=contract&action=getabi&address=${smartContractAddr}&apikey=${apiKey}`
            );
            abiDecoder.addABI(JSON.parse(abi.data.result));
            functionCalls[smartContractAddr] = {};
            functionCalls[smartContractAddr] =  abiDecoder.decodeMethod(parsedTx.data);
            const { params } = functionCalls[smartContractAddr];
            for( const i in params){
                if(params[i].type === 'tuple'){
                    const payload = params[i].value;
                    const updatedResponse = {};
                    Object.keys(payload).forEach((key) => {
                        if (Number.isNaN(parseInt(key, 10))) {
                            updatedResponse[key] = payload[key];
                        }
                    });
                    params[i].value = updatedResponse;
                }
            }
            functionCalls[smartContractAddr].params = params;
            response.functionCalls = functionCalls;
        } catch (error) {
          // console.log(error);
        }

      return response;
    } catch (err) {
      return throwErrorMessage("unspportedTxType");
    }
  },

  decodeTransactionSolana: async (_, options) => {    
    const response = {};
    
    try{
        const buffer = Buffer.from(options.rawTransaction,"base64");
        const decodedTx =  Transaction.from(buffer);
        response.parsedTx = decodedTx;
        return response;
    } catch(error) {
        return throwErrorMessage("unspportedTxType");
    }
  },

  decodeTransactionNear: async (_, options) => {
   
    const response = {};
    try{

      const buffer = Buffer.from(options.rawTransaction, "base64");
      const signedTx = nearAPI.transactions.SignedTransaction.decode(buffer);

      response.parsedTx = signedTx;
      return response;

    } catch(error){
      // console.log(error);
      return throwErrorMessage("unspportedTxType");
    }
  },

  decodeTransactionTron: async () => throwErrorMessage("notApplicable"),
  decodeTransactionSui: async () => throwErrorMessage("notApplicable"),
  decodeTransactionAptos: async () => throwErrorMessage("notApplicable"),
  decodeTransactionAlgorand: async () => throwErrorMessage("notApplicable"),
  decodeTransactionStarkNet: async () => throwErrorMessage("notApplicable"),
  decodeTransactionAvax: async () => throwErrorMessage("notApplicable"),
  decodeTransactionTon: async () => throwErrorMessage("notApplicable"),

  decodeTransactionStellar: async (_, options) => {
    const {chainId, rawTransaction} = options;
    try{
      const decodedTx = TransactionBuilder.fromXDR(rawTransaction, config.chains[chainId].networkPassphrase);
      const response = {
        network: chainId,
        transactionEnvelope: rawTransaction,
        transactionHash: decodedTx.hash().toString("hex") ,
        feeSourceAccount: decodedTx.feeSource,
        transactionFee: decodedTx.fee,
        source: decodedTx._source,
        sequence: decodedTx._sequence,
        operations: decodedTx._operations,
        signatures: decodedTx._signatures
      };
      return response;
    } catch(err){
      return {
        'message': errorMessage.error.message.invalidRawTransaction,
        'code': errorMessage.error.code.invalidInput
      };
    }
  }
};
