/* eslint-disable no-await-in-loop */
const errorMessage = require('../../../common/configuration/errorMessage.json');
const uniswapV2PoolAbi = require('../../../assets/abis/uniswapV2PoolAbi.json');
const uniswapV3PoolAbi = require('../../../assets/abis/uniswapV3Pool.json');
const sushiswapV2PoolAbi = require('../../../assets/abis/sushiswapV2PoolAbi.json');
const pancakeswapPoolAbi = require('../../../assets/abis/pancakeswapPoolAbi.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const { getPoolHistoricalTimeSeries } = require('./poolHelper');
const { getHistoricalTimeSeriesPoolInitialization} = require('./poolInitializationHelper');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});


module.exports = {

    getHistoricalTimeSeriesUniswapV2: async (web3, options) => {
        const filterOptions = options;
        filterOptions.function = "poolHistoricalTimeSeries()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }


        const poolLiquidityContract = new web3.eth.Contract(
            uniswapV2PoolAbi,
            filterOptions.poolAddress
        );

        try{
            await poolLiquidityContract.methods.token0().call();
        }
        catch(err){
            return throwErrorMessage("protocolNotSupported"); 
        }

        try {
            Object.assign(filterOptions, {  poolLiquidityContract });
            const requiredParams = await getHistoricalTimeSeriesPoolInitialization(web3 , filterOptions);
            if(requiredParams.code === 400) return requiredParams;
            const { step , token0Symbol, token1Symbol, decimals, decimalsforToken1 
                , startBlock , endBlock} = requiredParams;
            Object.assign(filterOptions, { step, poolLiquidityContract, token0Symbol, token1Symbol, decimals, decimalsforToken1 
                , startBlock , endBlock });
            const timeSeriesData = await getPoolHistoricalTimeSeries(web3, filterOptions);
            return timeSeriesData;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    },
    getHistoricalTimeSeriesSushiswapV2: async (web3, options) => {
        const filterOptions = options;
        filterOptions.function = "poolHistoricalTimeSeries()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }


        const poolLiquidityContract = new web3.eth.Contract(
            sushiswapV2PoolAbi,
            filterOptions.poolAddress
        );

        try{
            await poolLiquidityContract.methods.token0().call();
        }
        catch(err){
            return throwErrorMessage("protocolNotSupported"); 
        }

        try {

            Object.assign(filterOptions, {  poolLiquidityContract });
            const requiredParams = await getHistoricalTimeSeriesPoolInitialization(web3 , filterOptions);
            if(requiredParams.code === 400) return requiredParams;
            const { step , token0Symbol, token1Symbol, decimals, decimalsforToken1 
                , startBlock , endBlock} = requiredParams;
            Object.assign(filterOptions, { step, poolLiquidityContract, token0Symbol, token1Symbol, decimals, decimalsforToken1 
                , startBlock , endBlock });
            const timeSeriesData = await getPoolHistoricalTimeSeries(web3, filterOptions);
            return timeSeriesData;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    },
    getHistoricalTimeSeriesPancakeV2: async (web3, options) => {
        const filterOptions = options;
        filterOptions.function = "poolHistoricalTimeSeries()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const poolLiquidityContract = new web3.eth.Contract(
            pancakeswapPoolAbi,
            filterOptions.poolAddress
        );

        try{
            await poolLiquidityContract.methods.token0().call();
        }
        catch(err){
            return throwErrorMessage("protocolNotSupported"); 
        }

        try {

            Object.assign(filterOptions, {  poolLiquidityContract });
            const requiredParams = await getHistoricalTimeSeriesPoolInitialization(web3 , filterOptions);
            if(requiredParams.code === 400) return requiredParams;
            const { step , token0Symbol, token1Symbol, decimals, decimalsforToken1 
                , startBlock , endBlock} = requiredParams;
            Object.assign(filterOptions, { step, poolLiquidityContract, token0Symbol, token1Symbol, decimals, decimalsforToken1 
                , startBlock , endBlock });
            const timeSeriesData = await getPoolHistoricalTimeSeries(web3, filterOptions);
            return timeSeriesData;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    },
    getHistoricalTimeSeriesUniswapV3: async (web3, options) => {
        const filterOptions = options;
        filterOptions.function = "poolHistoricalTimeSeries()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const poolLiquidityContract = new web3.eth.Contract(
            uniswapV3PoolAbi,
            filterOptions.poolAddress
        );

        try{
            await poolLiquidityContract.methods.token0().call();
        }
        catch(err){
            return throwErrorMessage("protocolNotSupported"); 
        }

        try {

            Object.assign(filterOptions, {  poolLiquidityContract });
            const requiredParams = await getHistoricalTimeSeriesPoolInitialization(web3 , filterOptions);
            if(requiredParams.code === 400) return requiredParams;
            const { step , token0Symbol, token1Symbol, decimals, decimalsforToken1 
                , startBlock , endBlock} = requiredParams;
            Object.assign(filterOptions, { step, poolLiquidityContract, token0Symbol, token1Symbol, decimals, decimalsforToken1 
                , startBlock , endBlock });
            const timeSeriesData = await getPoolHistoricalTimeSeries(web3, filterOptions);
            return timeSeriesData;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    },
    // eslint-disable-next-line no-unused-vars
    getHistoricalTimeSeriesBalancerV2: async (web3, options) =>

        throwErrorMessage("notApplicable")
    ,
    // eslint-disable-next-line no-unused-vars
    getHistoricalTimeSeriesCurveV2: async (web3, options) =>

        throwErrorMessage("notApplicable")
    ,
    // eslint-disable-next-line no-unused-vars
    getHistoricalTimeSeriesStonFi: async (web3, options) =>

        throwErrorMessage("notApplicable")
    ,

     // eslint-disable-next-line no-unused-vars
     getHistoricalTimeSeriesOrca: async (web3, options) =>

     throwErrorMessage("notApplicable")
 ,
};