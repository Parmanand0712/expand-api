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

const schemaValidator = require('../../../common/configuration/schemaValidator');

const config = require('../../../common/configuration/config.json');

const { initialiseWeb3 } = require('../../../common/intialiseWeb3');

const GetSupportedTokens = require('./getSupportedToken');



module.exports = {

    getSupportedTokensOracle: async (options) => {

        /*
         * Function will fetch the supportedTokens from All the Oracles
         */

        const filterOptions = options;
        filterOptions.function = "getSupportedTokensOracle()";

        const validJson = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return (validJson);
        }

        // Getting all the oracleIds for traversing
        const response = {};
        const oracles = Object.keys(config.oracle);

        // Creating a thread for less time execution and each function
        const threads = [];
        for (const oracel of oracles) {
            threads.push(
                GetSupportedTokens[`getSupportedTokens${config.oracle[oracel].oracleName}`]
                (await initialiseWeb3({ chainId: config.oracle[oracel].chainId })
                , { ...filterOptions, oracleId: oracel })
                
            );
        };

        const tokensData = await Promise.all(threads);

        // Looping through the settled responses and only showing data that has answet in it
        tokensData.forEach((result, index) => {
          
                const {oracleName} = config.oracle[oracles[index]];
                response[oracleName] = result;
        });


        return response;
    }

};
