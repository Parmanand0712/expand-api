/* 
 * All the function in this file
 * should be returning the following schema
 * 
 
    {
        "gasPrice": "21000"
    }    
 */

const errorMessage = require('../../../common/configuration/errorMessage.json');
const config = require('../../../common/configuration/config.json');

module.exports = {


    getGasPriceEvm: async (evmWeb3, options) => {
        /*
         * Function will fetch the gas price from ethereum based chains
         */
        const filterOptions = options;

        const { gasPriority } = filterOptions;

        let gasPrice;
        gasPrice = await evmWeb3.eth.getGasPrice();

        switch (gasPriority) {
            case "low":
                gasPrice = Math.round(gasPrice);
                break;
            case "medium":
                gasPrice = Math.round(gasPrice * 1.2);
                break;
            case "high":
                gasPrice = Math.round(gasPrice * 1.5);
                break;
            default:
                break;
        };

        return ({ gasPrice: gasPrice.toString() });
    },

    // eslint-disable-next-line no-unused-vars
    getGasPriceSolana: async (solanaWeb3) => {
        /*
         * Function will fetch the gas price from Tron based chains
         */

        const response = {};

        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;

        return (response);
    },


    // eslint-disable-next-line no-unused-vars
    getGasPriceAVAX: async (avax) => {
        /*
         * Function will fetch the gas price from Tron based chains
         */

        const response = {};

        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;

        return (response);
    },


    getGasPriceTerra: async (terraWeb3) => {
        /*
         * Function will fetch the gas price from ethereum based chains
         */
        const gasPrice = await terraWeb3.config.gasPrices.uusd;
        const response = {};

        response.gasPrice = gasPrice.toString();

        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    getGasPriceTron: async (tronWeb3) => {
        /*
         * Function will fetch the gas price from Tron based chains
         */

        const response = {};

        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;

        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    getGasPriceAlgorand: async (algorandWeb3) => {
        /*
         * Function will fetch the gas price from Tron based chains
         */

        const response = {};

        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;

        return (response);
    },

    // eslint-disable-next-line no-unused-vars
    getGasPriceStarkNet: async (starknetweb3) => {
        /*
         * Function will fetch the gas price from StarkNet
         */

        const response = {};

        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;

        return (response);
    },


    getGasPriceNear: async (nearWeb3) => {
        /*
         * Function will fetch the gas price from near chain
         */
        let gasPrice = await nearWeb3.connection.provider.gasPrice();
        gasPrice = gasPrice.gas_price;
        const response = {};

        response.gasPrice = gasPrice.toString();

        return (response);
    },

    getGasPriceAptos: async (aptosweb3) => {
        /*
         * Function will fetch the gas price from Aptos chain
         */
        let gasPrice = await aptosweb3.estimateGasPrice();
        gasPrice = gasPrice.gas_estimate;
        const response = {};

        response.gasPrice = gasPrice.toString();

        return (response);
    },

    getGasPriceSui: async (suiWeb3) => {
        
        // Function will return current gasFee on Sui network
        
        const gasPrice = await suiWeb3.getReferenceGasPrice();
        const response = {};
        response.gasPrice = Number(gasPrice);
        return (response);

    },

    getGasPriceTon: async (tonWeb3, options) => {
        
        // Function will return current gasFee on Ton network
        
        const {chainId} = options;
        return {gasPrice: config.chains[chainId].gasPrice};
    },

    getGasPriceStellar: async (stllrWeb3) => {
        
        // Function will return current gasFee on Ton network
        
        const gasPrice = await stllrWeb3.fetchBaseFee();
        return {gasPrice: gasPrice?.toString()};
    }

};
