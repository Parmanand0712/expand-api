/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a erc20 gettokendetails response
    {
      symbol: Varun
    }
*/

const nearApi = require('near-api-js');
const erc20ContractAbi = require('../../../assets/abis/iERC20.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const { isErc20Contract, isSmartContract } = require('../../../common/contractCommon');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const config = require('../../../common/configuration/config.json');

const throwErrorMessage = (msg) => ({
  'message': errorMessage.error.message[msg],
  'code': errorMessage.error.code.invalidInput
});

module.exports = {

  getTokenDetailsEvm: async (evmWeb3, options) => {
    /*
        * Function will get the metadata of ft in evm chains
    */
    const filterOptions = options;
    filterOptions.function = "getTokenDetailsEvm()";
    const validJson = await schemaValidator.validateInput(options);

    if (!validJson.valid) {
      return (validJson);
    }

    const { tokenAddress } = filterOptions;
    const [isErc20token, isContract] = await Promise.all([
      isErc20Contract(evmWeb3, tokenAddress),
      isSmartContract(evmWeb3, tokenAddress),
    ]);

    if (!isErc20token || !isContract) return throwErrorMessage("invalidErc20Contract");

    const erc20Contract = new evmWeb3.eth.Contract(erc20ContractAbi, tokenAddress);
    const [erc20TokenDecimals, erc20TokenName, erc20TokenSymbol] = await Promise.all([
      erc20Contract.methods.decimals().call(),
      erc20Contract.methods.name().call(),
      erc20Contract.methods.symbol().call(),
    ]);

    return ({ 'symbol': erc20TokenSymbol, 'name': erc20TokenName, 'decimals': erc20TokenDecimals });

  },

  getTokenDetailsNear: async (nearWeb3, options) => {
    /*
        * Function will get the metadata of ft in near chain
    */
    const filterOptions = options;
    filterOptions.function = "getTokenDetailsEvm()";
    const validJson = await schemaValidator.validateInput(options);

    if (!validJson.valid) {
      return (validJson);
    }
    const { chainId, tokenAddress } = filterOptions;
    const account = await nearWeb3.account(config.chains[chainId].defaultAccount);
    try {
      const contract = new nearApi.Contract(account, tokenAddress, {
        viewMethods: ["ft_metadata"],
      });
      const { name, symbol, decimals } = await contract.ft_metadata();
      return { name, symbol, decimals: decimals.toString() };
    } catch (err) {
      return throwErrorMessage("invalidToken");
    }
  }
};
