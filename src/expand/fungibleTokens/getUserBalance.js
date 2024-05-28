/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a erc20 getBalance response
    {
      balance: 3279327
    }
*/

const erc20ContractAbi = require('../../../assets/abis/iERC20.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const { isErc20Contract, isValidContractAddress } = require('../../../common/contractCommon');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
  });

  
module.exports = {

    getUserBalanceEvm: async (evmWeb3, options) => {
        /*
            * Function will get balance of erc20
        */
        const filterOptions = options;
        filterOptions.function = "getUserBalance()";
        const validJson = await schemaValidator.validateInput(options);

        let erc20TokenBalance;
        if (!validJson.valid) {
            return (validJson);
        }

        const {tokenAddress, address} = filterOptions;
        const [isErc20token, isValidAddress] = await Promise.all([
            isErc20Contract(evmWeb3, tokenAddress),
            isValidContractAddress(evmWeb3, address)
          ]);
      
          if (tokenAddress && !isErc20token) return throwErrorMessage("invalidErc20Contract");
          if (!isValidAddress) return throwErrorMessage("invalidAddress");

        try{
            const erc20Contract = new evmWeb3.eth.Contract(erc20ContractAbi, tokenAddress);
            erc20TokenBalance = await erc20Contract.methods.balanceOf(address).call();
        } catch (error){
            return error;
        }

        return ({ 'balance': erc20TokenBalance });
    },
};
