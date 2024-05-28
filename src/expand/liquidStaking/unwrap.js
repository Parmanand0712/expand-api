const config = require("../../../common/configuration/config.json");
const schemaValidator = require('../../../common/configuration/schemaValidator');
const { getGasPrice } = require('../chain/index');

const wstETHABI =  require("../../../assets/abis/wstETHABI.json");

const { isValidContractAddress } = require('../../../common/contractCommon');
const errorMessage = require('../../../common/configuration/errorMessage.json');


const throwErrorMessage = (msg) => ({
  'message': errorMessage.error.message[msg],
  'code': errorMessage.error.code.invalidInput
});

module.exports = {
    
    unwrapLido: async (web3, options) => {
        /*
        * Function will stake eth on Lido
        */

        const filterOptions = options;
        filterOptions.function = "lidoWrap()";
        const validJson = await schemaValidator.validateInput(filterOptions);
    
        if (!validJson.valid) {
          return (validJson);
        }

        const { from, gas, liquidStakingId, amount } = filterOptions;

        if (! await isValidContractAddress(web3, from)) return throwErrorMessage("invalidAddress");

        const contractAddress = config.liquidStaking[liquidStakingId].wstETHAddress;
        const lidoContract = new web3.eth.Contract(wstETHABI, contractAddress);
        const data = lidoContract.methods.unwrap(amount).encodeABI();

        const unwrapTx = {
            chainId: config.liquidStaking[liquidStakingId].chainId,
            from,
            to:  contractAddress,
            data,
            value: "0",
            gas
        };

        if (filterOptions.gasPriority !== undefined) {
            unwrapTx.gasPrice = await getGasPrice(web3, {
                gasPriority: filterOptions.gasPriority
            }).then(res => res.gasPrice);
        };

        return unwrapTx;
    }
};