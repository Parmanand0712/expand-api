/* 
 * All the function in this file
 * should be returning the following schema
 * 
    {
        "type": "Buffer",
        "data": [
            40,
            9,
            236,
            253,
            202,
            77,
            50,
            246,
            65,
            27,
            165,
            248,
            155,
            151,
            117,
            236,
            234,
            213,
            184,
            224,
            132,
            68,
            221,
            206,
            229,
            173,
            85,
            147,
            134,
            179,
            226,
            38
        ]
    }
 */
// eslint-disable-next-line import/order
const { defaultAbiCoder, keccak256 } = require("ethers/lib/utils");

const config = require('../../../common/configuration/config.json');
const errorMessage = require('../../../common/configuration/errorMessage.json');

module.exports = {


    getSignatureMessageEvm: async(evmWeb3, options) => {
        /*
         * Function will prepare the message to be signed for the EVM chains 
         */

        const entryPointContractAbi = require('../../../assets/abis/entryPoint.json');
        const EntryPointContract = new evmWeb3.eth.Contract(
            entryPointContractAbi,
            config.accountAbstraction.entryPoint.contractAddress
        );
        const nonce = options.nonce ? options.nonce : await EntryPointContract.methods.getNonce(options.sender, 0).call();

        const packUserOp = defaultAbiCoder.encode(
            [
              "address",
              "uint256",
              "bytes32",
              "bytes32",
              "uint256",
              "uint256",
              "uint256",
              "uint256",
              "uint256",
              "bytes32",
            ],
            [
              options.sender,
              nonce,
              keccak256(options.initCode),
              keccak256(options.callData),
              options.callGasLimit,
              options.verificationGasLimit,
              options.preVerificationGas,
              options.maxFeePerGas,
              options.maxPriorityFeePerGas,
              keccak256(options.paymasterAndData),
            ]
        );
        const userOpHash = keccak256(packUserOp);
        const enc = defaultAbiCoder.encode(
            ["bytes32", "address", "uint256"],
            [
                userOpHash, 
                config.accountAbstraction.entryPoint.contractAddress, 
                options.chainId ? options.chainId : 1
            ]
        );
        const encKecak = keccak256(enc);
       
        return {"messageToBeSigned": encKecak};
    },

    // eslint-disable-next-line no-unused-vars
    getSignatureMessageSolana: async(solanaWeb3, options) => {
        /*
         * Function will prepare the message to be signed for Solana 
         */
        const response = {};
        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;
        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    getSignatureMessageTerra: async(terraWeb3, options) => {
        /*
         * Function will prepare the message to be signed for Terra 
         */ 
        const response = {};
        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;
        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    getSignatureMessageTron: async(tronWeb3, options) => {
        /*
         * Function will prepare the message to be signed for Tron 
         */
        const response = {};
        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;
        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    getSignatureMessageNear: async(nearWeb3, options) => {
        /*
         * Function will prepare the message to be signed for Near 
         */ 
        const response = {};
        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;
        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    getSignatureMessageAlgorand: async(algorandWeb3, options) => {
        /*
         * Function will prepare the message to be signed for Algorand 
         */ 
        const response = {};
        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;
        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    getSignatureMessageSui: async(suiWeb3, options) => {
        /*
         * Function will prepare the message to be signed for Sui 
         */ 
        const response = {};
        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;
        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    getSignatureMessageAptos: async(aptosweb3, options) => {
        /*
         * Function will prepare the message to be signed for Aptos 
         */ 
        const response = {};
        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;
        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    getSignatureMessageStarkNet: async(starknetweb3, options) => {
        /*
         * Function will prepare the message to be signed for starknet 
         */
        const response = {};
        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;
        return (response);
    },


};