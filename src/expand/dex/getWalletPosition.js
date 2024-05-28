/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
/* 
 * All the function in this file
 * should be returning the following schema
 * 
 * 
    {
        "liquidity": "123123231"
    }  
 */
const axios = require('axios');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const config = require('../../../common/configuration/config.json');
const {getPoolWalletAddresses} = require('./poolHelper');
const {isSmartContract} = require('../../../common/contractCommon');

const notApplicable = {
    'message': errorMessage.error.message.invalidPageNumber,
    'code': errorMessage.error.code.notApplicable
};

const invalidEoaAddress = {
    'message': errorMessage.error.message.invalidAddress,
    'code': errorMessage.error.code.invalidInput
};



module.exports = {

    getWalletPosition: async (web3, options) => {

        const filterOptions = options;

        filterOptions.function = "getWalletPosition()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        let {pageToken} = filterOptions;
        const {address} = filterOptions;

            const poolsData = [];
            const filteredObjects = {  UniswapV3: [], UniswapV2: [], SushiSwapV2: [], BalancerV2: [], PancakeV2: [], CurveV2: [] 
                , extraTransactions:[] };

            
            if((await isSmartContract(web3 , address)) === true || (await web3.utils.isAddress(address) === false)) return (invalidEoaAddress);
                poolsData.push(await getPoolWalletAddresses(web3));
                const eventDataForUser = [];

                const { baseUrl, apiKeyDexWalletPosition } = config.covalent;
                const getAxiosConfig = (url) =>
                    axios({
                        "method": 'get',
                        "url": `${baseUrl}${1}/address/${address}/${url}`,
                        "params": { "no-logs": false },
                        "headers": {
                            'Authorization': `Bearer ${apiKeyDexWalletPosition}`
                        }
                    });

                const summery = await getAxiosConfig('transactions_summary/');
                if (!summery.data.data.items) return { "currentPage":"0" , "totalPages":"0" , "transactions":[] };
                const totalPages =  Math.ceil(summery.data.data.items[0].total_count/100);
                if (pageToken === undefined) pageToken = 1;
                if (pageToken > totalPages) return (notApplicable);
                eventDataForUser.push(getAxiosConfig(`transactions_v3/page/${pageToken - 1}/`));

                const response = await Promise.all(eventDataForUser);
                const itemsData = response.map((res) => res.data.data.items);
                const flattenedData = itemsData.reduce((acc, val) => acc.concat(val), []);
                const logData = flattenedData.reduce((acc, val) => acc.concat(val.log_events), []);


                for (let i = 0; i <= logData.length - 1; i += 1) {
                    if (logData[i] !== undefined && logData[i].decoded !== null && logData[i].decoded.params !== null) {
                        const values = logData[i].decoded.params.map(obj => obj.value);
                        const isValuePresent = (poolsData[0].uniswapV3PoolsData.includes((logData[i].sender_address.toLowerCase())) ||
                        poolsData[0].uniswapV3PoolsData.some((element) => values.includes(element)));
                        const isValueV2Present = (poolsData[0].uniswapV2PoolsData.includes((logData[i].sender_address.toLowerCase())) ||
                        poolsData[0].uniswapV2PoolsData.some((element) => values.includes(element)));
                        const isValueSushiPresent = (poolsData[0].sushiswapV2PoolsData.includes((logData[i].sender_address.toLowerCase())) ||
                        poolsData[0].sushiswapV2PoolsData.some((element) => values.includes(element)));
                        const isValueBalancerPresent = (poolsData[0].balancerV2PoolsData.includes((logData[i].sender_address.toLowerCase())) ||
                        poolsData[0].balancerV2PoolsData.some((element) => values.includes(element)));
                        const isValueCurvePresent = (poolsData[0].curveV2PoolsData.includes((logData[i].sender_address.toLowerCase())) ||
                        poolsData[0].curveV2PoolsData.some((element) => values.includes(element)));

                        if (isValuePresent) {
                            delete logData[i].sender_logo_url;
                            filteredObjects.UniswapV3.push(logData[i]);
                        }
                        if (isValueV2Present) {
                            delete logData[i].sender_logo_url;
                            filteredObjects.UniswapV2.push(logData[i]);
                        }
                        if (isValueSushiPresent) {
                            delete logData[i].sender_logo_url;
                            filteredObjects.SushiSwapV2.push(logData[i]);
                        }
                        if (isValueBalancerPresent) {
                            delete logData[i].sender_logo_url;
                            filteredObjects.BalancerV2.push(logData[i]);
                        }
                        if (isValueCurvePresent) {
                            delete logData[i].sender_logo_url;
                            filteredObjects.CurveV2.push(logData[i]);
                        }
                        else{
                            delete logData[i].sender_logo_url;
                            filteredObjects.extraTransactions.push(logData[i]);
                        }
                       
                    }
                    else if(logData[i] !== undefined && logData[i].decoded === null){
                        delete logData[i].sender_logo_url;
                        filteredObjects.extraTransactions.push(logData[i]);
                    }
                }

            return { currentPage: pageToken , totalPages: totalPages.toString(), transactions:filteredObjects };

        },
    
};