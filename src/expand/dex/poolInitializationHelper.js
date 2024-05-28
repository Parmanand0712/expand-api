/* eslint-disable no-await-in-loop */
const axios = require('axios');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const config = require('../../../common/configuration/config.json');
const { getDecimalsEvm } = require('../fungibleTokens/getDecimals');
const { getSymbolEvm } = require('../fungibleTokens/getSymbol');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});


module.exports = {

    getHistoricalTimeSeriesPoolInitialization: async (web3, options) => {

        const configuration = {};
        const { moduleGeneric, actionContract, apiKey , bscKey } = config.etherscan;
        let { startBlock, endBlock } = options;
        const {poolLiquidityContract} = options;
        const step = Number(config.ellipticSteps.stepV2Like);

        try {

            const latestBlock = await web3.eth.getBlockNumber();
            configuration.params = {
                module: moduleGeneric,
                action: actionContract,
                contractaddresses: options.poolAddress,
                apiKey: (options.dexId !== '1200') ? apiKey : bscKey
            };


            const initialTxHash = await axios.get(config.etherscan.baseUrl[config.dex[options.dexId].chainId], configuration)
                .then(res => (res.data.result[0].txHash));
            const initalBlockNumber = await web3.eth.getTransaction(initialTxHash).then(res => res.blockNumber);
            if (startBlock === undefined && endBlock === undefined) { endBlock = latestBlock; startBlock = latestBlock - 10000; }
            if (startBlock === undefined) startBlock = Number(endBlock) - 10000;
            if (endBlock === undefined) endBlock = Number(startBlock) + 10000;
            if(endBlock > latestBlock) endBlock = latestBlock.toString();
            if ((Number(startBlock) >= Number(endBlock)) || ((Number(startBlock) < Number(initalBlockNumber)))
                || Number(endBlock) - Number(startBlock) > 50000) return throwErrorMessage("invalidInput");
            const [token0, token1] = await Promise.all([poolLiquidityContract.methods.token0().call(),
            poolLiquidityContract.methods.token1().call()]);
            const [token0Symbol, token1Symbol] = await Promise.all([getSymbolEvm(web3, { tokenAddress: token0 }).then(res => res.symbol)
                , await getSymbolEvm(web3, { tokenAddress: token1 }).then(res => res.symbol)]);
            const [decimals, decimalsforToken1] = await Promise.all([getDecimalsEvm(web3, { tokenAddress: token0 }).then(res => res.decimals),
            getDecimalsEvm(web3, { tokenAddress: token1 }).then(res => res.decimals)]);
            return {step , token0Symbol, token1Symbol, decimals, decimalsforToken1 
            , startBlock , endBlock};
        }
        catch(err){
            return err;
        }
    },
    getHistoricalTransactionsPoolInitialization: async (web3, options) => {

        const configuration = {};
        const { moduleGeneric, apiKey , bscKey, actionContract } = config.etherscan;
        let { startBlock, endBlock } = options;
        const {poolLiquidityContract} = options;
        const step = Number(config.ellipticSteps.stepV2Like);

        try {

            const latestBlock = await web3.eth.getBlockNumber();
            configuration.params = {
                module: moduleGeneric,
                action: actionContract,
                contractaddresses: options.poolAddress,
                apiKey: (options.dexId !== '1200') ? apiKey : bscKey
            };


            const initialTxHash = await axios.get(config.etherscan.baseUrl[config.dex[options.dexId].chainId], configuration)
                .then(res => (res.data.result[0].txHash));
            const initalBlockNumber = await web3.eth.getTransaction(initialTxHash).then(res => res.blockNumber);
            if (startBlock === undefined && endBlock === undefined) { endBlock = latestBlock; startBlock = latestBlock - 10000; }
            if (startBlock === undefined) startBlock = Number(endBlock) - 10000;
            if (endBlock === undefined) endBlock = Number(startBlock) + 10000;
            if(endBlock > latestBlock) endBlock = latestBlock;
            if ((Number(startBlock) >= Number(endBlock)) || ((Number(startBlock) < Number(initalBlockNumber)))
                || Number(endBlock) - Number(startBlock) > 50000) return throwErrorMessage("invalidInput");
            const [token0, token1] = await Promise.all([poolLiquidityContract.methods.token0().call(),
            poolLiquidityContract.methods.token1().call()]);
            const [token0Symbol, token1Symbol] = await Promise.all([getSymbolEvm(web3, { tokenAddress: token0 }).then(res => res.symbol)
                , await getSymbolEvm(web3, { tokenAddress: token1 }).then(res => res.symbol)]);
            return {step , token0Symbol, token1Symbol, startBlock , endBlock};
        }
        catch(err){
            return err;
        }
    },
    getChartDataPoolInitialization: async (web3, options) => {

        const { startBlock, endBlock } = options;
        const {poolLiquidityContract} = options;
        const step = Number(config.ellipticSteps.stepV2Like);

        try {
            const [token0, token1, latestBlock] = await Promise.all([poolLiquidityContract.methods.token0().call(),
                poolLiquidityContract.methods.token1().call()
                    , web3.eth.getBlockNumber()]);
                const token0Symbol = await getSymbolEvm(web3, { tokenAddress: token0 }).then(res => res.symbol);
                const token1Symbol = await getSymbolEvm(web3, { tokenAddress: token1 }).then(res => res.symbol);
                const decimals = await getDecimalsEvm(web3, { tokenAddress: token0 }).then(res => res.decimals);
                const decimalsforToken1 = await getDecimalsEvm(web3, { tokenAddress: token1 }).then(res => res.decimals);
            return {step , token0Symbol, token1Symbol, startBlock , endBlock , decimals , decimalsforToken1 , latestBlock , token0 , token1};
        }
        catch(err){
            return err;
        }
    },
    getTradePoolInitialization: async (web3, options) => {

        const configuration = {};
        const step = Number(config.ellipticSteps.stepV2Like);
        const { poolAddress , poolLiquidityContract } = options;
        let { startBlock, endBlock } = options;
        const { moduleGeneric, actionContract, apiKey , bscKey } = config.etherscan;

        try{

            configuration.params = {
                module: moduleGeneric,
                action: actionContract,
                contractaddresses: poolAddress,
                apiKey: (options.dexId !== '1200') ? apiKey : bscKey
            };


            const initialTxHash = await axios.get(config.etherscan.baseUrl[config.dex[options.dexId].chainId], configuration)
                .then(res => (res.data.result[0].txHash));
            const initalBlockNumber = await web3.eth.getTransaction(initialTxHash).then(res => res.blockNumber);
            const latestBlock = await web3.eth.getBlockNumber();
            if (startBlock === undefined && endBlock === undefined) { endBlock = latestBlock; startBlock = latestBlock - 10000; }
            if (startBlock === undefined) startBlock = Number(endBlock) - 10000;
            if (endBlock === undefined) endBlock = Number(startBlock) + 10000;
            if(endBlock > latestBlock) endBlock = latestBlock;
            if ((Number(startBlock) >= Number(endBlock)) || ((Number(startBlock) < Number(initalBlockNumber)))
                || Number(endBlock) - Number(startBlock) > 50000) return throwErrorMessage("invalidInput");

            const [token0, token1] = await Promise.all([poolLiquidityContract.methods.token0().call(),
            poolLiquidityContract.methods.token1().call()]);
            const [token0Symbol, token1Symbol] = await Promise.all([getSymbolEvm(web3, { tokenAddress: token0 }).then(res => res.symbol)
                , await getSymbolEvm(web3, { tokenAddress: token1 }).then(res => res.symbol)]);
            return {step , token0Symbol, token1Symbol, startBlock , endBlock , latestBlock , token0 , token1};
        }
        catch(err){
            return err;
        }
    },


};