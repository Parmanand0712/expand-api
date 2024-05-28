/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a erc721 isApprovedForAll response
    {
      Approved: true
    }
*/

const erc721ContractAbi = require('../../../assets/abis/erc721.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');

module.exports = {

    isApprovedForAllEvm: async(web3, options) => {
        /*
            * Function will return the if entered address is approved for all transactions
        */

        const filterOptions = options;
        filterOptions.function = "isApprovedForAll()";
        const validJson = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return (validJson);
        }

        const erc721Contract = new web3.eth.Contract(erc721ContractAbi, filterOptions.contractAddress);
        const erc721Approved = await erc721Contract.methods.isApprovedForAll(filterOptions.ownerAddress, filterOptions.operatorAddress).call();

        return ({ 'Approved': erc721Approved });
    },
};
