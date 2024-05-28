/* 
 * All the function in this file
 * should be returning the following schema
 * 
    {
        "from": "0x6Fb447Ae94F5180254D436A693907a1f57696900",
        "to": "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
        "gas": "93822323",
        "data": "0x1fad948c00000000000000000000000000000000000000000000000000000000000000400000000000000000000000006fb447ae94f5180254d436a693907a1f5769690000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000003fa0300000000000000000000000000000000000000000000000000000000000587d3000000000000000000000000000000000000000000000000000000000000d14800000000000000000000000000000000000000000000000000000006fa0526420000000000000000000000000000000000000000000000000000000005f5e10000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
    }
 */

const config = require('../../../common/configuration/config.json');
const entryPointContractAbi = require('../../../assets/abis/entryPoint.json');
const errorMessage = require('../../../common/configuration/errorMessage.json');

module.exports = {


    sendUserOpsEvm: async(evmWeb3, options) => {
        /*
         * Function will prepare the userOps trasnaction to be send to EntryPoint 
         * for the ethereum based chains
         */

        const {userOps, bundler} = options;
        const EntryPointContract = new evmWeb3.eth.Contract(
            entryPointContractAbi,
            config.accountAbstraction.entryPoint.contractAddress
        );
        
        const data = EntryPointContract.methods
            .handleOps(userOps, bundler)
            .encodeABI();

        return {
            from: bundler,
            to: config.accountAbstraction.entryPoint.contractAddress,
            gas: options.gas,
            data,
            value: '0'
        };
        
    },

    // eslint-disable-next-line no-unused-vars
    sendUserOpsSolana: async(solanaWeb3, options) => {
        /*
         * Function will prepare the userOps trasnaction to be send to EntryPoint 
         * for solana
         */
        const response = {};
        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;
        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    sendUserOpsTerra: async(terraWeb3, options) => {
        /*
         * Function will prepare the userOps trasnaction to be send to EntryPoint 
         * for Terra
         */
        const response = {};
        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;
        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    sendUserOpsTron: async(tronWeb3, options) => {
        /*
         * Function will prepare the userOps trasnaction to be send to EntryPoint 
         * for Tron
         */
        const response = {};
        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;
        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    sendUserOpsNear: async(nearWeb3, options) => {
        /*
         * Function will prepare the userOps trasnaction to be send to EntryPoint 
         * for Near
         */
        const response = {};
        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;
        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    sendUserOpsAlgorand: async(algorandWeb3, options) => {
        /*
         * Function will prepare the userOps trasnaction to be send to EntryPoint 
         * for Algorand
         */
        const response = {};
        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;
        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    sendUserOpsSui: async(suiWeb3, options) => {
        /*
         * Function will prepare the userOps trasnaction to be send to EntryPoint 
         * for Sui
         */
        const response = {};
        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;
        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    sendUserOpsAptos: async(aptosweb3, options) => {
        /*
         * Function will prepare the userOps trasnaction to be send to EntryPoint 
         * for Aptos
         */ 
        const response = {};
        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;
        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    sendUserOpsStarkNet: async(starknetweb3, options) => {
        /*
         * Function will prepare the userOps trasnaction to be send to EntryPoint 
         * for Starknet
         */
        const response = {};
        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;
        return (response);
    },


};
    