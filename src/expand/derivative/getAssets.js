/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a getAssets response
    {
        assets: []
    }
 */

const schemaValidator = require('../../../common/configuration/schemaValidator');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const {indexerClientGoerli} = require('../../../common/dydxV4Common');
const { getSubAccountsDYDXV4 } = require('./getSubAccounts');

module.exports = {

    getAssetsDYDXV4: async (web3, options) => {
        /*
         * Function will fetch the assets from dydx v4
         */

        const filterOptions = options;
        filterOptions.function = "getOrdersDYDX()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const { address, subAccountNumber } = filterOptions;

        const isInvalidAddress = await getSubAccountsDYDXV4(web3, {address});
        if (isInvalidAddress.code === 400) return isInvalidAddress;

        try {
            const response = await indexerClientGoerli.account.getSubaccountAssetPositions(address, subAccountNumber);
            return { "assets": response.positions };
        } catch (error) {
            return {
                'message': error.data.error,
                'code': errorMessage.error.code.invalidInput
            };
        }
    }
};