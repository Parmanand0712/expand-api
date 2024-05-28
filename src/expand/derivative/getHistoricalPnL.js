/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a getHistoricalPnL response
    {
        fills: []
    }
    
 */

const schemaValidator = require('../../../common/configuration/schemaValidator');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const {indexerClientGoerli} = require('../../../common/dydxV4Common');
const { getSubAccountsDYDXV4 } = require('./getSubAccounts');

module.exports = {

    getHistoricalPnLDYDXV4: async (web3, options) => {
        /*
         * Function will fetch the historical PnL from dydx v4
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
            const response = await indexerClientGoerli.account.getSubaccountHistoricalPNLs(address, subAccountNumber);
            return { "historicalPnL": response.historicalPnl };
        } catch (error) {
            return {
                'message': error.data.errors[0].msg,
                'code': errorMessage.error.code.invalidInput
            };
        }
    }
};