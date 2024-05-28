/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a getOrder response
    {
        data: {}
    }
    
 */

const { default: axios } = require('axios');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const config = require('../../../common/configuration/config.json');

module.exports = {

    getOrderDYDXV4: async (web3, options) => {
        /*
         * Function will fetch the order details from dydx v4
         */

        const filterOptions = options;
        filterOptions.function = "getOrderDYDX()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const { orderId, derivativeId } = filterOptions;

        const apiConfig = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${config.derivative[derivativeId].baseUrl}orders/${orderId}`,
            headers: {}
        };

        try {
            const order = await axios.request(apiConfig);
            return order.data;
        } catch (error) {
            return {
                'message': errorMessage.error.message.invalidOrderId,
                'code': errorMessage.error.code.invalidInput
            };
        }
    }
};