/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a erc721 getApproved response
    {
      Approved: '0x0000000000000000000000000000000000000000'
    }
*/

const erc721ContractAbi = require('../../../assets/abis/erc721.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');

module.exports = {

    getApprovedEvm: async(web3, options) => {
        /*
            * Function will return the address of the approved account against the tokenId.
        */

        const filterOptions = options;
        filterOptions.function = "getApproved()";
        const validJson = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return (validJson);
        }

        const erc721Contract = new web3.eth.Contract(erc721ContractAbi, filterOptions.contractAddress);
        const erc721Approved = await erc721Contract.methods.getApproved(filterOptions.tokenId).call();

        return ({ 'Approved': erc721Approved });
    },
};
