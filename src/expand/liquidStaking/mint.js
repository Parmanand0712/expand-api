const config = require("../../../common/configuration/config.json");
const schemaValidator = require('../../../common/configuration/schemaValidator');
const { getGasPrice } = require('../chain/index');

const opusPoolABI = require("../../../assets/abis/chorusOnePool.json");

const { isValidContractAddress } = require('../../../common/contractCommon');
const errorMessage = require('../../../common/configuration/errorMessage.json');

const throwErrorMessage = (msg) => ({
  'message': errorMessage.error.message[msg],
  'code': errorMessage.error.code.invalidInput
});

module.exports = {
  mintLido: async () => throwErrorMessage("notApplicable"),

  mintChorusOne: async (web3, options) => {
    /*
    * Function will mint liquid staking tokens (osETH)
    */

    const filterOptions = options;
    filterOptions.function = "mintChorusOne()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
      return (validJson);
    }

    const { liquidStakingId, from, amount, gas, gasPriority } = filterOptions;

    const isValidUser = await isValidContractAddress(web3, from);
    if (!isValidUser) return throwErrorMessage("invalidAddress");

    const { opusPool } = config.liquidStaking[liquidStakingId];
    const { referrer } = config;
    const opusPoolContract = new web3.eth.Contract(opusPoolABI, opusPool);

    const data = await opusPoolContract.methods.mintOsToken(from, amount, referrer).encodeABI();

    const txPayload = {
        chainId: config.liquidStaking[liquidStakingId].chainId,
        from,
        to: opusPool,
        value: '0',
        gas,
        data
    };

    if (gasPriority) {
        txPayload.gasPrice = await getGasPrice(web3, { gasPriority }).then(res => res.gasPrice);
    };

    return txPayload;
  }
};