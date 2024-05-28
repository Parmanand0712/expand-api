const config = require("../../../common/configuration/config.json");
const schemaValidator = require('../../../common/configuration/schemaValidator');

const wstETHABI = require("../../../assets/abis/wstETHABI.json");
const bnbxABI = require("../../../assets/abis/bnbx.json");
const { isValidContractAddress } = require('../../../common/contractCommon');
const errorMessage = require('../../../common/configuration/errorMessage.json');


const throwErrorMessage = (msg) => ({
  'message': errorMessage.error.message[msg],
  'code': errorMessage.error.code.invalidInput
});


module.exports = {

  getAllowanceLido: async (web3, options) => {
    /*
    * Function will get the allowance of  st[token]
    */

    const filterOptions = options;
    filterOptions.function = "getAllowance()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
      return (validJson);
    }

    const { liquidStakingId, owner, tokenAddress, spender } = filterOptions;
    
    // Checking if the token is a known st[token]
    if (!(config.liquidStaking[liquidStakingId].stTokens.includes(tokenAddress)))
    return throwErrorMessage("inValidstToken");

    if (!(await isValidContractAddress(web3, owner) && await isValidContractAddress(web3, spender)))
      return throwErrorMessage("invalidAddress");

    const lidoContract = new web3.eth.Contract(wstETHABI, tokenAddress);
    const data = await lidoContract.methods.allowance(owner, spender).call();

    return ({ 'allowance': data });
  },
  getAllowanceBNBStader: async (web3, options) => {
    /*
    * Function will get the allowance of  st[token]
    */

    const filterOptions = options;
    filterOptions.function = "getAllowance()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
      return (validJson);
    }

    const { liquidStakingId, owner, tokenAddress, spender } = filterOptions;
    
    // Checking if the token is BNBx
    if (!(config.liquidStaking[liquidStakingId].stTokens ===(tokenAddress)))
    return throwErrorMessage("inValidstToken");

    if (!(await isValidContractAddress(web3, owner) && await isValidContractAddress(web3, spender)))
      return throwErrorMessage("invalidAddress");

    const bnbXContract = new web3.eth.Contract(bnbxABI, tokenAddress);
    const data = await bnbXContract.methods.allowance(owner, spender).call();

    return ({ 'allowance': data });
  }
};