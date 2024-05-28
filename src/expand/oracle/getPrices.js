/* eslint-disable no-await-in-loop */
/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a price response
    {
        roundId: ''
        answer: ''
        startedAt: '' 
        updatedAt: '' 
        answeredInRound: ''    
    }
    */

const GetPrice = require('./getPrice');

const { initialiseWeb3 } = require('../../../common/intialiseWeb3');

const schemaValidator = require('../../../common/configuration/schemaValidator');

const config = require('../../../common/configuration/config.json');

const errorMessage = require('../../../common/configuration/errorMessage.json');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});

module.exports = {

    getPriceOracle: async (options) => {

        /*
         * Function will fetch the price from All the Oracles
         */

        // Keeping the function same because asset is the only required field in here
        const filterOptions = options;
        filterOptions.function = "getPriceChainLink()";

        const validJson = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return (validJson);
        }

        // Getting all the oracleIds for traversing
        const response = {};
        const oracles = Object.keys(config.oracle);
        filterOptions.asset = filterOptions.asset.toUpperCase();

        // Creating a thread for less time execution and each function
        const threads = [];
        for (const oracel of oracles) {
            threads.push(
                GetPrice[`getPrice${config.oracle[oracel].oracleName}`](await initialiseWeb3({ chainId: config.oracle[oracel].chainId })
                , { ...filterOptions, oracleId: oracel })
                
            );
        };

        const priceData = await Promise.allSettled(threads);
        let [averagePrice , length] = [0 , 0];
      
        // Looping through the settled responses and only showing data that has answet in it
        priceData.forEach((result, index) => {
            if (result.value.code === undefined) {
                const {oracleName} = config.oracle[oracles[index]];
                response[oracleName] = result.value;
                averagePrice += Number(result.value.answer);
                length+= 1;
            }
        });

        response.averagePrice = (averagePrice / length).toFixed(5);

        if(priceData.every(obj => Object.values(obj).some(val => val !== undefined && val.code === 400)) === true) {
            return throwErrorMessage("invalidTokenOrTimestamp");
        }

        return response;

    }

};
