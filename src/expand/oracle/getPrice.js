/* eslint-disable no-param-reassign */
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

const { PublicKey } = require('@solana/web3.js');

const { BigNumber } = require('bignumber.js');

const { default: axios } = require('axios');

const { parseBaseData, parseProductData, parsePriceData } = require('./pythHelper');

const chainLinkOracleAbis = require('../../../assets/abis/chainLinkOracle.json');

const schemaValidator = require('../../../common/configuration/schemaValidator');

const config = require('../../../common/configuration/config.json');

const errorMessage = require('../../../common/configuration/errorMessage.json');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});

module.exports = {

    getPriceChainLink: async (web3, options) => {

        /*
         * Function will fetch the price from ChainLink Oracle
         */

        const filterOptions = options;
        filterOptions.function = "getPriceChainLink()";

        const validJson = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return (validJson);
        }

        let response = {};
        let timestampedBlock;

        try {

            filterOptions.tokenAddress = await config.oracle[filterOptions.oracleId].tokens[filterOptions.asset.toUpperCase()];

            const token = new web3.eth.Contract(
                chainLinkOracleAbis,
                filterOptions.tokenAddress
            );

            if(filterOptions.timestamp){
               
                
                timestampedBlock = await axios.get(
                    `${config.etherscan.baseUrl[1]}?` +
                    `module=${config.etherscan.moduleBlock}&` +
                    `action=${config.etherscan.actionBlock}&` +
                    `timestamp=${filterOptions.timestamp}&` +
                    `closest=before&` +
                    `apikey=${config.etherscan.apiKey}`
                ).then(res => res.data.result);
                
                if(timestampedBlock.includes('Error!')) return throwErrorMessage("invalidTimestamp");
            }
            else{
                timestampedBlock = await web3.eth.getBlock('latest').then(res => res.number);
            
            }

            const price = await token.methods.latestRoundData().call(timestampedBlock);

        

            response = {
                'priceFeedAddress':filterOptions.tokenAddress,
                'roundId': price[0],
                'answer': (price[1] / 10 ** 8).toString(),
                'startedAt': price[2],
                'updatedAt': price[3],
                'answeredInRound': price[4]
            };

            return (response);
        }
        catch (err) {
            console.log(err);
            return throwErrorMessage("invalidToken");
        }
    },

    getPriceWinkLink: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "getPriceWinkLink()";

        const validJson = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return (validJson);
        }

        let response = {};

        try {

            if(filterOptions.timestamp) return throwErrorMessage("timestampNotSupported");

            const tokenAddress = config.oracle[filterOptions.oracleId].tokens[filterOptions.asset.toUpperCase()];

            web3.setAddress(tokenAddress);

            const token = await web3.contract().at(tokenAddress);
        
            const data = await token.latestRoundData().call();

            response = {
                'priceFeedAddress':tokenAddress,
                'roundId': new BigNumber(data[0]._hex).toString(),
                'answer': (web3.toBigNumber(data[1]._hex).c[0] / 10 ** 6).toString(),
                'startedAt': web3.toBigNumber(data[2]._hex).c[0].toString(),
                'updatedAt': web3.toBigNumber(data[3]._hex).c[0].toString(),
                'answeredInRound': new BigNumber(data[0]._hex).toString()
            };

            return (response);
        }
        catch (err) {
            return throwErrorMessage("invalidToken");
        }

    },

    getPricePyth: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "getPricePyth()";

        const validJson = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return (validJson);
        }

        const { asset, oracleId , timestamp } = filterOptions;


        if(timestamp) {

            let price;

            const { pythPriceFeedAddress, pythPriceFeedEnd, pythTimestampPriceFeed, pythTimestampEnd } = config.oracle[oracleId];

            const priceFeedAddress = await axios.get(`${pythPriceFeedAddress}${asset}${pythPriceFeedEnd}`).then(res => {
                const priceID = res.data.find(obj => obj.attributes.symbol === `Crypto.${asset.toUpperCase()}/USD`)?.id;
                return priceID;
            });

            if (priceFeedAddress === undefined) return throwErrorMessage("invalidToken");

            try {
                price = await axios.get(`${pythTimestampPriceFeed}${timestamp}?ids=${priceFeedAddress}${pythTimestampEnd}`);
            }
            catch (error) {
                return throwErrorMessage("invalidTimestamp");
            }

            return {
                priceFeedAddress,
                roundId: null,
                answer: (price.data.parsed[0].price.price / (10 ** Math.abs(price.data.parsed[0].price.expo))).toString(),
                startedAt: null,
                updatedAt: null,
                answeredInRound: null
            };

        }

        else {

            const priceDataQueue = [];
            const productAccountKeyToProduct = new Map();

            const accountList = await web3.getProgramAccounts(new PublicKey(config.oracle[oracleId].pythProgramAddress));
            const currentSlot = await web3.getSlot('finalized');


            await Promise.all(
                accountList.map(async (singleAccount) => {
                    const base = await parseBaseData(singleAccount.account.data);
                    if (base) {
                        if (base.type === 2) {
                            const productData = await parseProductData(singleAccount.account.data);
                            if ((productData.product.base) === (asset).toUpperCase()) {
                                productAccountKeyToProduct.set(singleAccount.pubkey.toBase58(), productData.product);
                            }
                        } else if (base.type === 3) {
                            const price = await parsePriceData(singleAccount.account.data, currentSlot);
                            if (price.price !== undefined
                                && productAccountKeyToProduct.has(price.productAccountKey.toBase58())) priceDataQueue.push(price);
                        }
                    }
                })
            );

            if (priceDataQueue.length === 0) return throwErrorMessage("invalidToken");


            return {
                priceFeedAddress: priceDataQueue[0].productAccountKey,
                roundId: null,
                answer: (priceDataQueue[0].price).toString(),
                startedAt: null,
                updatedAt: null,
                answeredInRound: null
            };
        }

    }

};