const helper = require("../middlewares/helper");
const errorMessages = require("../../../common/configuration/errorMessage.json");
const { getApiParams} = require("../../../common/dynamo");


exports.getOrders = async (req, res) => {
  const time = new Date().getTime();
  try {
    const orders = await helper.derivativeCommon("getOrders", req.query);
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
        error : orders,
      });
    } else {

      try{
        await getApiParams(req , time , orders , errorMessages , 'success');
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

exports.getFills = async (req, res) => {
  const time = new Date().getTime();
  try {
    const fills = await helper.derivativeCommon("getFills", req.query);
    if (
      fills.valid !== undefined ||
      fills.error !== undefined ||
      fills.message !== undefined ||
      fills.code !== undefined
    ) {

      try{
        await getApiParams(req , time , fills , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }
      
      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : fills,
      });
    } else {

      try{
        await getApiParams(req , time , fills , errorMessages , 'success');
      }
      catch(err){
        console.log(err);
      }
  
      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: fills,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.getAssets = async (req, res) => {
  const time = new Date().getTime();
  try {
    const assets = await helper.derivativeCommon("getAssets", req.query);
    if (
      assets.valid !== undefined ||
      assets.error !== undefined ||
      assets.message !== undefined ||
      assets.code !== undefined
    ) {

      try{
        await getApiParams(req , time , assets , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }
      
      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : assets,
      });
    } else {

      try{
        await getApiParams(req , time , assets , errorMessages , 'success');
      }
      catch(err){
        console.log(err);
      }
  
      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: assets,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.getHistoricalPnL = async (req, res) => {
  const time = new Date().getTime();
  try {
    const historicalPnL = await helper.derivativeCommon("getHistoricalPnL", req.query);
    if (
      historicalPnL.valid !== undefined ||
      historicalPnL.error !== undefined ||
      historicalPnL.message !== undefined ||
      historicalPnL.code !== undefined
    ) {

      try{
        await getApiParams(req , time , historicalPnL , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }
      
      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : historicalPnL,
      });
    } else {

      try{
        await getApiParams(req , time , historicalPnL , errorMessages , 'success');
      }
      catch(err){
        console.log(err);
      }
  
      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: historicalPnL,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.getOrder = async (req, res) => {
  const time = new Date().getTime();
  try {
    const order = await helper.derivativeCommon("getOrder", req.query);
    if (
      order.valid !== undefined ||
      order.error !== undefined ||
      order.message !== undefined ||
      order.code !== undefined
    ) {

      try{
        await getApiParams(req , time , order , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }
      
      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : order,
      });
    } else {

      try{
        await getApiParams(req , time , order , errorMessages , 'success');
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


exports.getPerpetualPositions = async (req, res) => {
  const time = new Date().getTime();
  try {
    const positions = await helper.derivativeCommon("getPerpetualPositions", req.query);
    if (
      positions.valid !== undefined ||
      positions.error !== undefined ||
      positions.message !== undefined ||
      positions.code !== undefined
    ) {

      try{
        await getApiParams(req , time , positions , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }
      
      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : positions,
      });
    } else {

      try{
        await getApiParams(req , time , positions , errorMessages , 'success');
      }
      catch(err){
        console.log(err);
      }
  
      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: positions,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};


exports.getSubAccounts = async (req, res) => {
  const time = new Date().getTime();
  try {
    const subAccounts = await helper.derivativeCommon("getSubAccounts", req.query);
    if (
      subAccounts.valid !== undefined ||
      subAccounts.error !== undefined ||
      subAccounts.message !== undefined ||
      subAccounts.code !== undefined
    ) {

      try{
        await getApiParams(req , time , subAccounts , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }
      
      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : subAccounts,
      });
    } else {

      try{
        await getApiParams(req , time , subAccounts , errorMessages , 'success');
      }
      catch(err){
        console.log(err);
      }
  
      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: subAccounts,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.getTransfers = async (req, res) => {
  const time = new Date().getTime();
  try {
    const transfers = await helper.derivativeCommon("getTransfers", req.query);
    if (
      transfers.valid !== undefined ||
      transfers.error !== undefined ||
      transfers.message !== undefined ||
      transfers.code !== undefined
    ) {

      try{
        await getApiParams(req , time , transfers , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }
      
      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : transfers,
      });
    } else {

      try{
        await getApiParams(req , time , transfers , errorMessages , 'success');
      }
      catch(err){
        console.log(err);
      }
  
      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: transfers,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};
