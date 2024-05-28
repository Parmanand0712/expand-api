/* eslint-disable no-await-in-loop */
const errorMessage = require('../../../common/configuration/errorMessage.json');
const uniswapV2PoolAbi = require('../../../assets/abis/uniswapV2PoolAbi.json');
const uniswapV3PoolAbi = require('../../../assets/abis/uniswapV3Pool.json');
const sushiswapV2PoolAbi = require('../../../assets/abis/sushiswapV2PoolAbi.json');
const pancakeswapPoolAbi = require('../../../assets/abis/pancakeswapPoolAbi.json');
const { getPoolHistroicalTransactions } = require('./poolHelper');
const { getHistoricalTransactionsPoolInitialization} = require('./poolInitializationHelper');
const schemaValidator = require('../../../common/configuration/schemaValidator');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});



module.exports = {

    getHistoricalTransactionsUniswapV2: async (web3, options) => {
        const filterOptions = options;
        filterOptions.function = "poolHistoricalTransactions()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

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

        try {
            Object.assign(filterOptions, {  poolLiquidityContract });
            const requiredParams = await getHistoricalTransactionsPoolInitialization(web3 , filterOptions);
            if(requiredParams.code === 400) return requiredParams;
            const { step , token0Symbol, token1Symbol 
                , startBlock , endBlock} = requiredParams;
            Object.assign(filterOptions, { step, poolLiquidityContract, token0Symbol, token1Symbol , startBlock , endBlock });
            const transactionData = await getPoolHistroicalTransactions(web3, filterOptions);
            return transactionData;
        }
        catch (err) {
            return err;
        }
    },
    getHistoricalTransactionsSushiswapV2: async (web3, options) => {
        const filterOptions = options;
        filterOptions.function = "poolHistoricalTransactions()";
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
            const requiredParams = await getHistoricalTransactionsPoolInitialization(web3 , filterOptions);
            if(requiredParams.code === 400) return requiredParams;
            const { step , token0Symbol, token1Symbol 
                , startBlock , endBlock} = requiredParams;
            Object.assign(filterOptions, { step, poolLiquidityContract, token0Symbol, token1Symbol , startBlock , endBlock });
            const transactionData = await getPoolHistroicalTransactions(web3, filterOptions);
            return transactionData;
        }
        catch (err) {
            return err;
        }
    },
    getHistoricalTransactionsPancakeV2: async (web3, options) => {
        const filterOptions = options;
        filterOptions.function = "poolHistoricalTransactions()";
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
            const requiredParams = await getHistoricalTransactionsPoolInitialization(web3 , filterOptions);
            if(requiredParams.code === 400) return requiredParams;
            const { step , token0Symbol, token1Symbol 
                , startBlock , endBlock} = requiredParams;
            Object.assign(filterOptions, { step, poolLiquidityContract, token0Symbol, token1Symbol , startBlock , endBlock });
            const transactionData = await getPoolHistroicalTransactions(web3, filterOptions);
            return transactionData;
        }
        catch (err) {
            return err;
        }
    },
    getHistoricalTransactionsUniswapV3: async (web3, options) => {
        const filterOptions = options;
        filterOptions.function = "poolHistoricalTransactions()";
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
            const requiredParams = await getHistoricalTransactionsPoolInitialization(web3 , filterOptions);
            if(requiredParams.code === 400) return requiredParams;
            const { step , token0Symbol, token1Symbol 
                , startBlock , endBlock} = requiredParams;
            Object.assign(filterOptions, { step, poolLiquidityContract, token0Symbol, token1Symbol , startBlock , endBlock });
            const transactionData = await getPoolHistroicalTransactions(web3, filterOptions);
            return transactionData;
        }
        catch (err) {
            return err;
        }
    },
    // eslint-disable-next-line no-unused-vars
    getHistoricalTransactionsBalancerV2: async (web3, options) =>

        throwErrorMessage("notApplicable")
    ,
    // eslint-disable-next-line no-unused-vars
    getHistoricalTransactionsCurveV2: async (web3, options) =>

        throwErrorMessage("notApplicable")
    ,
    // eslint-disable-next-line no-unused-vars
    getHistoricalTransactionsStonFi: async (web3, options) =>

        throwErrorMessage("notApplicable")
    ,

    // eslint-disable-next-line no-unused-vars
    getHistoricalTransactionsOrca: async (web3, options) =>

        throwErrorMessage("notApplicable")
    ,
};