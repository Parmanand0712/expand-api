/* eslint-disable no-await-in-loop */
const axios = require('axios');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const config = require('../../../common/configuration/config.json');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const uniswapV3Pool = require('../../../assets/abis/uniswapV3Pool.json');
const sushiswapV2PoolAbi = require('../../../assets/abis/sushiswapV2PoolAbi.json');
const pancakeswapV2PoolAbi = require('../../../assets/abis/pancakeswapPoolAbi.json');
const uniswapV2Pool = require('../../../assets/abis/uniswapV2PoolAbi.json');
const { getSymbolEvm } = require('../fungibleTokens/getSymbol');
const {getPoolIndividualLiqudity} = require('./poolHelper');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});

module.exports = {

    getPoolIndividualLiquidityUniswapV2: async (web3, options) => {
        const filterOptions = options;
        filterOptions.function = "getPoolIndividualLiquidity()";
        const validJson = await schemaValidator.validateInput(filterOptions);
        if (!validJson.valid) {
            return (validJson);
        }

        let startBlockNumber;
        const { publicRpc } = config.chains[config.dex[filterOptions.dexId].chainId];

        filterOptions.startPage = Number(filterOptions.startPage);
        filterOptions.endPage = Number(filterOptions.endPage);
        if ((filterOptions.startPage === undefined && filterOptions.endPage === undefined) 
        || (Number.isNaN(filterOptions.startPage) && Number.isNaN(filterOptions.endPage))) {
            filterOptions.startPage = 1;
            filterOptions.endPage = 10;
        }
        if ((filterOptions.endPage) - (filterOptions.startPage) > 9) return throwErrorMessage("pageLimitExceeded");
        if ((filterOptions.startPage) >= (filterOptions.endPage)) return throwErrorMessage("invalidInput");
        if (!filterOptions.endPage && filterOptions.startPage) filterOptions.endPage = (filterOptions.startPage) + 9;
        if (!filterOptions.startPage && filterOptions.endPage) filterOptions.startPage = (filterOptions.endPage) - 9;
        filterOptions.startPage = (filterOptions.startPage < 1) ? filterOptions.startPage = 1 : filterOptions.startPage;

        filterOptions.step = config.ellipticSteps.stepV2Like;
        const {poolAddress , dexId} = filterOptions;
        const configuration = {};
        const {moduleGeneric , actionContract , apiKey} = config.etherscan;
        
        if(await web3.utils.isAddress(poolAddress) === false) return throwErrorMessage("invalidInput");

        try {
            const poolLiquidityContract = new web3.eth.Contract(uniswapV2Pool, poolAddress);
            try{
                await poolLiquidityContract.methods.token0().call();
            }
            catch(err){
                return throwErrorMessage("protocolNotSupported"); 
            }
            const [token0 , token1] = await Promise.all([poolLiquidityContract.methods.token0().call(),
             poolLiquidityContract.methods.token1().call()]);
            
            const [token0Symbol , token1Symbol] = await Promise.all([getSymbolEvm(web3, { tokenAddress: token0 }).then(res => res.symbol) 
                , await getSymbolEvm(web3, { tokenAddress: token1 }).then(res => res.symbol)]);

            const latestBlock = await web3.eth.getBlockNumber();

            configuration.params = {
                module: moduleGeneric,
                action: actionContract,
                contractaddresses: poolAddress,
                apiKey
            };


            const data = await axios.get(config.etherscan.baseUrl[config.dex[dexId].chainId], configuration)
            .then(res => (res.data.result[0].txHash));
            try {
                startBlockNumber = await web3.eth.getTransaction(data).then(res => res.blockNumber);

            }
            catch (error) {
                startBlockNumber = await axios.post(publicRpc, 
                    {
                        method: 'eth_getTransactionByHash',
                        params: [data],
                        id: Math.random(),
                        jsonrpc: '2.0'
                    },
                ).then(res => Number(res.data.result.blockNumber).toString());
            }
            
            Object.assign(filterOptions, { latestBlock, startBlockNumber, poolLiquidityContract, token0Symbol, token1Symbol });
            const liquidityData = await getPoolIndividualLiqudity(web3 , filterOptions);

            return liquidityData;
        }
        catch (error) {
            console.log(error);
            return error;
        }

    },
    getPoolIndividualLiquiditySushiswapV2: async (web3, options) => {
        const filterOptions = options;
        filterOptions.function = "getPoolIndividualLiquidity()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        let startBlockNumber;
        const { publicRpc } = config.chains[config.dex[filterOptions.dexId].chainId];

        filterOptions.startPage = Number(filterOptions.startPage);
        filterOptions.endPage = Number(filterOptions.endPage);
        if ((filterOptions.startPage === undefined && filterOptions.endPage === undefined) 
        || (Number.isNaN(filterOptions.startPage) && Number.isNaN(filterOptions.endPage))) {
            filterOptions.startPage = 1;
            filterOptions.endPage = 10;
        }
        if ((filterOptions.endPage) - (filterOptions.startPage) > 9) return throwErrorMessage("pageLimitExceeded");
        if ((filterOptions.startPage) >= (filterOptions.endPage)) return throwErrorMessage("invalidInput");
        if (!filterOptions.endPage && filterOptions.startPage) filterOptions.endPage = (filterOptions.startPage) + 9;
        if (!filterOptions.startPage && filterOptions.endPage) filterOptions.startPage = (filterOptions.endPage) - 9;
        filterOptions.startPage = (filterOptions.startPage < 1) ? filterOptions.startPage = 1 : filterOptions.startPage;

        filterOptions.step = config.ellipticSteps.stepV2Like;
        const {poolAddress , dexId} = filterOptions;
        const configuration = {};
        const {moduleGeneric , actionContract , apiKey} = config.etherscan;
        
        if(await web3.utils.isAddress(poolAddress) === false) return throwErrorMessage("invalidInput");

        try {
            const poolLiquidityContract = new web3.eth.Contract(sushiswapV2PoolAbi, poolAddress);
            try{
                await poolLiquidityContract.methods.token0().call();
            }
            catch(err){
                return throwErrorMessage("protocolNotSupported"); 
            }
            const [token0 , token1] = await Promise.all([poolLiquidityContract.methods.token0().call(),
             poolLiquidityContract.methods.token1().call()]);
            const [token0Symbol , token1Symbol] = await Promise.all([getSymbolEvm(web3, { tokenAddress: token0 }).then(res => res.symbol) 
                , await getSymbolEvm(web3, { tokenAddress: token1 }).then(res => res.symbol)]);

            const latestBlock = await web3.eth.getBlockNumber();

            configuration.params = {
                module: moduleGeneric,
                action: actionContract,
                contractaddresses: poolAddress,
                apiKey
            };


            const data = await axios.get(config.etherscan.baseUrl[config.dex[dexId].chainId], configuration)
            .then(res => (res.data.result[0].txHash));
            try {
                startBlockNumber = await web3.eth.getTransaction(data).then(res => res.blockNumber);
            }
            catch (error) {
                startBlockNumber = await axios.post(publicRpc, 
                    {
                        method: 'eth_getTransactionByHash',
                        params: [data],
                        id: Math.random(),
                        jsonrpc: '2.0'
                    },
                ).then(res => Number(res.data.result.blockNumber).toString());
            }
            
            Object.assign(filterOptions, { latestBlock, startBlockNumber, poolLiquidityContract, token0Symbol, token1Symbol });
            const liquidityData = await getPoolIndividualLiqudity(web3 , filterOptions);

            return liquidityData;
        }
        catch (error) {
            console.log(error);
            return error;
        }

    },
    getPoolIndividualLiquidityPancakeV2: async (web3, options) => {
        const filterOptions = options;
        filterOptions.function = "getPoolIndividualLiquidity()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        let startBlockNumber;
        const { publicRpc } = config.chains[config.dex[filterOptions.dexId].chainId];

        filterOptions.startPage = Number(filterOptions.startPage);
        filterOptions.endPage = Number(filterOptions.endPage);
        if ((filterOptions.startPage === undefined && filterOptions.endPage === undefined) 
        || (Number.isNaN(filterOptions.startPage) && Number.isNaN(filterOptions.endPage))) {
            filterOptions.startPage = 1;
            filterOptions.endPage = 10;
        }
        if ((filterOptions.endPage) - (filterOptions.startPage) > 9) return throwErrorMessage("pageLimitExceeded");
        if ((filterOptions.startPage) >= (filterOptions.endPage)) return throwErrorMessage("invalidInput");
        if (!filterOptions.endPage && filterOptions.startPage) filterOptions.endPage = (filterOptions.startPage) + 9;
        if (!filterOptions.startPage && filterOptions.endPage) filterOptions.startPage = (filterOptions.endPage) - 9;
        filterOptions.startPage = (filterOptions.startPage < 1) ? filterOptions.startPage = 1 : filterOptions.startPage;

        filterOptions.step = config.ellipticSteps.stepV2Like;
        const {poolAddress , dexId} = filterOptions;
        const configuration = {};
        const {moduleGeneric , actionContract , bscKey} = config.etherscan;
        
        if(await web3.utils.isAddress(poolAddress) === false) return throwErrorMessage("invalidInput");

        try {
            const poolLiquidityContract = new web3.eth.Contract(pancakeswapV2PoolAbi, poolAddress);
            try{
                await poolLiquidityContract.methods.token0().call();
            }
            catch(err){
                return throwErrorMessage("protocolNotSupported"); 
            }
            const [token0 , token1] = await Promise.all([poolLiquidityContract.methods.token0().call(),
             poolLiquidityContract.methods.token1().call()]);
            const [token0Symbol , token1Symbol] = await Promise.all([getSymbolEvm(web3, { tokenAddress: token0 }).then(res => res.symbol) 
                , await getSymbolEvm(web3, { tokenAddress: token1 }).then(res => res.symbol)]);

            const latestBlock = await web3.eth.getBlockNumber();

            configuration.params = {
                module: moduleGeneric,
                action: actionContract,
                contractaddresses: poolAddress,
                apiKey:bscKey
            };


            const data = await axios.get(config.etherscan.baseUrl[config.dex[dexId].chainId], configuration)
            .then(res => (res.data.result[0].txHash));
            try {
                startBlockNumber = await web3.eth.getTransaction(data).then(res => res.blockNumber);
            }
            catch (error) {
                startBlockNumber = await axios.post(publicRpc, 
                    {
                        method: 'eth_getTransactionByHash',
                        params: [data],
                        id: Math.random(),
                        jsonrpc: '2.0'
                    },
                ).then(res => Number(res.data.result.blockNumber).toString());
            }
            
            Object.assign(filterOptions, { latestBlock, startBlockNumber, poolLiquidityContract, token0Symbol, token1Symbol });
            const liquidityData = await getPoolIndividualLiqudity(web3 , filterOptions);

            return liquidityData;
        }
        catch (error) {
            console.log(error);
            return error;
        }

    },

    getPoolIndividualLiquidityUniswapV3: async (web3, options) => {
        const filterOptions = options;
        filterOptions.function = "getPoolIndividualLiquidity()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        let startBlockNumber;
        const { publicRpc } = config.chains[config.dex[filterOptions.dexId].chainId];

        filterOptions.startPage = Number(filterOptions.startPage);
        filterOptions.endPage = Number(filterOptions.endPage);
        if ((filterOptions.startPage === undefined && filterOptions.endPage === undefined) 
        || (Number.isNaN(filterOptions.startPage) && Number.isNaN(filterOptions.endPage))) {
            filterOptions.startPage = 1;
            filterOptions.endPage = 10;
        }
        if ((filterOptions.endPage) - (filterOptions.startPage) > 9) return throwErrorMessage("pageLimitExceeded");
        if ((filterOptions.startPage) >= (filterOptions.endPage)) return throwErrorMessage("invalidInput");
        if (!filterOptions.endPage && filterOptions.startPage) filterOptions.endPage = (filterOptions.startPage) + 9;
        if (!filterOptions.startPage && filterOptions.endPage) filterOptions.startPage = (filterOptions.endPage) - 9;
        filterOptions.startPage = (filterOptions.startPage < 1) ? filterOptions.startPage = 1 : filterOptions.startPage;

        filterOptions.step = config.ellipticSteps.stepV2Like;
        const {poolAddress , dexId} = filterOptions;
        const configuration = {};
        const {moduleGeneric , actionContract } = config.etherscan;
        
        if(await web3.utils.isAddress(poolAddress) === false) return throwErrorMessage("invalidInput");

        try {
            const poolLiquidityContract = new web3.eth.Contract(uniswapV3Pool, poolAddress);
            try{
                await poolLiquidityContract.methods.token0().call();
            }
            catch(err){
                return throwErrorMessage("protocolNotSupported"); 
            }
            const [token0 , token1] = await Promise.all([poolLiquidityContract.methods.token0().call(),
             poolLiquidityContract.methods.token1().call()]);
            const [token0Symbol , token1Symbol] = await Promise.all([getSymbolEvm(web3, { tokenAddress: token0 }).then(res => res.symbol) 
                , await getSymbolEvm(web3, { tokenAddress: token1 }).then(res => res.symbol)]);

            const latestBlock = await web3.eth.getBlockNumber();

            configuration.params = {
                module: moduleGeneric,
                action: actionContract,
                contractaddresses: poolAddress,
                apiKey:config.etherscan.keys[config.dex[filterOptions.dexId].chainId]
            };


            const data = await axios.get(config.etherscan.baseUrl[config.dex[dexId].chainId], configuration)
            .then(res => (res.data.result[0].txHash));
            try {
                startBlockNumber = await web3.eth.getTransaction(data).then(res => res.blockNumber);
            }
            catch (error) {
                startBlockNumber = await axios.post(publicRpc, 
                    {
                        method: 'eth_getTransactionByHash',
                        params: [data],
                        id: Math.random(),
                        jsonrpc: '2.0'
                    },
                ).then(res => Number(res.data.result.blockNumber).toString());
            }
            
            Object.assign(filterOptions, { latestBlock, startBlockNumber, poolLiquidityContract, token0Symbol, token1Symbol });
            const liquidityData = await getPoolIndividualLiqudity(web3 , filterOptions);

            return liquidityData;
        }
        catch (error) {
            console.log(error);
            return error;
        }

    },
    // eslint-disable-next-line no-unused-vars
    getPoolIndividualLiquidityBalancerV2: async (web3, options) =>

        throwErrorMessage("notApplicable")
    ,
    // eslint-disable-next-line no-unused-vars
    getPoolIndividualLiquidityCurveV2: async (web3, options) =>

        throwErrorMessage("notApplicable")
    ,
    // eslint-disable-next-line no-unused-vars
    getPoolIndividualLiquidityTraderJoe: async (web3, options) =>

        throwErrorMessage("notApplicable")
    ,
    // eslint-disable-next-line no-unused-vars
    getPoolIndividualLiquidityStonFi: async (web3, options) =>

        throwErrorMessage("notApplicable")
    ,

    // eslint-disable-next-line no-unused-vars
    getPoolIndividualLiquidityOrca: async (web3, options) =>

        throwErrorMessage("notApplicable")
,
};