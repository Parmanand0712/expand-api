/* 
 * All the function in this file
 * should be returning the following schema
 * 
    {
        "paymasterData": "0xba60b04029be2bfd16d76e70290acfad3a8b582c00000000000000000000000000000000000000000000000000000000deadbeef00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "hash": "0xf68c0dd0a01f5fd9b3fe85fd887fa8f30456bfb3ac692abb9889cf6a4ff7d799",
        "mockValidUntil": "0x00000000deadbeef",
        "mockValidAfter": "0x0"
    }
 */
// eslint-disable-next-line import/order
const { hexConcat, defaultAbiCoder } = require("ethers/lib/utils");

const config = require('../../../common/configuration/config.json');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const verifyingPaymasterContractAbi = require('../../../assets/abis/verifyingPaymaster.json');
const entryPointContractAbi = require('../../../assets/abis/entryPoint.json');

module.exports = {


    getPaymasterDataEvm: async(evmWeb3, options) => {
        /*
         * Function will prepare the data for paymaster for the EVM chains 
         */

        const paymasterContract = new evmWeb3.eth.Contract(
            verifyingPaymasterContractAbi,
            options.paymasterContractAddress
        );
        const paymasterData = hexConcat([
            options.paymasterContractAddress,
            defaultAbiCoder.encode(
                [
                    "uint48", 
                    "uint48"
                ],
                [
                    options.mockValidUntil, 
                    options.mockValidAfter
                ]
            ),
            `0x${"00".repeat(65)}`,
        ]);

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
            paymasterAndData: paymasterData,
            signature: options.signature,
        };

        const hash = await paymasterContract.methods
            .getHash(userOps, options.mockValidUntil, options.mockValidAfter)
            .call();

        return ({ paymasterData, hash,
            "mockValidUntil": options.mockValidUntil,
            "mockValidAfter": options.mockValidAfter 
        });
    },

    // eslint-disable-next-line no-unused-vars
    getPaymasterDataSolana: async(terraWeb3, options) => {
        /*
         * Function will prepare the data for paymaster for Solana 
         */
        const response = {};
        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;
        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    getPaymasterDataTerra: async(terraWeb3, options) => {
        /*
         * Function will prepare the data for paymaster for Terra 
         */
        const response = {};
        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;
        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    getPaymasterDataTron: async(tronWeb3, options) => {
        /*
         * Function will prepare the data for paymaster for Tron 
         */
        const response = {};
        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;
        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    getPaymasterDataNear: async(nearWeb3, options) => {
        /*
         * Function will prepare the data for paymaster for Near 
         */ 
        const response = {};
        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;
        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    getPaymasterDataAlgorand: async(algorandWeb3, options) => {
        /*
         * Function will prepare the data for paymaster for Algorand 
         */ 
        const response = {};
        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;
        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    getPaymasterDataSui: async(suiWeb3, options) => {
        /*
         * Function will prepare the data for paymaster for Sui 
         */ 
        const response = {};
        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;
        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    getPaymasterDataAptos: async(aptosweb3, options) => {
        /*
         * Function will prepare the data for paymaster for Aptos 
         */ 
        const response = {};
        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;
        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    getPaymasterDataStarkNet: async(starknetweb3, options) => {
        /*
         * Function will prepare the data for paymaster for Starknet  
         */
        const response = {};
        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;
        return (response);
    },


};