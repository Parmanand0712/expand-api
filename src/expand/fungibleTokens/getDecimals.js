/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a erc20 getDecimals response
    {
      decimals: 18
    }
*/

const web3 = require('@solana/web3.js');
const token = require('@solana/spl-token');
const erc20ContractAbi = require('../../../assets/abis/iERC20.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');

module.exports = {

    getDecimalsEvm: async (evmWeb3, options) => {
        /*
            * Function will get getDecimalsEvm of erc20
        */

        const filterOptions = options;
        filterOptions.function = "getDecimalsEvm()";
        const validJson = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return (validJson);
        }

        const erc20Contract = new evmWeb3.eth.Contract(erc20ContractAbi, filterOptions.tokenAddress);
        const erc20TokenDecimals = await erc20Contract.methods.decimals().call();

        return ({ 'decimals': erc20TokenDecimals });
    },

    getDecimalsSolana: async (connection, options) => {
        /*
            * Function will get getDecimalsEvm of erc20
        */

        const filterOptions = options;
        filterOptions.function = "getDecimalsSolana()";
        const validJson = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return (validJson);
        }

        const mint = new web3.PublicKey(options.token);
        const mintInfo = await token.getMint(
            connection,
            mint
        );
        return ({ 'decimals': mintInfo.decimals });

    }
};
