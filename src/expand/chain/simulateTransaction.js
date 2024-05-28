const { default: axios } = require('axios');
const config = require('../../../common/configuration/config.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const errorMessage = require('../../../common/configuration/errorMessage.json');

const throwErrorMessage = (msg) => ({
  'message': errorMessage.error.message[msg],
  'code': errorMessage.error.code.invalidInput
});

module.exports = {
  simulateTransactionStellar: async (_, options) => {
    /*
     * Function will simulate a transaction on stellar chain
     */

    const filterOptions = options;
    filterOptions.function = "sendTransaction()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
      return (validJson);
    }

    const { chainId, rawTransaction } = filterOptions;
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
          "method": "simulateTransaction",
          "params": {
            "transaction": rawTransaction,
            "resourceConfig": {
              "instructionLeeway": 3000000
            }
          }
        }
      };
      const response = await axios.request(apiConfig);
      const { result } = response.data;
      if (result.error) {
        const { error } = result;
        if (error === "Could not unmarshal transaction") return throwErrorMessage("invalidRawTransaction");
        return {
          'message': error,
          'code': errorMessage.error.code.invalidInput
        };
      }
      return { result };
    } catch (err) {
      return throwErrorMessage("executionReverted");
    }
  },
};
