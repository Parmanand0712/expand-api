/* 
 * All the function in this file
 * should be returning the following schema
 * 
    {
        "sender": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        "nonce": "0",
        "initCode": "0x",
        "callData": "0x",
        "callGasLimit": "260611",
        "gasLimit": "362451",
        "verificationGasLimit": "362451",
        "preVerificationGas": "53576",
        "maxFeePerGas": "29964445250",
        "maxPriorityFeePerGas": "100000000",
        "paymasterAndData": "0x",
        "signature": "0x"
    }
 */

const config = require('../../../common/configuration/config.json');
const entryPointContractAbi = require('../../../assets/abis/entryPoint.json');
const errorMessage = require('../../../common/configuration/errorMessage.json');

module.exports = {


    getUserOpsEvm: async(evmWeb3, options) => {
        /*
         * Function will create the userOps for the ethereum based chains
         */
    
        const EntryPointContract = new evmWeb3.eth.Contract(
            entryPointContractAbi,
            config.accountAbstraction.entryPoint.contractAddress
        );
        const nonce = options.nonce ? options.nonce : await EntryPointContract.methods.getNonce(options.sender, 0).call();

        const userOps = {
            sender: options.sender,
            nonce,
            initCode: options.initCode,
            callData: options.callData,
            callGasLimit: options.callGasLimit,
            gasLimit: options.gasLimit,
            verificationGasLimit: options.verificationGasLimit,
            preVerificationGas: options.preVerificationGas,
            maxFeePerGas: options.maxFeePerGas,
            maxPriorityFeePerGas: options.maxPriorityFeePerGas,
            paymasterAndData: options.paymasterAndData,
            signature: options.signature,
        };

        return (userOps);
        
    },

    // eslint-disable-next-line no-unused-vars
    getUserOpsSolana: async(solanaWeb3, options) => {
        /*
         * Function will create the userOps for Solana
         */ 
        const response = {};
        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;
        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    getUserOpsTerra: async(terraWeb3, options) => {
        /*
         * Function will create the userOps for Terra
         */ 
        const response = {};
        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;
        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    getUserOpsTron: async(tronWeb3, options) => {
        /*
         * Function will create the userOps for Tron
         */ 
        const response = {};
        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;
        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    getUserOpsNear: async(nearWeb3, options) => {
        /*
         * Function will create the userOps for Near
         */ 
        const response = {};
        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;
        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    getUserOpsAlgorand: async(algorandWeb3, options) => {
        /*
         * Function will create the userOps for Algorand
         */ 
        const response = {};
        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;
        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    getUserOpsSui: async(suiWeb3, options) => {
        /*
         * Function will create the userOps for Sui
         */ 
        const response = {};
        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;
        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    getUserOpsAptos: async(aptosweb3, options) => {
        /*
         * Function will create the userOps for Aptos
         */ 
        const response = {};
        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;
        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    getUserOpsStarkNet: async(starknetweb3, options) => {
        /*
         * Function will create the userOps for Starknet
         */ 
        const response = {};
        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;
        return (response);
    },


};
    