/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a price response
   [
    {
        swapInfo: {

        },
        percent: Number

    }
    .....
   ]
 */

const { default: axios } = require('axios');
const { web3 } = require("@project-serum/anchor");
const schemaValidator = require('../../../common/configuration/schemaValidator');
const errorMessage = require('../../../common/configuration/errorMessage.json');

const config = require('../../../common/configuration/config.json');

require("dotenv").config({ path: '../../../.env' });

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});

module.exports = {

    getRouteJupiter: async (_, options) => {
        /*
         * Function will fetch the route for a swap quotation from Jupiter
         */

        const filterOptions = options;
        filterOptions.function = "getPriceJUP()";
        const validJson = await schemaValidator.validateInput(filterOptions);
        const { dexId, path, amountIn } = filterOptions;
        const slippage =  1;


        if (!validJson.valid) {
            return validJson;
        }

        try {
            const inputMint = new web3.PublicKey(path[0]);
            const outputMint = new web3.PublicKey(path[1]);
            if (path[0] === path[1]) {
                return throwErrorMessage("sameTokenSwap");
              }
         } catch (error) {
             return throwErrorMessage("invalidSPLToken");
         }

        let response;
        const axiosConfig = {
            method: "get",
            url: `${config.dex[dexId].jupEndpoint}quote?inputMint=${path[0]
                }&outputMint=${path[1]}&amount=${amountIn}&slippageBps=${slippage}`,
        };
        try {
            response = await axios(axiosConfig);
            routePlan = response.data.routePlan;
        } catch (error) {
            return {
                message: error.response.data.error,
                code: error.response.status
            };
        }
        return routePlan;
    },
};
