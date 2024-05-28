/* 
 * All the function in this file
 * should be returning the following schema
 * 
 
    {
        "gasPrice": "21000"
    }    
 */

require('dotenv').config();
const axios = require('axios');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const config = require('../../../common/configuration/config.json');
const tokenConfig = require('../../../common/configuration/portfolioTokenConfig.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const erc20Abi = require('../../../assets/abis/iERC20.json');

const invalidAsset = {
    'message': errorMessage.error.message.invalidToken,
    'code': errorMessage.error.code.invalidInput
};

const tooManyRequests = {
    'message': errorMessage.error.message.tooManyRequests,
    'code': errorMessage.error.code.invalidInput
};

module.exports = {


    getTokenMarketDataEvm: async (evmWeb3, options) => {
        /*
         * Function will fetch token market details for ethereum chain using multiple sources
         */

        const filterOptions = options;
        filterOptions.function = "getTokenMarketDataEvm()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const response = {};
        const { asset } = filterOptions;

        const tokenData = tokenConfig[1].find(obj => obj.symbol === (asset).toUpperCase());

        if(tokenData === undefined || tokenData.id === 'NA' || tokenData.coinloreId === 'NA') return invalidAsset;

        const { address , coinloreId } = tokenData;

        const uuid = await axios({
            method: 'get',
            url: `${config.tokenMarketData.coinrankingurl}s`,
            headers: {
                'x-access-token': process.env.COINRANKINGTOKEN,
            },
            params: { 'contractAddresses[]': address }
        });

        if(uuid.data.status === 'fail') return tooManyRequests;

        const lastYear = new Date();
        lastYear.setFullYear(lastYear.getFullYear() - 1);

        // Format the date as "dd-mm-yyyy"
        const formattedDate =
            `${lastYear.getFullYear()}-${(`0${lastYear.getMonth() + 1}`).slice(-2)
            }-${(`0${lastYear.getDate()}`).slice(-2)}`;

        const fetchData = async (configuration) => {

            try{
                const res = await axios(configuration);
                return res.data;
            }
            catch(err){
                return tooManyRequests;
                
            }
        };

        // Array of API configurations
        const apiConfigs = [
            {
                method: 'get',
                url: config.coinMarketCap.circulatingSupply,
                headers: {
                    'X-CMC_PRO_API_KEY': process.env.CMC_KEY,
                },
                params: { symbol: asset },
            },
            {
                method: 'get',
                url: config.tokenMarketData.coinlorebase,
                params: { id: coinloreId },
            },
            {
                method: 'get',
                url: `${config.tokenMarketData.ethpolrer}${address}?apiKey=freekey`,
            },
            {
                method: 'get',
                url: `${config.tokenMarketData.coinrankingurl}/${uuid.data.data.coins[0].uuid}`,
                headers: {
                    'x-access-token': process.env.COINRANKINGTOKEN,
                },
            },
            {
                method: 'post',
                maxBodyLength: Infinity,
                url: config.bitquery.baseQuery,
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': process.env.BITQUERY_API_KEY,
                    'Authorization': process.env.BITQUERY_BEARER,
                },
                data: {
                    "query": config.bitquery.burn,
                    "variables": JSON.stringify({ token: address }),
                },
            },
            {
                method: 'post',
                maxBodyLength: Infinity,
                url: config.bitquery.baseQuery,
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': process.env.BITQUERY_API_KEY,
                    'Authorization': process.env.BITQUERY_BEARER,
                },
                data: {
                    "query": config.bitquery.fiscalLow,
                    "variables": JSON.stringify({ tokenAddress: address, date: `${formattedDate}T00:00:00Z` })
                },
            },
        ];

        // Perform parallel API requests
        const fetchDataArray = async () => {
            try {
                const responseData = await Promise.all(apiConfigs.map(fetchData));
                return responseData;
            } catch (error) {
                throw JSON.stringify(tooManyRequests);
            }
        };
        
        const [
            cmcData,
            coinLoreData,
            ethplorerData,
            coinRankingData,
            burnAmount,
            fiscalLow
        ] = await fetchDataArray();

        const contract = new evmWeb3.eth.Contract(erc20Abi, address);
        const [deltaA, deltaB] = [((cmcData.data[(asset).toUpperCase()].circulating_supply) - (ethplorerData.price.availableSupply))
            , ((cmcData.data[(asset).toUpperCase()].circulating_supply) - (coinRankingData.data.coin.supply.circulating))];
        const circulatinSupply = (Math.round((Math.max(((cmcData.data[(asset).toUpperCase()].circulating_supply),
            (ethplorerData.price.availableSupply),
            (coinRankingData.data.coin.supply.circulating).toString()))  + ((deltaA + deltaB) / 2)).toFixed(0).toString()));
        response.tokenSymbol = asset;
        response.tokenAddress = address;
        response.circulatingSupply = circulatinSupply.toString();
        response.circulatingMarketCap = Math.round(circulatinSupply * cmcData.data[asset.toUpperCase()].quote.USD.price).toString();
        response.burntSupply = (burnAmount.data !== undefined) 
        ? (burnAmount.data.initialSupply.burn === null || burnAmount.data.initialSupply.burn[0].amount === 0) ? 'NA'
            : Number(burnAmount.data.initialSupply.burn[0].amount).toFixed(0).toString() :
            'NA';
        response.totalSupply = Math.round(await contract.methods.totalSupply().call() / (10 ** await contract.methods.decimals().call())).toString();
        response.supplyFuture = (coinLoreData[0].msupply !== undefined ) ? ((coinLoreData[0].msupply - response.circulatingSupply > 0) 
        ? (coinLoreData[0].msupply - response.circulatingSupply).toString() : 'NA') :
        'Infinite';
        response.allTimeHigh = (coinRankingData.data.coin.allTimeHigh.price).toString();
        response.fiscalLow = (fiscalLow.data.ethereum.dexTrades === null 
            || fiscalLow.data.ethereum.dexTrades.length === 0) ? 'NA' : fiscalLow.data.ethereum.dexTrades[0].priceInUsd;

        return (response);
    },
};
