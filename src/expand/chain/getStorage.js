/* eslint-disable no-unused-vars */
/* 
 * All the function in this file
 * should be returning the following schema
 * 
 
    {
        "data": "0x2873683"
    }    
 */

const { default: axios } = require('axios');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const config = require('../../../common/configuration/config.json');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});

module.exports = {
    getStorageEvm: async (evmWeb3, options) => {
        /*
         * Function will fetch the data at given slot from ethereum based chains
         */

        const filterOptions = options;
        filterOptions.function = "getStorage()";
        const validJson = await schemaValidator.validateInput(filterOptions);
    
        if ( !validJson.valid ) {
            return (validJson);
        }

        const {address, index} = filterOptions;
        const data = await evmWeb3.eth.getStorageAt(address, index);
        const response = {};

        response.data = data;

        return (response);
    },

    getStorageSolana: async () => throwErrorMessage("notApplicable"),
    getStorageAVAX: async () => throwErrorMessage("notApplicable"),
    getStorageTerra: async () => throwErrorMessage("notApplicable"),
    getStorageTron: async () => throwErrorMessage("notApplicable"),
    getStorageNear: async () => throwErrorMessage("notApplicable"),
    getStorageAlgorand: async () => throwErrorMessage("notApplicable"),

    getStorageSui: async (suiWeb3, options) => {
        /*
         * Function will fetch the data of given object from Sui 
           Object = Storage
         */
        const filterOptions = options;
        filterOptions.function = "getStorage()";
        const validJson = await schemaValidator.validateInput(filterOptions);
    
        if ( !validJson.valid ) {
            return (validJson);
        }
        const {address} = filterOptions;
        const object = await suiWeb3.getObject({
            id: address,
            // fetch the object content field
            options: { showContent: true, showPreviousTransaction: true, showOwner: true, showType: true },
        });
        const response = {};

        response.data = object;
        if (response.data.data.owner) {
            response.data.data.owner = response.data.data.owner.AddressOwner;
        }

        return (response);
    },

    getStorageAptos: async () => throwErrorMessage("notApplicable"),

    getStorageStarkNet: async (starknetweb3, options) => {
        /*
         * Function will fetch the data at given slot from ethereum based chains
         */

        const filterOptions = options;
        filterOptions.function = "getStorage()";
        const validJson = await schemaValidator.validateInput(filterOptions);
    
        if ( !validJson.valid ) {
            return (validJson);
        }
        const {address, index} = filterOptions;
        const data = await starknetweb3.getStorageAt(address, index);
        const response = {};

        response.data = data;

        return (response);
    },

    getStorageTon: async () => throwErrorMessage("notApplicable"),

    // eslint-disable-next-line no-unused-vars
    getStorageStellar: async (stllrWeb3, options) => {
        /*
         * Function will fetch the contract info of the contractId
         */

        const filterOptions = options;
        filterOptions.function = "getStellarStorage()";
        const validJson = await schemaValidator.validateInput(filterOptions);
    
        if ( !validJson.valid ) {
            return (validJson);
        }
        const { keys, chainId } = filterOptions;
        
        // Convert keys in array type
        const keysParsed = keys.split(",").map(key => key.split(" ").join("+"));

        const data = JSON.stringify({
            "jsonrpc": "2.0",
            "id": 8675309,
            "method": "getLedgerEntries",
            "params": {
                keys: keysParsed
            }
        });

        const apiConfig = {
            method: 'post',
            maxBodyLength: Infinity,
            url: config.chains[chainId].sorobanRpc,
            headers: {
                'Content-Type': 'application/json'
            },
            data
        };

        try{
            const result = await axios.request(apiConfig);
            return { entries: result.data.result.entries };
        } catch(err) {
            return throwErrorMessage("invalidKeys");
        }
    },
};
