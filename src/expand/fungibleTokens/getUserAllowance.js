/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a erc20 getName response
    {
        uint256 :  10000000000000000000000
    }
*/

const erc20ContractAbi = require('../../../assets/abis/iERC20.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');




module.exports = {

    getUserAllowanceEvm: async (evmWeb3, options) => {
        /*
            * Function will get allowanceEVM of erc20
        */

        const filterOptions = options;
        filterOptions.function = "getUserAllowanceEvm()";
        const validJson = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return (validJson);
        }
        const erc20Contract = new evmWeb3.eth.Contract(erc20ContractAbi, filterOptions.tokenAddress);
        const erc20TokenAllowance = await erc20Contract.methods.allowance(filterOptions.owner,filterOptions.spender).call();

        return ({ 'allowance': erc20TokenAllowance });
    },
};
