const Web3 = require("../../../common/intialiseWeb3");
const { getApiParams , postApiParams } = require("../../../common/dynamo");

const {
  convertBaseToPeggedToken,
  convertBaseToProtocolToken,
  convertPeggedToProtocolToken,
  convertProtocolToBaseToken,
  convertProtocolToPeggedToken,
  getPrice,
  liquidate,
  withdrawPeggedToken,
  depositPeggedToken
} = require("../../expand/synthetic/index");

const errorMessages = require("../../../common/configuration/errorMessage.json");

exports.getPrice = async (req, res) => {
  const time = new Date().getTime();
  try {
    const web3 = await Web3.initialiseWeb3(req.query);
    const price = await getPrice(web3, req.query);
    if (
      price.valid !== undefined ||
      price.error !== undefined ||
      price.message !== undefined ||
      price.code !== undefined
    ) {

      try{
        await getApiParams(req , time , price , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: price,
      });
    } else {

      try{
        await getApiParams(req , time , price , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: price,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.postConvertBaseToPeggedToken = async (req, res) => {
  const time = new Date().getTime();
  try {
    const web3 = await Web3.initialiseWeb3(req.body);
    const convertedToken = await convertBaseToPeggedToken(web3, req.body);
    if (
      convertedToken.valid !== undefined ||
      convertedToken.error !== undefined ||
      convertedToken.message !== undefined ||
      convertedToken.code !== undefined
    ) {

      try{
        await postApiParams(req , time , convertedToken , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: convertedToken,
      });
    } else {

      try{
        await postApiParams(req , time , convertedToken , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: convertedToken,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.postConvertBaseToProtocolToken = async (req, res) => {
  const time = new Date().getTime();
  try {
    const web3 = await Web3.initialiseWeb3(req.body);
    const convertedToken = await convertBaseToProtocolToken(web3, req.body);
    if (
      convertedToken.valid !== undefined ||
      convertedToken.error !== undefined ||
      convertedToken.message !== undefined ||
      convertedToken.code !== undefined
    ) {

      try{
        await postApiParams(req , time , convertedToken , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: convertedToken,
      });
    } else {

      try{
        await postApiParams(req , time , convertedToken , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: convertedToken,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.postConvertPeggedToProtocolToken = async (req, res) => {
  const time = new Date().getTime();
  try {
    const web3 = await Web3.initialiseWeb3(req.body);
    const convertedToken = await convertPeggedToProtocolToken(web3, req.body);
    if (
      convertedToken.valid !== undefined ||
      convertedToken.error !== undefined ||
      convertedToken.message !== undefined ||
      convertedToken.code !== undefined
    ) {

      try{
        await postApiParams(req , time , convertedToken , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: convertedToken,
      });
    } else {

      try{
        await postApiParams(req , time , convertedToken , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: convertedToken,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.postConvertProtocolToBaseToken = async (req, res) => {
  const time = new Date().getTime();
  try {
    const web3 = await Web3.initialiseWeb3(req.body);
    const convertedToken = await convertProtocolToBaseToken(web3, req.body);
    if (
      convertedToken.valid !== undefined ||
      convertedToken.error !== undefined ||
      convertedToken.message !== undefined ||
      convertedToken.code !== undefined
    ) {

      try{
        await postApiParams(req , time , convertedToken , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: convertedToken,
      });
    } else {

      try{
        await postApiParams(req , time , convertedToken , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: convertedToken,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.postConvertProtocolToPeggedToken = async (req, res) => {
  const time = new Date().getTime();
  try {
    const web3 = await Web3.initialiseWeb3(req.body);
    const convertedToken = await convertProtocolToPeggedToken(web3, req.body);
    if (
      convertedToken.valid !== undefined ||
      convertedToken.error !== undefined ||
      convertedToken.message !== undefined ||
      convertedToken.code !== undefined
    ) {

      try{
        await postApiParams(req , time , convertedToken , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: convertedToken,
      });
    } else {

      try{
        await postApiParams(req , time , convertedToken , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: convertedToken,
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
    const web3 = await Web3.initialiseWeb3(req.body);
    const liquidates = await liquidate(web3, req.body);
    if (
      liquidates.valid !== undefined ||
      liquidates.error !== undefined ||
      liquidates.message !== undefined ||
      liquidates.code !== undefined
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
        error: liquidates,
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
        data: liquidates,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.postWithdrawPeggedToken = async (req, res) => {
  const time = new Date().getTime();
  try {
    const web3 = await Web3.initialiseWeb3(req.body);
    const withdrawPegged = await withdrawPeggedToken(web3, req.body);
    if (
      withdrawPegged.valid !== undefined ||
      withdrawPegged.error !== undefined ||
      withdrawPegged.message !== undefined ||
      withdrawPegged.code !== undefined
    ) {

      try{
        await postApiParams(req , time , withdrawPegged , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: withdrawPegged,
      });
    } else {

      try{
        await postApiParams(req , time , withdrawPegged , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: withdrawPegged,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.postDepositPeggedToken = async (req, res) => {
  const time = new Date().getTime();
  try {
    const web3 = await Web3.initialiseWeb3(req.body);
    const depositPegged = await depositPeggedToken(web3, req.body);
    if (
      depositPegged.valid !== undefined ||
      depositPegged.error !== undefined ||
      depositPegged.message !== undefined ||
      depositPegged.code !== undefined
    ) {

      try{
        await postApiParams(req , time , depositPegged , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: depositPegged,
      });
    } else {

      try{
        await postApiParams(req , time , depositPegged , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: depositPegged,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

