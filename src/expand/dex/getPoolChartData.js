/* eslint-disable no-await-in-loop */
const schemaValidator = require('../../../common/configuration/schemaValidator');
const uniswapV2Router = require('../../../assets/abis/uniswapV2Router.json');
const uniswapV3Router = require('../../../assets/abis/uniswapV3Router.json');
const sushiSwapRouter = require('../../../assets/abis/sushiswapRouter.json');
const config = require('../../../common/configuration/config.json');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const uniswapV2PoolAbi = require('../../../assets/abis/uniswapV2PoolAbi.json');
const uniswapV3PoolAbi = require('../../../assets/abis/uniswapV3Pool.json');
const sushiswapV2PoolAbi = require('../../../assets/abis/sushiswapV2PoolAbi.json');
const { getPoolChartData } = require('./poolHelper');
const  {getChartDataPoolInitialization} = require('./poolInitializationHelper');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});


module.exports = {
    getPoolChartDataUniswapV2: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "poolChartData()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        try {

            if(await web3.utils.isAddress(filterOptions.poolAddress) === false) return throwErrorMessage("invalidInput");

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

            const routerContract = new web3.eth.Contract(
                uniswapV2Router,
                config.dex[filterOptions.dexId].routerAddress
            );

            Object.assign(filterOptions, {  poolLiquidityContract });
            const requiredParams = await getChartDataPoolInitialization(web3 , filterOptions);
            if(requiredParams.code === 400) return requiredParams;
            const {  token0Symbol, token1Symbol , latestBlock , decimals , decimalsforToken1 , token0 , token1} = requiredParams;
            Object.assign(filterOptions, {
                latestBlock, routerContract, poolLiquidityContract
                , token0Symbol, token1Symbol, decimals, decimalsforToken1, token0, token1
            });
            const chartData = await getPoolChartData(web3, filterOptions);
            return chartData;
        }
        catch (error) {
            console.log(error);
            return error;
        }
    },
    getPoolChartDataSushiswapV2: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "poolChartData()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        try {

            if(await web3.utils.isAddress(filterOptions.poolAddress) === false) return throwErrorMessage("invalidInput");

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


            const routerContract = new web3.eth.Contract(
                sushiSwapRouter,
                config.dex[filterOptions.dexId].routerAddress
            );

            Object.assign(filterOptions, {  poolLiquidityContract });
            const requiredParams = await getChartDataPoolInitialization(web3 , filterOptions);
            if(requiredParams.code === 400) return requiredParams;
            const {  token0Symbol, token1Symbol , latestBlock , decimals , decimalsforToken1 , token0 , token1} = requiredParams;
            Object.assign(filterOptions, {
                latestBlock, routerContract, poolLiquidityContract
                , token0Symbol, token1Symbol, decimals, decimalsforToken1, token0, token1
            });
            const chartData = await getPoolChartData(web3, filterOptions);
            return chartData;
        }
        catch (error) {
            console.log(error);
            return error;
        }
    },
    // eslint-disable-next-line no-unused-vars
    getPoolChartDataPancakeV2: async (web3, options) => 

        throwErrorMessage("notApplicable")

    ,
    getPoolChartDataUniswapV3: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "poolChartData()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        try {

            if(await web3.utils.isAddress(filterOptions.poolAddress) === false) return throwErrorMessage("invalidInput");

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


            const routerContract = new web3.eth.Contract(
                uniswapV3Router,
                config.dex[filterOptions.dexId].routerAddress
            );

            Object.assign(filterOptions, {  poolLiquidityContract });
            const requiredParams = await getChartDataPoolInitialization(web3 , filterOptions);
            if(requiredParams.code === 400) return requiredParams;
            const {  token0Symbol, token1Symbol , latestBlock , decimals , decimalsforToken1 , token0 , token1} = requiredParams;
            Object.assign(filterOptions, {
                latestBlock, routerContract, poolLiquidityContract
                , token0Symbol, token1Symbol, decimals, decimalsforToken1, token0, token1
            });
            const chartData = await getPoolChartData(web3, filterOptions);
            return chartData;
        }
        catch (error) {
            console.log(error);
            return error;
        }
    },
    // eslint-disable-next-line no-unused-vars
    getPoolChartDataBalancerV2: async (web3, options) =>

        throwErrorMessage("notApplicable")
    ,
    // eslint-disable-next-line no-unused-vars
    getPoolChartDataCurveV2: async (web3, options) =>

        throwErrorMessage("notApplicable")
    ,
    // eslint-disable-next-line no-unused-vars
    getPoolChartDataStonFi: async (web3, options) =>

        throwErrorMessage("notApplicable")
    ,

    // eslint-disable-next-line no-unused-vars
    getPoolChartDataOrca: async (web3, options) =>

        throwErrorMessage("notApplicable")
    ,

};