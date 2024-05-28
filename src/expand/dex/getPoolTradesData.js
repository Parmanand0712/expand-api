/* eslint-disable no-await-in-loop */

const errorMessage = require('../../../common/configuration/errorMessage.json');
const uniswapV2PoolAbi = require('../../../assets/abis/uniswapV2PoolAbi.json');
const uniswapV3PoolAbi = require('../../../assets/abis/uniswapV3Pool.json');
const sushiswapV2PoolAbi = require('../../../assets/abis/sushiswapV2PoolAbi.json');
const pancakeswapPoolAbi = require('../../../assets/abis/pancakeswapPoolAbi.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const { getPoolTradeData } = require('./poolHelper');
const {getTradePoolInitialization} = require('./poolInitializationHelper');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});



module.exports = {

    getPoolTradeDataUniswapV2: async (web3, options) => {
        const filterOptions = options;
        filterOptions.function = "poolTradeData()";
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
            
            Object.assign(filterOptions, {  poolLiquidityContract });
            const requiredParams = await getTradePoolInitialization(web3 , filterOptions);
            if(requiredParams.code === 400) return requiredParams;
            const {  step , token0Symbol, token1Symbol, startBlock, endBlock} = requiredParams;
            Object.assign(filterOptions, { step, poolLiquidityContract, token0Symbol, token1Symbol, startBlock, endBlock });
            const tradeData = await getPoolTradeData(web3, filterOptions);
            return tradeData;

        }
        catch (err) {
            console.log(err);
            return err;
        }
    },
    getPoolTradeDataSushiswapV2: async (web3, options) => {
        const filterOptions = options;
        filterOptions.function = "poolTradeData()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }
        
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

        try {
            Object.assign(filterOptions, {  poolLiquidityContract });
            const requiredParams = await getTradePoolInitialization(web3 , filterOptions);
            if(requiredParams.code === 400) return requiredParams;
            const {  step , token0Symbol, token1Symbol, startBlock, endBlock} = requiredParams;
            Object.assign(filterOptions, { step, poolLiquidityContract, token0Symbol, token1Symbol, startBlock, endBlock });
            const tradeData = await getPoolTradeData(web3, filterOptions);
            return tradeData;

        }
        catch (err) {
            console.log(err);
            return err;
        }
    },
    getPoolTradeDataPancakeV2: async (web3, options) => {
        const filterOptions = options;
        filterOptions.function = "poolTradeData()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

       

        if(await web3.utils.isAddress(filterOptions.poolAddress) === false) return throwErrorMessage("invalidInput");

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
            const requiredParams = await getTradePoolInitialization(web3 , filterOptions);
            if(requiredParams.code === 400) return requiredParams;
            const {  step , token0Symbol, token1Symbol, startBlock, endBlock} = requiredParams;
            Object.assign(filterOptions, { step, poolLiquidityContract, token0Symbol, token1Symbol, startBlock, endBlock });
            const tradeData = await getPoolTradeData(web3, filterOptions);
            return tradeData;

        }
        catch (err) {
            console.log(err);
            return err;
        }
    },
    getPoolTradeDataUniswapV3: async (web3, options) => {
        const filterOptions = options;
        filterOptions.function = "poolTradeData()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }
       

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

        try {
            Object.assign(filterOptions, {  poolLiquidityContract });
            const requiredParams = await getTradePoolInitialization(web3 , filterOptions);
            if(requiredParams.code === 400) return requiredParams;
            const {  step , token0Symbol, token1Symbol, startBlock, endBlock} = requiredParams;
            Object.assign(filterOptions, { step, poolLiquidityContract, token0Symbol, token1Symbol, startBlock, endBlock });
            const tradeData = await getPoolTradeData(web3, filterOptions);
            return tradeData;

        }
        catch (err) {
            console.log(err);
            return err;
        }
    },
    // eslint-disable-next-line no-unused-vars
    getPoolTradeDataBalancerV2: async (web3, options) =>

        throwErrorMessage("notApplicable")
    ,
    // eslint-disable-next-line no-unused-vars
    getPoolTradeDataCurveV2: async (web3, options) =>

        throwErrorMessage("notApplicable")
    ,
    // eslint-disable-next-line no-unused-vars
    getPoolTradeDataStonFi: async (web3, options) =>

        throwErrorMessage("notApplicable")
    ,

    // eslint-disable-next-line no-unused-vars
    getPoolTradeDataOrca: async (web3, options) =>

        throwErrorMessage("notApplicable")
 ,
};