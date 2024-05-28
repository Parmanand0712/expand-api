/* 
 * All the function in this file
 * should be returning the following schema
 * 
    {
        "estimatedGas": "21000"
    }    
 */


const errorMessage = require('../../../common/configuration/errorMessage.json');
const { isValidContractAddress } = require('../../../common/contractCommon');
const schemaValidator = require('../../../common/configuration/schemaValidator');

const throwErrorMessage = (msg) => ({
  'message': msg,
  'code': errorMessage.error.code.invalidInput
});

module.exports = {
  estimateGasEvm: async (evmWeb3, options) => {
    /*
     * Function will estimate the gas limit for given transaction payload
     */
    const filterOptions = options;
    filterOptions.function = "estimateGas()";
    const validJson = await schemaValidator.validateInput(options);

    if ( !validJson.valid ) {
        return (validJson);
    }

    let gasPrice;
    const { from, to, data, value } = filterOptions;

    const [isValidFrom, isValidTo] = await Promise.all([isValidContractAddress(evmWeb3, from), isValidContractAddress(evmWeb3, to)]);
    if (!isValidFrom || !isValidTo) return throwErrorMessage(errorMessage.error.message.invalidAddress);

    try {
      gasPrice = await evmWeb3.eth.estimateGas({ from, to, value, data });
      return { estimatedGas: gasPrice.toString() };
    } catch (err) {
      return throwErrorMessage(err?.message || errorMessage.error.message.executionReverted);
    }
  },

  estimateGasSolana: async () => throwErrorMessage("notApplicable"),
  estimateGasNear: async () => throwErrorMessage("notApplicable"),
  estimateGasTron: async () => throwErrorMessage("notApplicable"),
  estimateGasSui: async () => throwErrorMessage("notApplicable"),
  estimateGasAptos: async () => throwErrorMessage("notApplicable"),
  estimateGasAlgorand: async () => throwErrorMessage("notApplicable"),
  estimateGasStarkNet: async () => throwErrorMessage("notApplicable"),
  estimateGasAvax: async () => throwErrorMessage("notApplicable"),
  estimateGasTon: async () => throwErrorMessage("notApplicable"),
  estimateGasStellar: async () => throwErrorMessage("notApplicable"),
};