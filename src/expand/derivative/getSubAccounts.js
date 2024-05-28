/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a getSubAccounts response
    {
        subAccounts: []
    }
 */

const schemaValidator = require('../../../common/configuration/schemaValidator');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const { indexerClientGoerli } = require('../../../common/dydxV4Common');

module.exports = {

    getSubAccountsDYDXV4: async (web3, options) => {
        /*
         * Function will fetch the all the subaccounts of a user from dydx v4
         */

        const filterOptions = options;
        filterOptions.function = "getSubAccountsDYDX()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const { address } = filterOptions;
        try {
            const response = await indexerClientGoerli.account.getSubaccounts(address);
            return { "subaccounts": response.subaccounts };
        } catch (error) {
            return {
                'message': errorMessage.error.message.invalidUserAddress,
                'code': errorMessage.error.code.invalidInput
            };
        }
    }
};
