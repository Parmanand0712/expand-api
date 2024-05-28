const helper = require("../middlewares/helper");
const errorMessages = require("../../../common/configuration/errorMessage.json");
const { getApiParams} = require("../../../common/dynamo");

exports.getHistoricalTransactions = async (req, res) => {
  const time = new Date().getTime();
  try {
    const historicalTransactions = await helper.nonFungibleTokenCommon("getHistoricalTransactions", req.query);
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
        error: historicalTransactions,
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

exports.getBalanceOf = async (req, res) => {
  const time = new Date().getTime();
  try {
    const name = await helper.nonFungibleTokenCommon("balanceOf", req.query);
    if (
      name.valid !== undefined ||
      name.error !== undefined ||
      name.message !== undefined ||
      name.code !== undefined
    ) {

      try{
        await getApiParams(req , time , name , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: name,
      });
    } else {

      try{
        await getApiParams(req , time , name , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: name,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.getHistoricalLogs = async (req, res) => {
  const time = new Date().getTime();
  try {
    const historicalLogs = await helper.nonFungibleTokenCommon("getHistoricalLogs", req.query);
    if (
      historicalLogs.valid !== undefined ||
      historicalLogs.error !== undefined ||
      historicalLogs.message !== undefined ||
      historicalLogs.code !== undefined
    ) {

      try{
        await getApiParams(req , time , historicalLogs , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: historicalLogs,
      });
    } else {

      try{
        await getApiParams(req , time , historicalLogs , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: historicalLogs,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.getNFTOwnerOf = async (req, res) => {
  const time = new Date().getTime();
  try {
    const owner = await helper.nonFungibleTokenCommon("getNFTOwnerOf", req.query);
    if (
      owner.valid !== undefined ||
      owner.error !== undefined ||
      owner.message !== undefined ||
      owner.code !== undefined
    ) {

      try{
        await getApiParams(req , time , owner , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: owner,
      });
    } else {

      try{
        await getApiParams(req , time , owner , errorMessages , 'success');  
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: owner,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.getNFTMetadata = async (req, res) => {
  const time = new Date().getTime();
  try {
    const symbol = await helper.nonFungibleTokenCommon("getNFTMetadata", req.query);
    if (
      symbol.valid !== undefined ||
      symbol.error !== undefined ||
      symbol.message !== undefined ||
      symbol.code !== undefined
    ) {

      try{
        await getApiParams(req , time , symbol , errorMessages , 'failed');  
      }
      catch(err){
        console.log(err);
      }
      
      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: symbol,
      });
    } else {

      try{
        await getApiParams(req , time , symbol , errorMessages , 'success');  
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: symbol,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};
