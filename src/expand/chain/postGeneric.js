
/*
 * All the function in this file
 * should be returning the following schema
 *

    {
        "methodName": "value"
    }
*/

const axios = require("axios");
const config = require("../../../common/configuration/config.json");

const errorMessage = require('../../../common/configuration/errorMessage.json');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
  });

module.exports = {

    postGenericEvm: async (evmWeb3, options) => {

        let result;
        const configuration = {};
        const objSorted = {};
        let abiResponse;
        const filterOptions = options;

        configuration.params = {
            module: config.etherscan.moduleGeneric,
            action: config.etherscan.actionGeneric,
            address: filterOptions.contractAddress,
            apiKey: config.etherscan.apiKey
        };

        if (config.etherscan.baseUrl[filterOptions.chainId] === undefined) return throwErrorMessage("invalidFunction");
        try {
            abiResponse = filterOptions.abi || await axios.get(config.etherscan.baseUrl[filterOptions.chainId], configuration)
                .then(res => JSON.parse(res.data.result));
        }
        catch (error) {
            return throwErrorMessage("invalidAbi");
        }

        const blockNumber = filterOptions.blockNumber ? filterOptions.blockNumber : "latest";

        const contract = new evmWeb3.eth.Contract(
            abiResponse,
            filterOptions.contractAddress
        );

        const { methods } = contract;

        const methodAbi = abiResponse.find(data => data.name === filterOptions.methodName);

        if (!methodAbi) return throwErrorMessage("invalidMethodName");

        if (!filterOptions.parameters) {

            if (((methodAbi.inputs).length) !== 0) return throwErrorMessage("invalidParameters");

            result = await methods[filterOptions.methodName]().call(null, blockNumber);
        }

        else if (filterOptions.parameters) {

            if (((methodAbi.inputs).length) !== (filterOptions.parameters).length) return throwErrorMessage("invalidParameters");

            for (let i = 0; i < (methodAbi.inputs).length; i += 1) {
                objSorted[i] = (filterOptions.parameters)[i];
            }

            result = await methods[filterOptions.methodName](...Object.values(objSorted)).call(null, blockNumber);

        }

        return { [filterOptions.methodName]: result };
    },

    // eslint-disable-next-line no-unused-vars
    postGenericSolana: async (solanaWeb3) => throwErrorMessage("notApplicable"),

    // eslint-disable-next-line no-unused-vars
    postGenericAVAX: async (avax) => throwErrorMessage("notApplicable"),


    // eslint-disable-next-line no-unused-vars
    postGenericTron: async (tronWeb3) => throwErrorMessage("notApplicable"),

    // eslint-disable-next-line no-unused-vars
    postGenericNear: async (nearWeb3) => throwErrorMessage("notApplicable"),

    // eslint-disable-next-line no-unused-vars
    postGenericAlgorand: async (algorandWeb3) => throwErrorMessage("notApplicable"),

    // eslint-disable-next-line no-unused-vars
    postGenericSui: async(web3) => throwErrorMessage("notApplicalble"),

    // eslint-disable-next-line no-unused-vars
    postGenericAptos: async (aptosweb3) => throwErrorMessage("notApplicable"),

};