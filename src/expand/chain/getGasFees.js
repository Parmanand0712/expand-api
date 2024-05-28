
/*
 * All the function in this file
 * should be returning the following schema
 *

    {
        "totalGasUsed":"1231321331",
        "totalCurrentPrice":"1231313",
        "totalAdjustedPrice":"213313",
        "transactionList":{
            {
            "tx-hash-1": "gasUsedInWei",
            "tx-hash-2": "gasUsedInWei"
        }
    }
*/

const axios = require("axios");
const config = require("../../../common/configuration/config.json");

const errorMessage = require('../../../common/configuration/errorMessage.json');

const invalidWalletAddress = {
    'message': errorMessage.error.message.invalidWalletAddress,
    'code': errorMessage.error.code.invalidInput
};

const invalidEOAAddress = {
    'message': errorMessage.error.message.invalidEOAAddress,
    'code': errorMessage.error.code.invalidInput 
};

const { getPrice } = require('../oracle');

module.exports = {

    getGasFeesEvm: async (web3, options) => {

        let totalFees = 0;
        const response = {};
        const configuration = {};
        const transactionList = {};
        let ethCurrentPrice;
        const filterOptions = options;

        if (!filterOptions.startBlock && !filterOptions.endBlock) {
            const currentBlock = await web3.eth.getBlockNumber();
            filterOptions.endBlock = currentBlock;
            filterOptions.startBlock = (currentBlock - '100').toString();
        } else if (!filterOptions.startBlock && filterOptions.endBlock) {
            filterOptions.startBlock = (filterOptions.endBlock - '100').toString();
        }

        configuration.params = {
            module: config.etherscan.tokenModule,
            action: config.etherscan.action,
            address: filterOptions.address,
            startblock: filterOptions.startBlock,
            endblock: filterOptions.endBlock,
            apiKey: config.etherscan.apiKey
        };

        if (await web3.utils.isAddress(filterOptions.address) === false) return (invalidWalletAddress);
        if(await web3.eth.getCode(filterOptions.address) !== '0x') return (invalidEOAAddress);

        const txListResponse = await axios.get(config.etherscan.baseUrl[filterOptions.chainId], configuration);
        const apiUrlList = txListResponse.data.result
            .map(async tx => {
                const blockData = await web3.eth.getBlock(tx.blockNumber);
                const { timestamp } = blockData;
                const date = new Date(timestamp * 1000);
                const formattedDate = `${date.getDate().toString().padStart(2, '0')}` +
                    `-${(date.getMonth() + 1).toString().padStart(2, '0')}` +
                    `-${date.getFullYear().toString()}`;
                return `${config.coingecko.tokenHistoryUrl}${formattedDate}`;
            });
        
        txListResponse.data.result.map(async tx => {
            transactionList[tx.hash] = tx.gasUsed * tx.gasPrice;
        });

        totalFees = txListResponse.data.result
            .filter(tx => tx.from.toLowerCase() === (filterOptions.address).toLowerCase())
            .reduce((sum, tx) => sum + parseFloat(tx.gasPrice) * parseFloat(tx.gasUsed) , 
            txListResponse.data.result.length !== 0
             ? (txListResponse.data.result[0].gasPrice * txListResponse.data.result[0].gasUsed) : 0);

        if(txListResponse.data.result.length !== 0 ) {
            totalFees -= (txListResponse.data.result[0].gasPrice * txListResponse.data.result[0].gasUsed);
        }

        const priceInUSD = await getPrice(web3, { asset: 'ETH' });

        async function getEthPrice(apiList) {

            try {
                const ethPrice = await Promise.all(apiList.map(async apiUrl => {
                    const res = await axios.get(await apiUrl);
                    return res.data.market_data.current_price.usd;
                }));
                return ethPrice;
            }
            catch (error) {
                return ('');
            }

        }

        try {
            [ethCurrentPrice] = await Promise.all([
                getEthPrice(apiUrlList)
            ]);


            let ethAverage = ethCurrentPrice.reduce((sum, price) => sum + price, 0) / ethCurrentPrice.length;
            if (Number.isNaN(ethAverage)) ethAverage = 0;

            response.totalFeesSpent = totalFees.toString();
            response.totalCurrentPrice = (Math.round((totalFees / 1e18) * (priceInUSD.answer * 100))).toString();
            response.totalAdjustedPrice = (Math.round((totalFees / 1e18) * (ethAverage * 100))).toString();
            response.transactionList = transactionList;

            return (response);

        }
        catch (error) {
            response.totalFeesSpent = totalFees.toString();
            response.totalCurrentPrice = (Math.round((totalFees / 1e18) * (priceInUSD.answer * 100))).toString();
            response.totalAdjustedPrice = '0';
            response.transactionList = transactionList;

            return (response);
        }
    }
};
