const helper = require("../middlewares/helper");
const errorMessages = require("../../../common/configuration/errorMessage.json");
const config = require("../../../common/configuration/config.json");
const { getApiParams , postApiParams } = require("../../../common/dynamo");

exports.getYieldBalance = async (req, res) => {
  const time = new Date().getTime();
  try {
    const balance = await helper.yieldAggregatorCommon("getBalance", req.query);
    if (
      balance.valid !== undefined ||
      balance.error !== undefined ||
      balance.message !== undefined ||
      balance.code !== undefined
    ) {

      try{
        await getApiParams(req , time , balance , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : balance
      });
    } else {

      try{
        await getApiParams(req , time , balance , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: balance,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.getYieldVault = async (req, res) => {
  const time = new Date().getTime();
  try {
    // Default for ethereum
    req.query.chainId = req.query.chainId ? req.query.chainId : '1';
    req.query.rpc = config.chains[req.query.chainId].getVaultYearnRpc;
    const vaults = await helper.yieldAggregatorCommon("getVaults", req.query);
    if (
      vaults.valid !== undefined ||
      vaults.error !== undefined ||
      vaults.message !== undefined ||
      vaults.code !== undefined
    ) {

      try{
        await getApiParams(req , time , vaults , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : vaults
      });
    } else {

      try{
        await getApiParams(req , time , vaults , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: vaults,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.postYieldDepositVault = async (req, res) => {
  const time = new Date().getTime();
  try {
    const deposit = await helper.yieldAggregatorCommon("depositVault", req.body);
    if (
      deposit.valid !== undefined ||
      deposit.error !== undefined ||
      deposit.message !== undefined ||
      deposit.code !== undefined
    ) {

      try{
        await postApiParams(req , time , deposit , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : deposit
      });
    } else {

      try{
        await postApiParams(req , time , deposit , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: deposit,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.postYieldDepositPool = async (req, res) => {
  const time = new Date().getTime();
  try {
    const depositPool = await helper.yieldAggregatorCommon(
      "depositPool",
      req.body
    );
    if (
      depositPool.valid !== undefined ||
      depositPool.error !== undefined ||
      depositPool.message !== undefined ||
      depositPool.code !== undefined
    ) {

      try{
        await postApiParams(req , time , depositPool , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : depositPool
      });
    } else {

      try{
        await postApiParams(req , time , depositPool , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: depositPool,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.postYieldWithdrawPool = async (req, res) => {
  const time = new Date().getTime();
  try {
    const withdraw = await helper.yieldAggregatorCommon("withdrawPool", req.body);
    if (
      withdraw.valid !== undefined ||
      withdraw.error !== undefined ||
      withdraw.message !== undefined ||
      withdraw.code !== undefined
    ) {

      try{
        await postApiParams(req , time , withdraw , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : withdraw
      });
    } else {

      try{
        await postApiParams(req , time , withdraw , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: withdraw,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.postYieldWithdrawVault = async (req, res) => {
  const time = new Date().getTime();
  try {
    const withdrawVault = await helper.yieldAggregatorCommon(
      "withdrawVault",
      req.body
    );
    if (
      withdrawVault.valid !== undefined ||
      withdrawVault.error !== undefined ||
      withdrawVault.message !== undefined ||
      withdrawVault.code !== undefined
    ) {

      try{
        await postApiParams(req , time , withdrawVault , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : withdrawVault
      });
    } else {

      try{
        await postApiParams(req , time , withdrawVault , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: withdrawVault,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};
