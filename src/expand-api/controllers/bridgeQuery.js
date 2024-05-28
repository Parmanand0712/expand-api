const helper = require('../middlewares/helper');
const errorMessages = require("../../../common/configuration/errorMessage.json");
const { getApiParams, postApiParams } = require("../../../common/dynamo");

exports.getBridgeLiquidity = async (req, res) => {
  const time = new Date().getTime();
  try {
    const response = await helper.bridgeCommon("getLiquidity", req.query);
    if (
      response.valid !== undefined ||
      response.error !== undefined ||
      response.message !== undefined ||
      response.code !== undefined
    ) {

      try {
        await getApiParams(req, time, response, errorMessages, 'failed');
      }
      catch (err) {
        console.log(err);
      }
      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: response
      });
    } else {

      try {
        await getApiParams(req, time, response, errorMessages, 'success');
      }
      catch (err) {
        console.log(err);
      }
      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: response,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.bridgeSwap = async (req, res) => {
  const time = new Date().getTime();
  try {
    const response = await helper.bridgeCommon("swap", req.body);
    if (
      response.valid !== undefined ||
      response.error !== undefined ||
      response.message !== undefined ||
      response.code !== undefined
    ) {

      try {
        await postApiParams(req, time, response, errorMessages, 'failed');
      }
      catch (err) {
        console.log(err);
      }
      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: response
      });
    } else {

      try {
        await postApiParams(req, time, response, errorMessages, 'success');
      }
      catch (err) {
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: response,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }

};

exports.addBridgeLiquidity = async (req, res) => {
  const time = new Date().getTime();
  try {
    const response = await helper.bridgeCommon("addLiquidity", req.body);
    if (
      response.valid !== undefined ||
      response.error !== undefined ||
      response.message !== undefined ||
      response.code !== undefined
    ) {

      try {
        await postApiParams(req, time, response, errorMessages, 'failed');
      }
      catch (err) {
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: response
      });
    } else {

      try {
        await postApiParams(req, time, response, errorMessages, 'success');
      }
      catch (err) {
        console.log(err);
      }
      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: response,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }

};

exports.removeBridgeLiquidity = async (req, res) => {
  const time = new Date().getTime();
  try {
    const response = await helper.bridgeCommon("removeLiquidity", req.body);
    if (
      response.valid !== undefined ||
      response.error !== undefined ||
      response.message !== undefined ||
      response.code !== undefined
    ) {

      try {
        await postApiParams(req, time, response, errorMessages, 'failed');
      }
      catch (err) {
        console.log(err);
      }
      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: response
      });
    } else {

      try {
        await postApiParams(req, time, response, errorMessages, 'success');
      }
      catch (err) {
        console.log(err);
      }
      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: response,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }

};

exports.getBridgeTransaction = async (req, res) => {
  const time = new Date().getTime();
  try {
    const response = await helper.bridgeCommon("getTransaction", req.query);
    if (
      response.valid !== undefined ||
      response.error !== undefined ||
      response.message !== undefined ||
      response.code !== undefined
    ) {

      try {
        await getApiParams(req, time, response, errorMessages, 'failed');
      }
      catch (err) {
        console.log(err);
      }
      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: response
      });
    } else {

      try {
        await getApiParams(req, time, response, errorMessages, 'success');
      }
      catch (err) {
        console.log(err);
      }
      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: response,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }

};

exports.getBridgePrice = async (req, res) => {
  const time = new Date().getTime();
  try {
    const response = await helper.bridgeCommon("getPrice", req.query);
    if (
      response.valid !== undefined ||
      response.error !== undefined ||
      response.message !== undefined ||
      response.code !== undefined
    ) {
      try {
        await getApiParams(req, time, response, errorMessages, 'failed');
      }
      catch (err) {
        console.log(err);
      }
      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: response
      });
    } else {

      try {
        await getApiParams(req, time, response, errorMessages, 'success');
      }
      catch (err) {
        console.log(err);
      }
      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: response,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.getBridgeRoute = async (req, res) => {
  const time = new Date().getTime();
  try {
    const response = await helper.bridgeCommon("getRoute", req.query);
    if (
      response.valid !== undefined ||
      response.error !== undefined ||
      response.message !== undefined ||
      response.code !== undefined
    ) {
      try {
        await getApiParams(req, time, response, errorMessages, 'failed');
      }
      catch (err) {
        console.log(err);
      }
      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: response
      });
    } else {

      try {
        await getApiParams(req, time, response, errorMessages, 'success');
      }
      catch (err) {
        console.log(err);
      }
      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: response,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.getBridgeChainsSupported = async (req, res) => {
  const time = new Date().getTime();
  try {
    const response = await helper.bridgeCommon("getChainsSupported", req.query);
    if (
      response.valid !== undefined ||
      response.error !== undefined ||
      response.message !== undefined ||
      response.code !== undefined
    ) {
      try {
        await getApiParams(req, time, response, errorMessages, 'failed');
      }
      catch (err) {
        console.log(err);
      }
      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: response
      });
    } else {

      try {
        await getApiParams(req, time, response, errorMessages, 'success');
      }
      catch (err) {
        console.log(err);
      }
      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: response,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.getBridgeTokensSupported = async (req, res) => {
  const time = new Date().getTime();
  try {
    const response = await helper.bridgeCommon("getTokensSupported", req.query);
    if (
      response.valid !== undefined ||
      response.error !== undefined ||
      response.message !== undefined ||
      response.code !== undefined
    ) {
      try {
        await getApiParams(req, time, response, errorMessages, 'failed');
      }
      catch (err) {
        console.log(err);
      }
      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: response
      });
    } else {

      try {
        await getApiParams(req, time, response, errorMessages, 'success');
      }
      catch (err) {
        console.log(err);
      }
      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: response,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};
