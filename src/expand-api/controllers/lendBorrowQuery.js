const helper = require("../middlewares/helper");
const errorMessages = require("../../../common/configuration/errorMessage.json");
const { getApiParams , postApiParams} = require("../../../common/dynamo");

// LENDBORROW QUERY
exports.getLendBorrowPool = async (req, res) => {
  const time = new Date().getTime();
  try {
    const pool = await helper.lendBorrowCommon("getPool", req.query);
    if (
      pool.valid !== undefined ||
      pool.error !== undefined ||
      pool.message !== undefined ||
      pool.code !== undefined
    ) {

      try{
        await getApiParams(req , time , pool , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }


      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : pool
      });
    } else {

      try{
        await getApiParams(req , time , pool , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: pool,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.getLendBorrowPools = async (req, res) => {
  const time = new Date().getTime();
  try {
    const pool = await helper.lendBorrowCommon("getPools", await helper.assetsStringToArray(req.query));
    if (
      pool.valid !== undefined ||
      pool.error !== undefined ||
      pool.message !== undefined ||
      pool.code !== undefined
    ) {

      try{
        await getApiParams(req , time , pool , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : pool
      });
    } else {

      try{
        await getApiParams(req , time , pool , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }


      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: pool,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.getUserAccountData = async (req, res) => {
  const time = new Date().getTime();
  try {
    const repayAmount = await helper.lendBorrowCommon("getUserAccountData", req.query);
    if (
      repayAmount.valid !== undefined ||
      repayAmount.error !== undefined ||
      repayAmount.message !== undefined ||
      repayAmount.code !== undefined
    ) {

      try{
        await getApiParams(req , time , repayAmount , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }


      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : repayAmount
      });
    } else {

      try{
        await getApiParams(req , time , repayAmount , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: repayAmount,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};


exports.getRepayAmount = async (req, res) => {
  const time = new Date().getTime();
  try {
    const repayAmount = await helper.lendBorrowCommon("getRepayAmount", req.query);
    if (
      repayAmount.valid !== undefined ||
      repayAmount.error !== undefined ||
      repayAmount.message !== undefined ||
      repayAmount.code !== undefined
    ) {

      try{
        await getApiParams(req , time , repayAmount , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }


      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : repayAmount
      });
    } else {

      try{
        await getApiParams(req , time , repayAmount , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: repayAmount,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.getAssetInfo = async (req, res) => {
  const time = new Date().getTime();
  try {
    const repayAmount = await helper.lendBorrowCommon("getAssetInfo", req.query);
    if (
      repayAmount.valid !== undefined ||
      repayAmount.error !== undefined ||
      repayAmount.message !== undefined ||
      repayAmount.code !== undefined
    ) {

      try{
        await getApiParams(req , time , repayAmount , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }


      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : repayAmount
      });
    } else {

      try{
        await getApiParams(req , time , repayAmount , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: repayAmount,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.getBorrowAmount = async (req, res) => {
  const time = new Date().getTime();
  try {
    const borrowAmount = await helper.lendBorrowCommon("getBorrowAmount", req.query);
    if (
      borrowAmount.valid !== undefined ||
      borrowAmount.error !== undefined ||
      borrowAmount.message !== undefined ||
      borrowAmount.code !== undefined
    ) {

      try{
        await getApiParams(req , time , borrowAmount , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : borrowAmount
      });
    } else {

      try{
        await getApiParams(req , time , borrowAmount , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: borrowAmount,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.getGovernerData = async (req, res) => {
  const time = new Date().getTime();
  try {
    const governer = await helper.lendBorrowCommon("governer", req.query);
    if (
      governer.valid !== undefined ||
      governer.error !== undefined ||
      governer.message !== undefined ||
      governer.code !== undefined
    ) {

      try{
        await getApiParams(req , time , governer , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : governer
      });
    } else {

      try{
        await getApiParams(req , time , governer , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: governer,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.getMaxAmounts = async (req, res) => {
  const time = new Date().getTime();
  try {
    const governer = await helper.lendBorrowCommon("getMaxAmounts", req.query);
    if (
      governer.valid !== undefined ||
      governer.error !== undefined ||
      governer.message !== undefined ||
      governer.code !== undefined
    ) {

      try{
        await getApiParams(req , time , governer , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : governer
      });
    } else {

      try{
        await getApiParams(req , time , governer , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: governer,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.getClaimedRewards = async (req, res) => {
  const time = new Date().getTime();
  try {
    const getClaimedRewards = await helper.lendBorrowCommon("getClaimedRewards", req.query);
    if (
      getClaimedRewards.valid !== undefined ||
      getClaimedRewards.error !== undefined ||
      getClaimedRewards.message !== undefined ||
      getClaimedRewards.code !== undefined
    ) {

      try{
        await getApiParams(req , time , getClaimedRewards , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : getClaimedRewards
      });
    } else {

      try{
        await getApiParams(req , time , getClaimedRewards , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: getClaimedRewards,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

// LENDBORROW TRANSACTION

exports.postBorrow = async (req, res) => {
  const time = new Date().getTime();
  try {
    const borrow = await helper.lendBorrowCommon("borrow", req.body);
    if (
      borrow.valid !== undefined ||
      borrow.error !== undefined ||
      borrow.message !== undefined ||
      borrow.code !== undefined
    ) {

      try{
        await postApiParams(req , time , borrow , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : borrow
      });
    } else {

      try{
        await postApiParams(req , time , borrow , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: borrow,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.postDeposit = async (req, res) => {
  const time = new Date().getTime();
  try {
    const deposit = await helper.lendBorrowCommon("deposit", req.body);
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

exports.postBundleActions = async (req, res) => {
  const time = new Date().getTime();
  try {
    const deposit = await helper.lendBorrowCommon("bundleActions", req.body);
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

exports.claimRewards = async (req, res) => {
  const time = new Date().getTime();
  try {
    const claimRewards = await helper.lendBorrowCommon("claimRewards", req.body);
    if (
      claimRewards.valid !== undefined ||
      claimRewards.error !== undefined ||
      claimRewards.message !== undefined ||
      claimRewards.code !== undefined
    ) {

      try{
        await postApiParams(req , time , claimRewards , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : claimRewards
      });
    } else {

      try{
        await postApiParams(req , time , claimRewards , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: claimRewards,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.transfer = async (req, res) => {
  const time = new Date().getTime();
  try {
    const transfer = await helper.lendBorrowCommon("transfer", req.body);
    if (
      transfer.valid !== undefined ||
      transfer.error !== undefined ||
      transfer.message !== undefined ||
      transfer.code !== undefined
    ) {

      try{
        await postApiParams(req , time , transfer , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : transfer
      });
    } else {

      try{
        await postApiParams(req , time , transfer , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: transfer,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.allow = async (req, res) => {
  const time = new Date().getTime();
  try {
    const allow = await helper.lendBorrowCommon("allow", req.body);
    if (
      allow.valid !== undefined ||
      allow.error !== undefined ||
      allow.message !== undefined ||
      allow.code !== undefined
    ) {

      try{
        await postApiParams(req , time , allow , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : allow
      });
    } else {

      try{
        await postApiParams(req , time , allow , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: allow,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.postLiquidate = async (req, res) => {
  const time = new Date().getTime();
  try {
    const liquidate = await helper.lendBorrowCommon("liquidate", req.body);
    if (
      liquidate.valid !== undefined ||
      liquidate.error !== undefined ||
      liquidate.message !== undefined ||
      liquidate.code !== undefined
    ) {

      try{
        await postApiParams(req , time , liquidate , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : liquidate
      });
    } else {

      try{
        await postApiParams(req , time , liquidate , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: liquidate,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.postRepay = async (req, res) => {
  const time = new Date().getTime();
  try {
    const repay = await helper.lendBorrowCommon("repay", req.body);
    if (
      repay.valid !== undefined ||
      repay.error !== undefined ||
      repay.message !== undefined ||
      repay.code !== undefined
    ) {

      try{
        await postApiParams(req , time , repay , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : repay
      });
    } else {

      try{
        await postApiParams(req , time , repay , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: repay,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.postWithdraw = async (req, res) => {
  const time = new Date().getTime();
  try {
    const withdraw = await helper.lendBorrowCommon("withdraw", req.body);
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

exports.postEnterMarket = async (req, res) => {
  const time = new Date().getTime();
  try {
    const enterMarket = await helper.lendBorrowCommon("enterMarket", req.body);
    if (
      enterMarket.valid !== undefined ||
      enterMarket.error !== undefined ||
      enterMarket.message !== undefined ||
      enterMarket.code !== undefined
    ) {

      try{
        await postApiParams(req , time , enterMarket , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : enterMarket
      });
    } else {

      try{
        await postApiParams(req , time , enterMarket , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: enterMarket,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.postExitMarket = async (req, res) => {
  const time = new Date().getTime();
  try {
    const enterMarket = await helper.lendBorrowCommon("exitMarket", req.body);
    if (
      enterMarket.valid !== undefined ||
      enterMarket.error !== undefined ||
      enterMarket.message !== undefined ||
      enterMarket.code !== undefined
    ) {

      try{
        await postApiParams(req , time , enterMarket , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : enterMarket
      });
    } else {

      try{
        await postApiParams(req , time , enterMarket , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: enterMarket,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.exitIsolationMode = async (req, res) => {
  const time = new Date().getTime();
  try {
    const exitIsolationMode = await helper.lendBorrowCommon("exitIsolationMode", req.body);
    if (
      exitIsolationMode.valid !== undefined ||
      exitIsolationMode.error !== undefined ||
      exitIsolationMode.message !== undefined ||
      exitIsolationMode.code !== undefined
    ) {

      try{
        await postApiParams(req , time , exitIsolationMode , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : exitIsolationMode
      });
    } else {

      try{
        await postApiParams(req , time , exitIsolationMode , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: exitIsolationMode,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.setUserEMode = async (req, res) => {
  const time = new Date().getTime();
  try {
    const setUserEMode = await helper.lendBorrowCommon("setUserEMode", req.body);
    if (
      setUserEMode.valid !== undefined ||
      setUserEMode.error !== undefined ||
      setUserEMode.message !== undefined ||
      setUserEMode.code !== undefined
    ) {

      try{
        await postApiParams(req , time , setUserEMode , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : setUserEMode
      });
    } else {

      try{
        await postApiParams(req , time , setUserEMode , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: setUserEMode,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.postMigrate = async (req, res) => {
  const time = new Date().getTime();
  try {
    const migrate = await helper.lendBorrowCommon("migrate", req.body);
    if (
      migrate.valid !== undefined ||
      migrate.error !== undefined ||
      migrate.message !== undefined ||
      migrate.code !== undefined
    ) {

      try{
        await postApiParams(req , time , migrate , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : migrate
      });
    } else {

      try{
        await postApiParams(req , time , migrate , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: migrate,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.getLendBorrowEnterMarketStatus = async (req, res) => {
  const time = new Date().getTime();
  try {
    const pool = await helper.lendBorrowCommon("enterMarketStatus",req.query);
    if (
      pool.valid !== undefined ||
      pool.error !== undefined ||
      pool.message !== undefined ||
      pool.code !== undefined
    ) {

      try{
        await getApiParams(req , time , pool , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }


      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : pool
      });
    } else {

      try{
        await getApiParams(req , time , pool , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: pool,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.getUserPositions = async (req, res) => {
  const time = new Date().getTime();
  try {
    const pool = await helper.lendBorrowCommon("getUserPositions",req.query);
    if (
      pool.valid !== undefined ||
      pool.error !== undefined ||
      pool.message !== undefined ||
      pool.code !== undefined
    ) {

      try{
        await getApiParams(req , time , pool , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }


      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : pool
      });
    } else {

      try{
        await getApiParams(req , time , pool , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: pool,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};
