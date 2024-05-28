/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a erc721 ownerOf response
    {
        owner: '0x8e7D7a97b4aa8B6D857968058A03cd25707Ed025' 
    }
*/

const erc721ContractAbi = require('../../../assets/abis/erc721.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');

module.exports = {

    ownerOfEvm: async (evmWeb3, options) => {
        /*
            * Function will return the owner
        */

        const filterOptions = options;
        filterOptions.function = "ownerOf()";
        const validJson = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return (validJson);
        }

        const erc721Contract = new evmWeb3.eth.Contract(erc721ContractAbi, filterOptions.contractAddress);
        const erc721Owner = await erc721Contract.methods.ownerOf(filterOptions.tokenId).call();

        return ({ 'owner': erc721Owner });
    },
};
