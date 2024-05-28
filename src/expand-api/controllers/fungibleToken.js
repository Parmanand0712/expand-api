const helper = require("../middlewares/helper");
const errorMessages = require("../../../common/configuration/errorMessage.json");
const { getApiParams, postApiParams } = require("../../../common/dynamo");

exports.getName = async (req, res) => {
  const time = new Date().getTime();
  try {
    const name = await helper.fungibleTokenCommon("getName", req.query);
    if (
      name.valid !== undefined ||
      name.error !== undefined ||
      name.message !== undefined ||
      name.code !== undefined
    ) {

      try {
        await getApiParams(req, time, name, errorMessages, 'failed');

      }
      catch (err) {
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: name,
      });
    } else {

      try {
        await getApiParams(req, time, name, errorMessages, 'success');

      }
      catch (err) {
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

exports.getSymbol = async (req, res) => {
  const time = new Date().getTime();
  try {
    const symbol = await helper.fungibleTokenCommon("getSymbol", req.query);
    if (
      symbol.valid !== undefined ||
      symbol.error !== undefined ||
      symbol.message !== undefined ||
      symbol.code !== undefined
    ) {

      try {
        await getApiParams(req, time, symbol, errorMessages, 'failed');

      }
      catch (err) {
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: symbol,
      });
    } else {

      try {
        await getApiParams(req, time, symbol, errorMessages, 'success');

      }
      catch (err) {
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

exports.getDecimal = async (req, res) => {
  const time = new Date().getTime();
  try {
    const decimal = await helper.fungibleTokenCommon("getDecimals", req.query);
    if (
      decimal.valid !== undefined ||
      decimal.error !== undefined ||
      decimal.message !== undefined ||
      decimal.code !== undefined
    ) {

      try {
        await getApiParams(req, time, decimal, errorMessages, 'failed');

      }
      catch (err) {
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: decimal,
      });
    } else {

      try {
        await getApiParams(req, time, decimal, errorMessages, 'success');

      }
      catch (err) {
        console.log(err);
      }
      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: decimal,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.getTokenDetails = async (req, res) => {
  const time = new Date().getTime();
  try {
    const tokenDetails = await helper.fungibleTokenCommon("getTokenDetails", req.query);
    if (
      tokenDetails.valid !== undefined ||
      tokenDetails.error !== undefined ||
      tokenDetails.message !== undefined ||
      tokenDetails.code !== undefined
    ) {

      try {
        await getApiParams(req, time, tokenDetails, errorMessages, 'failed');
      }
      catch (err) {
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: tokenDetails,
      });
    } else {

      try {
        await getApiParams(req, time, tokenDetails, errorMessages, 'success');
      }
      catch (err) {
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: tokenDetails,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.postApprove = async (req, res) => {
  const time = new Date().getTime();
  try {
    const approve = await helper.fungibleTokenCommon("approve", req.body);
    if (
      approve.valid !== undefined ||
      approve.error !== undefined ||
      approve.message !== undefined ||
      approve.code !== undefined
    ) {

      try {
        await postApiParams(req, time, approve, errorMessages, 'failed');

      }
      catch (err) {
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: approve,
      });
    } else {

      try {
        await postApiParams(req, time, approve, errorMessages, 'success');

      }
      catch (err) {
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: approve,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.postTransfer = async (req, res) => {
  const time = new Date().getTime();
  try {
    const transfer = await helper.fungibleTokenCommon("transfer", req.body);
    if (
      transfer.valid !== undefined ||
      transfer.error !== undefined ||
      transfer.message !== undefined ||
      transfer.code !== undefined
    ) {

      try {
        await postApiParams(req, time, transfer, errorMessages, 'failed');

      }
      catch (err) {
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: transfer,
      });
    } else {

      try {
        await postApiParams(req, time, transfer, errorMessages, 'success');

      }
      catch (err) {
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

exports.postTransferForm = async (req, res) => {
  const time = new Date().getTime();
  try {
    const transferFrom = await helper.fungibleTokenCommon("transferFrom", req.body);
    if (
      transferFrom.valid !== undefined ||
      transferFrom.error !== undefined ||
      transferFrom.message !== undefined ||
      transferFrom.code !== undefined
    ) {

      try {
        await postApiParams(req, time, transferFrom, errorMessages, 'failed');

      }
      catch (err) {
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: transferFrom,
      });
    } else {

      try {
        await postApiParams(req, time, transferFrom, errorMessages, 'success');

      }
      catch (err) {
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: transferFrom,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.postConvertWrapTokenToBaseToken = async (req, res) => {
  const time = new Date().getTime();
  try {
    const covertToken = await helper.fungibleTokenCommon(
      "convertWrapTokenToBaseToken",
      req.body
    );
    if (
      covertToken.valid !== undefined ||
      covertToken.error !== undefined ||
      covertToken.message !== undefined ||
      covertToken.code !== undefined
    ) {

      try {
        await postApiParams(req, time, covertToken, errorMessages, 'failed');

      }
      catch (err) {
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: covertToken,
      });
    } else {

      try {
        await postApiParams(req, time, covertToken, errorMessages, 'success');

      }
      catch (err) {
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: covertToken,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.postBaseTokenToWrapToken = async (req, res) => {
  const time = new Date().getTime();
  try {
    const covertToken = await helper.fungibleTokenCommon(
      "convertBaseTokenToWrapToken",
      req.body
    );
    if (
      covertToken.valid !== undefined ||
      covertToken.error !== undefined ||
      covertToken.message !== undefined ||
      covertToken.code !== undefined
    ) {

      try {
        await postApiParams(req, time, covertToken, errorMessages, 'failed');

      }
      catch (err) {
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: covertToken,
      });
    } else {

      try {
        await postApiParams(req, time, covertToken, errorMessages, 'success');

      }
      catch (err) {
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: covertToken,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};

exports.getUserAllowance = async (req, res) => {
  const time = new Date().getTime();
  try {
    const name = await helper.fungibleTokenCommon("getUserAllowance", req.query);
    if (name.valid !== undefined || name.error !== undefined || name.message !== undefined || name.code !== undefined) {

      try {
        await getApiParams(req, time, time, errorMessages, 'failed');

      }
      catch (err) {
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: name,
      });
    } else {

      try {
        await getApiParams(req, time, name, errorMessages, 'success');

      }
      catch (err) {
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

exports.getUserBalance = async (req, res) => {
  const time = new Date().getTime();
  try {
    const name = await helper.fungibleTokenCommon("getUserBalance", req.query);
    if (name.valid !== undefined || name.error !== undefined || name.message !== undefined || name.code !== undefined) {

      try {
        await getApiParams(req, time, name, errorMessages, 'failed');

      }
      catch (err) {
        console.log(err);
      }
      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: name,
      });
    } else {
      try {
        await getApiParams(req, time, name, errorMessages, 'success');

      }
      catch (err) {
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

exports.getHistoricalTransactions = async (req, res) => {
  const time = new Date().getTime();
  try {
    const historicalTransactions = await helper.fungibleTokenCommon("getHistoricalTransactions", req.query);
    if (historicalTransactions.valid !== undefined || historicalTransactions.error !== undefined
      || historicalTransactions.message !== undefined || historicalTransactions.code !== undefined) {

      try {
        await getApiParams(req, time, historicalTransactions, errorMessages, 'failed');

      }
      catch (err) {
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: historicalTransactions,
      });
    } else {

      try {
        await getApiParams(req, time, historicalTransactions, errorMessages, 'success');

      }
      catch (err) {
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

exports.getHistoricalLogs = async (req, res) => {
  const time = new Date().getTime();
  try {
    const historicalLogs = await helper.fungibleTokenCommon("getHistoricalLogs", req.query);
    if (historicalLogs.valid !== undefined || historicalLogs.error !== undefined
      || historicalLogs.message !== undefined || historicalLogs.code !== undefined) {

      try {
        await getApiParams(req, time, historicalLogs, errorMessages, 'failed');

      }
      catch (err) {
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: historicalLogs,
      });
    } else {

      try {
        await getApiParams(req, time, historicalLogs, errorMessages, 'success');

      }
      catch (err) {
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
