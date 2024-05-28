const helper = require("../middlewares/helper");
const errorMessages = require("../../../common/configuration/errorMessage.json");
const { getApiParams, postApiParams } = require('../../../common/dynamo');

exports.getUsersOps = async (req, res) => {
  const time = new Date().getTime();
  try {
    const userOps = await helper.accountAbstractionCommon("getUserOps", req.query);
    if (
      userOps.valid !== undefined ||
      userOps.error !== undefined ||
      userOps.message !== undefined ||
      userOps.code !== undefined
    ) {
      try {
        await getApiParams(req, time, userOps, errorMessages, 'failed');
      }
      catch (err) {
        console.log(err);
      }
      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: userOps,
      });
    } else {
      try {
        await getApiParams(req, time, userOps, errorMessages, 'success');
      }
      catch (err) {
        console.log(err);
      }
      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: userOps,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.getSignatureMessage = async (req, res) => {
  const time = new Date().getTime();
  try {
    const signature = await helper.accountAbstractionCommon("getSignatureMessage", req.query);
    if (
      signature.valid !== undefined ||
      signature.error !== undefined ||
      signature.message !== undefined ||
      signature.code !== undefined
    ) {
      try {
        await getApiParams(req, time, signature, errorMessages, 'failed');
      }
      catch (err) {
        console.log(err);
      }
      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: signature,
      });
    } else {
      try {
        await getApiParams(req, time, signature, errorMessages, 'success');
      }
      catch (err) {
        console.log(err);
      }
      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: signature,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.sendUsersOps = async (req, res) => {
  const time = new Date().getTime();
  try {
    const userOps = await helper.accountAbstractionCommon("sendUserOps", req.body);
    if (
      userOps.valid !== undefined ||
      userOps.error !== undefined ||
      userOps.message !== undefined ||
      userOps.code !== undefined
    ) {

      try {
        await postApiParams(req, time, userOps, errorMessages, 'failed');
      }
      catch (err) {
        console.log(err);
      }
      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: userOps
      });
    } else {

      try {
        await getApiParams(req, time, userOps, errorMessages, 'success');
      }
      catch (err) {
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: userOps,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.getPaymasterData = async (req, res) => {
  const time = new Date().getTime();
  try {
    const paymasterData = await helper.accountAbstractionCommon("getPaymasterData", req.query);
    if (
      paymasterData.valid !== undefined ||
      paymasterData.error !== undefined ||
      paymasterData.message !== undefined ||
      paymasterData.code !== undefined
    ) {

      try {
        await getApiParams(req, time, paymasterData, errorMessages, 'failed');
      }
      catch (err) {
        console.log(err);
      }
      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: paymasterData
      });
    } else {

      try {
        await getApiParams(req, time, paymasterData, errorMessages, 'success');
      }
      catch (err) {
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: paymasterData,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};
