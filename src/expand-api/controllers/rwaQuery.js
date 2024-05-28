const redis = require('../../../common/redis/index');
const helper = require("../middlewares/helper");
const errorMessages = require("../../../common/configuration/errorMessage.json");
const config = require("../../../common/configuration/config.json");
const { getApiParams, postApiParams } = require("../../../common/dynamo");

const throwServerError = () => ({
  status: errorMessages.statusCodes.serverError,
  msg: errorMessages.api.serverErrorMesssage,
});

const setApiCache = (req, data) => {
  try {
      const cacheKey = req.cacheKey ? req.cacheKey : `${req.path}_${JSON.stringify(req.query)}`;
      redis.set(cacheKey, JSON.stringify(data));
      redis.expire(cacheKey, config.default.ttl);
  } catch(error){
    console.log("error is setting cache");
  }
};

const helperValidation = async (req, res, data, method) => {
  const time = new Date().getTime();
  const { valid, error, message, code } = data;
  const { cacheRequired } = req;

  let status = 'success';
  if (
    valid !== undefined ||
    error !== undefined ||
    message !== undefined ||
    code !== undefined
  ) {
    status = 'failed';
  } 

  if (cacheRequired && status === 'success') setApiCache(req, data);

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
    const data = await helper.rwaCommon(action, method === 'GET' ? req.query : req.body);
    return helperValidation(req, res, data, method);
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json(throwServerError());
  }
};

exports.rwaQueryController = async (req, res, next) => {
  const route = req.route.path.split('/');

  req.method = 'GET';
  switch (route[route.length - 1]) {
    case 'settrustline':
      req.action = 'setTrustline';
      req.method = 'POST';
      break;
    case 'issue':
      req.action = 'issueAsset';
      req.method = 'POST';
      break;
    case 'burn':
      req.action = 'burnAsset';
      req.method = 'POST';
      break;
    case 'transfer':
      req.action = 'transferAsset';
      req.method = 'POST';
      break;
    case 'freeze':
      req.action = 'freezeAsset';
      req.method = 'POST';
      break;
    default:
      break;
  }
  return next();
};
