const axios = require('axios');
const helper = require("../middlewares/helper");
const errorMessages = require("../../../common/configuration/errorMessage.json");
const {  getApiParams , postApiParams } = require("../../../common/dynamo");
require('dotenv').config({path:'../env'});
// Dex Query

exports.getDexPrice = async (req, res) => {
  const time = new Date().getTime();
  try {
    const dexPrice = await helper.dexCommon(
      "getPrice",
      await helper.pathStringToArray(req.query)
    );
    if (
      dexPrice.valid !== undefined ||
      dexPrice.error !== undefined ||
      dexPrice.message !== undefined ||
      dexPrice.code !== undefined
    ) {

      try{
         await getApiParams(req , time , dexPrice , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : dexPrice
      });
    } else {

      try{
         await getApiParams(req , time , dexPrice , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: dexPrice,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

const getPoolIndividualLiquidityMain = async (req, res) => {
  const time = new Date().getTime();
  try {
    const poolLiquidity = await helper.dexCommon(
      "getPoolIndividualLiquidity",
      await helper.pathStringToArray(req.query)
    );
    if (
      poolLiquidity.valid !== undefined ||
      poolLiquidity.error !== undefined ||
      poolLiquidity.message !== undefined ||
      poolLiquidity.code !== undefined
    ) {

      try{
         await getApiParams(req , time , poolLiquidity , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : poolLiquidity
      });
    } else {

      try{
         await getApiParams(req , time , poolLiquidity , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: poolLiquidity,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};


// eslint-disable-next-line consistent-return
exports.getPoolIndividualLiquidity = async (req, res) => {
  if(req.headers['x-api-key'] === undefined) req.headers['x-api-key'] = '';
  axios.defaults.headers['X-API-KEY'] = req.headers['x-api-key'];
  try{
    await axios.get(`${process.env.DOMAINNAME}${req.originalUrl}`).then(result => console.log(result.data));
  }
  catch(error){
    if (error.response) {
      return res.status(error.response.status).json(
        error.response.data
      );
    } else {
      return res.status(500).json({message: 'Internal server errorrrr'});
    }
    
  }
  await getPoolIndividualLiquidityMain(req , res);
  
};

const getHistoricalTransactionsMain = async (req, res) => {
  const time = new Date().getTime();
  try {
    const historicalTransactions = await helper.dexCommon(
      "getHistoricalTransactions",
      await helper.pathStringToArray(req.query)
    );
    if (
      historicalTransactions.valid !== undefined ||
      historicalTransactions.error !== undefined ||
      historicalTransactions.message !== undefined ||
      historicalTransactions.code !== undefined
    ) {

      try{
         await getApiParams(req , time , historicalTransactions , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : historicalTransactions
      });
    } else {

      try{
         await getApiParams(req , time , historicalTransactions , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: historicalTransactions,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

// eslint-disable-next-line consistent-return
exports.getHistoricalTransactions = async (req, res) => {
  if(req.headers['x-api-key'] === undefined) req.headers['x-api-key'] = '';
  axios.defaults.headers['X-API-KEY'] = req.headers['x-api-key'];
  try{
    await axios.get(`${process.env.DOMAINNAME}${req.originalUrl}`).then(result => console.log(result.data));
  }
  catch(error){
    if (error.response) {
      return res.status(error.response.status).json(
        error.response.data
      );
    } else {
      return res.status(500).json({message: 'Internal server errorrrr'});
    }
    
  }
  await getHistoricalTransactionsMain(req , res);
  
};

const getPoolTradeDataMain = async (req, res) => {
  const time = new Date().getTime();
  try {
    const getPoolTradeData = await helper.dexCommon(
      "getPoolTradeData",
      await helper.pathStringToArray(req.query)
    );
    if (
      getPoolTradeData.valid !== undefined ||
      getPoolTradeData.error !== undefined ||
      getPoolTradeData.message !== undefined ||
      getPoolTradeData.code !== undefined
    ) {

      try{
         await getApiParams(req , time , getPoolTradeData , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : getPoolTradeData
      });
    } else {

      try{
         await getApiParams(req , time , getPoolTradeData , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: getPoolTradeData,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

// eslint-disable-next-line consistent-return
exports.getPoolTradeData = async (req, res) => {
  if(req.headers['x-api-key'] === undefined) req.headers['x-api-key'] = '';
  axios.defaults.headers['X-API-KEY'] = req.headers['x-api-key'];
  try{
    await axios.get(`${process.env.DOMAINNAME}${req.originalUrl}`).then(result => console.log(result.data));
  }
  catch(error){
    if (error.response) {
      return res.status(error.response.status).json(
        error.response.data
      );
    } else {
      return res.status(500).json({message: 'Internal server errorrrr'});
    }
    
  }
  await getPoolTradeDataMain(req , res);
  
};

const getHistoricalTimeSeriesMain = async (req, res) => {
  const time = new Date().getTime();
  try {
    const historicalTransactions = await helper.dexCommon(
      "getHistoricalTimeSeries",
      await helper.pathStringToArray(req.query)
    );
    if (
      historicalTransactions.valid !== undefined ||
      historicalTransactions.error !== undefined ||
      historicalTransactions.message !== undefined ||
      historicalTransactions.code !== undefined
    ) {

      try{
         await getApiParams(req , time , historicalTransactions , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : historicalTransactions
      });
    } else {

      try{
         await getApiParams(req , time , historicalTransactions , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: historicalTransactions,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

// eslint-disable-next-line consistent-return
exports.getHistoricalTimeSeries = async (req, res) => {
  if(req.headers['x-api-key'] === undefined) req.headers['x-api-key'] = '';
  axios.defaults.headers['X-API-KEY'] = req.headers['x-api-key'];
  try{
    await axios.get(`${process.env.DOMAINNAME}${req.originalUrl}`).then(result => console.log(result.data));
  }
  catch(error){
    if (error.response) {
      return res.status(error.response.status).json(
        error.response.data
      );
    } else {
      return res.status(500).json({message: 'Internal server errorrrr'});
    }
    
  }
  await getHistoricalTimeSeriesMain(req , res);
  
};

// Dex get pool:
exports.getDexPool = async (req, res) => {
  const time = new Date().getTime();
  try {
    const dexPool = await helper.dexCommonGetPool(
      "getPool",
         await helper.pathStringToArraygetPool(req.query)
    );
    if (
      dexPool.valid !== undefined ||
      dexPool.error !== undefined ||
      dexPool.message !== undefined ||
      dexPool.code !== undefined
    ) {

      try{
         await getApiParams(req , time , dexPool , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : dexPool
      });
    } else {

      try{
         await getApiParams(req , time , dexPool , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }


      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: dexPool,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

// Dex GetLiquidity
exports.getDexLiquidity = async (req, res) => {
  const time = new Date().getTime();
  try {
    const dexLiquidity = await helper.dexCommon(
      "getLiquidity",
      await helper.pathStringToArray(req.query)
    );
    if (
      dexLiquidity.valid !== undefined ||
      dexLiquidity.error !== undefined ||
      dexLiquidity.message !== undefined ||
      dexLiquidity.code !== undefined
    ) {

      try{
         await getApiParams(req , time , dexLiquidity , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }


      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : dexLiquidity
      });
    } else {

      try{
         await getApiParams(req , time , dexLiquidity , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: dexLiquidity,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

// Dex GetLiquidity
exports.getDexPoolLiquidity = async (req, res) => {
  const time = new Date().getTime();
  try {
    const dexPoolLiquidity = await helper.dexCommon(
      "getPoolLiquidity",
      await helper.pathStringToArray(req.query)
    );
    if (
      dexPoolLiquidity.valid !== undefined ||
      dexPoolLiquidity.error !== undefined ||
      dexPoolLiquidity.message !== undefined ||
      dexPoolLiquidity.code !== undefined
    ) {

      try{
        await getApiParams(req , time , dexPoolLiquidity , errorMessages , 'failed');
       
     }
     catch(err){
       console.log(err);
     }
      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : dexPoolLiquidity
      });
    } else {

      try{
        await getApiParams(req , time , dexPoolLiquidity , errorMessages , 'success');
       
     }
     catch(err){
       console.log(err);
     }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: dexPoolLiquidity,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

const getPoolChartDataMain = async (req, res) => {
  const time = new Date().getTime();
  try {
    const getPoolChartData = await helper.dexCommon(
      "getPoolChartData",
      await helper.pathStringToArray(req.query)
    );
    if (
      getPoolChartData.valid !== undefined ||
      getPoolChartData.error !== undefined ||
      getPoolChartData.message !== undefined ||
      getPoolChartData.code !== undefined
    ) {

      try{
        await getApiParams(req , time , getPoolChartData , errorMessages , 'failed');
       
     }
     catch(err){
       console.log(err);
     }
      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : getPoolChartData
      });
    } else {

      try{
        await getApiParams(req , time , getPoolChartData , errorMessages , 'success');
       
     }
     catch(err){
       console.log(err);
     }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: getPoolChartData,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

// eslint-disable-next-line consistent-return
exports.getPoolChartData = async (req, res) => {
  if(req.headers['x-api-key'] === undefined) req.headers['x-api-key'] = '';
  axios.defaults.headers['X-API-KEY'] = req.headers['x-api-key'];
  try{
    await axios.get(`${process.env.DOMAINNAME}${req.originalUrl}`).then(result => console.log(result.data));
  }
  catch(error){
    if (error.response) {
      return res.status(error.response.status).json(
        error.response.data
      );
    } else {
      return res.status(500).json({message: 'Internal server errorrrr'});
    }
    
  }
  await getPoolChartDataMain(req , res);
  
};


exports.getDexPosition = async (req, res) => {
  const time = new Date().getTime();
  try {
    const dexPosition = await helper.dexCommon(
      "getPosition",
      await helper.pathStringToArray(req.query)
    );
    if (
      dexPosition.valid !== undefined ||
      dexPosition.error !== undefined ||
      dexPosition.message !== undefined ||
      dexPosition.code !== undefined
    ) {

      try{
        await getApiParams(req , time , dexPosition , errorMessages , 'failed');
       
     }
     catch(err){
       console.log(err);
     }
      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : dexPosition
      });
    } else {

      try{
        await getApiParams(req , time , dexPosition , errorMessages , 'success');
       
     }
     catch(err){
       console.log(err);
     }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: dexPosition,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.getDexTokenLiquidity = async (req, res) => {
  const time = new Date().getTime();
  try {
    const dexTokenLiquidity = await helper.dexCommon(
      "getTokenLiquidity",
      await helper.pathStringToArray(req.query)
    );
    if (
      dexTokenLiquidity.valid !== undefined ||
      dexTokenLiquidity.error !== undefined ||
      dexTokenLiquidity.message !== undefined ||
      dexTokenLiquidity.code !== undefined
    ) {

      try{
        await getApiParams(req , time , dexTokenLiquidity , errorMessages , 'failed');
       
     }
     catch(err){
       console.log(err);
     }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : dexTokenLiquidity
      });
    } else {

      try{
        await getApiParams(req , time , dexTokenLiquidity , errorMessages , 'success');
       
     }
     catch(err){
       console.log(err);
     }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: dexTokenLiquidity,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.getDexTokenHolders = async (req, res) => {
  const time = new Date().getTime();
  try {
    const dexTokenHolder = await helper.dexCommon(
      "getTokenHolder",
      await helper.pathStringToArray(req.query)
    );
    if (
      dexTokenHolder.valid !== undefined ||
      dexTokenHolder.error !== undefined ||
      dexTokenHolder.message !== undefined ||
      dexTokenHolder.code !== undefined
    ) {

      try{
        await getApiParams(req , time , dexTokenHolder , errorMessages , 'failed');
       
     }
     catch(err){
       console.log(err);
     }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : dexTokenHolder
      });
    } else {

      try{
        await getApiParams(req , time , dexTokenHolder , errorMessages , 'success');
       
     }
     catch(err){
       console.log(err);
     }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: dexTokenHolder,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

// Dex Transaction

exports.postDexSwap = async (req, res) => {
  const time = new Date().getTime();
  try {
    const swap = await helper.dexCommon("swap", req.body);
    if (
      swap.valid !== undefined ||
      swap.error !== undefined ||
      swap.code !== undefined
    ) {

      try{
         await postApiParams(req , time , swap , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }
      
      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : swap
      });
    } else {

      // try{
      //    await postApiParams(req , time , swap , errorMessages , 'success');
        
      // }
      // catch(err){
      //   console.log(err);
      // }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: swap,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.postDexAddLiquidity = async (req, res) => {
  const time = new Date().getTime();
  try {
    const liquidity = await helper.dexCommon("addLiquidity", req.body);
    if (
      liquidity.valid !== undefined ||
      liquidity.error !== undefined ||
      liquidity.code !== undefined
    ) {

      try{
         await postApiParams(req , time , liquidity , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : liquidity
      });
    } else {

      try{
         await postApiParams(req , time , liquidity , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: liquidity,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.postDexRemoveLiquidity = async (req, res) => {
  const time = new Date().getTime();
  try {
    const removedLiq = await helper.dexCommon("removeLiquidity", req.body);
    if (
      removedLiq.valid !== undefined ||
      removedLiq.error !== undefined ||
      removedLiq.code !== undefined
    ) {

      try{
         await postApiParams(req , time , removedLiq , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : removedLiq
      });
    } else {

      try{
         await postApiParams(req , time , removedLiq , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: removedLiq,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.postDexRefundLiquidity = async (req, res) => {
  const time = new Date().getTime();
  try {
    const removedLiq = await helper.dexCommon("refundLiquidity", req.body);
    if (
      removedLiq.valid !== undefined ||
      removedLiq.error !== undefined ||
      removedLiq.code !== undefined
    ) {

      try{
         await postApiParams(req , time , removedLiq , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : removedLiq
      });
    } else {

      try{
         await postApiParams(req , time , removedLiq , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: removedLiq,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.postDexSwapAggregator = async (req, res) => {
  const time = new Date().getTime();
  try {
    const swapAggregator = await helper.dexAggregatorCommon("swapAggregator", req.body);
    if (
      swapAggregator.valid !== undefined ||
      swapAggregator.error !== undefined ||
      swapAggregator.message !== undefined ||
      swapAggregator.code !== undefined
    ) {

      try{
         await postApiParams(req , time , swapAggregator , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : swapAggregator
      });
    } else {

      try{
         await postApiParams(req , time , swapAggregator , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: swapAggregator,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.getDexQuoteAggregator = async (req, res) => {
  const time = new Date().getTime();
  try {
    const quoteAggregator = await helper.dexAggregatorCommon("quoteAggregator", req.query);
    if (
      quoteAggregator.valid !== undefined ||
      quoteAggregator.error !== undefined ||
      quoteAggregator.message !== undefined ||
      quoteAggregator.code !== undefined
    ) {

      try{
         await postApiParams(req , time , quoteAggregator , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : quoteAggregator
      });
    } else {

      try{
         await postApiParams(req , time , quoteAggregator , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: quoteAggregator,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.getDexLiquiditySources = async (req, res) => {
  const time = new Date().getTime();
  try {
    const liquiditySources = await helper.dexCommon(
      "getLiquiditySources",
      await helper.pathStringToArray(req.query)
    );    
    if (
      liquiditySources.valid !== undefined ||
      liquiditySources.error !== undefined ||
      liquiditySources.message !== undefined ||
      liquiditySources.code !== undefined
    ) {

      try{
        await getApiParams(req , time , liquiditySources , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : liquiditySources
      });
    } else {

      try{
        await getApiParams(req , time , liquiditySources , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: liquiditySources,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.getDexOrders = async (req, res) => {
  const time = new Date().getTime();
  try {
    const orders = await helper.dexCommon(
      "getOrders",
      await helper.pathStringToArray(req.query)
    );    
    if (
      orders.valid !== undefined ||
      orders.error !== undefined ||
      orders.message !== undefined ||
      orders.code !== undefined
    ) {

      try{
        await getApiParams(req , time , orders , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : orders
      });
    } else {

      try{
        await getApiParams(req , time , orders , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: orders,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.createDexOrder = async (req, res) => {
  const time = new Date().getTime();
  try {
    const order = await helper.dexCommon("createOrder", req.body);
    if (
      order.valid !== undefined ||
      order.error !== undefined ||
      order.message !== undefined ||
      order.code !== undefined
    ) {

      try{
         await postApiParams(req , time , order , errorMessages , 'failed');
      }
      catch(err){
        console.log(err);
      }
      
      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : order
      });
    } else {

      try{
         await postApiParams(req , time , order , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: order,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

const getDexWalletPositionMain = async (req, res) => {
  const time = new Date().getTime();
  try {
    const dexPosition = await helper.dexCommon(
      "getWalletPosition",
      await helper.pathStringToArray(req.query)
    );
    if (
      dexPosition.valid !== undefined ||
      dexPosition.error !== undefined ||
      dexPosition.message !== undefined ||
      dexPosition.code !== undefined
    ) {

      try{
        await getApiParams(req , time , dexPosition , errorMessages , 'failed');
       
     }
     catch(err){
       console.log(err);
     }
      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : dexPosition
      });
    } else {

      try{
        await getApiParams(req , time , dexPosition , errorMessages , 'success');
       
     }
     catch(err){
       console.log(err);
     }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: dexPosition,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

// eslint-disable-next-line consistent-return
exports.getDexWalletPosition = async (req, res) => {
  if(req.headers['x-api-key'] === undefined) req.headers['x-api-key'] = '';
  axios.defaults.headers['X-API-KEY'] = req.headers['x-api-key'];
  try{
    await axios.get(`${process.env.DOMAINNAME}${req.originalUrl}`).then(result => console.log(result.data));
  }
  catch(error){
    if (error.response) {
      return res.status(error.response.status).json(
        error.response.data
      );
    } else {
      return res.status(500).json({message: 'Internal server errorrrr'});
    }
    
  }
  await getDexWalletPositionMain(req , res);
  
};

exports.getRoute = async (req, res) => {
  const time = new Date().getTime();
  try {
    const dexPrice = await helper.dexCommon(
      "getRoute",
      await helper.pathStringToArray(req.query)
    );
    if (
      dexPrice.valid !== undefined ||
      dexPrice.error !== undefined ||
      dexPrice.message !== undefined ||
      dexPrice.code !== undefined
    ) {

      try{
         await getApiParams(req , time , dexPrice , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : dexPrice
      });
    } else {

      try{
         await getApiParams(req , time , dexPrice , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: dexPrice,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};


