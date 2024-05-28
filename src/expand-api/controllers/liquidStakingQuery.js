const helper = require("../middlewares/helper");
const errorMessages = require("../../../common/configuration/errorMessage.json");
const { getApiParams, postApiParams } = require("../../../common/dynamo");

const throwServerError = () => ({
  status: errorMessages.statusCodes.serverError,
  msg: errorMessages.api.serverErrorMesssage,
});


const helperValidation = async (req, res, data, method) => {
  const time = new Date().getTime();
  const { valid, error, message, code } = data;

  let status = 'success';
  if (
    valid !== undefined ||
    error !== undefined ||
    message !== undefined ||
    code !== undefined
  ) {
    status = 'failed';
  } 

  try {
    if (method === 'GET')
      await getApiParams(req, time, data, errorMessages, status);
    else postApiParams(req, time, data, errorMessages, status);
  }
  catch (err) {
    console.log(err);
  }
  return res.status(errorMessages.statusCodes[status]).json({
    status: errorMessages.statusCodes[status],
    msg: status === "success" ? errorMessages.api.successMessage : errorMessages.api.queryErrorMessage,
    data,
  });
};

exports.getDataByAction = async (req, res) => {
  const { action, method } = req;
  try {
    const data = await helper.liquidStakingCommon(action, method === 'GET' ? req.query : req.body);
    return helperValidation(req, res, data, method);
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json(throwServerError());
  }
};

exports.liquidStakingController = async (req, res, next) => {
  const route = req.route.path.split('/');

  req.method = 'GET';
  switch (route[route.length - 1]) {
    case 'getstake':
      req.action = 'getStake';
      break;
    case 'getapr':
      req.action = 'getAPR';
      break;
    case 'getwithdrawalrequests':
        req.action = 'getwithdrwalrequests';
        break;
    case 'getwithdrawalstatus':
        req.action = 'getwithdrwalstatus';
        break;
    case 'getprotocolapr':
        req.action = 'getProtocolAPR';
        break;
    case 'stake':
      req.action = 'stake';
      req.method = 'POST';
      break;
    case 'approvewithdrawal':
      req.action = 'approveWithdrawals';
      req.method = 'POST';
      break;
    case 'requestwithdrawal':
      req.action = 'withdraw';
      req.method = 'POST';
      break;
    case 'wrap':
      req.action = 'wrap';
      req.method = 'POST';
      break;
    case 'unwrap':
      req.action = 'unwrap';
      req.method = 'POST';
      break;
    case 'claim':
      req.action = 'claim';
      req.method = 'POST';
      break;
    case 'restake':
      req.action = 'reStake';
      req.method = 'POST';
      break;
    case 'mint':
      req.action = 'mint';
      req.method = 'POST';
      break;
    case 'burn':
      req.action = 'burn';
      req.method = 'POST';
      break;
    case 'getallowance':
      req.action = 'getallowance';
      break;
    case 'decreaseallowance':
      req.action = 'decreaseAllowance';
      req.method = 'POST';
      break;
    case 'increaseallowance':
      req.action = 'increaseAllowance';
      req.method = 'POST';
      break;
    case 'getrewards':
        req.action = 'getrewards';
        break;
    default:
      break;
  }
  return next();
};
