const { default: axios } = require('axios');
const redis = require('../../../common/redis/index');
const helper = require("../middlewares/helper");
const errorMessages = require("../../../common/configuration/errorMessage.json");
const config = require("../../../common/configuration/config.json");
const { getApiParams, postApiParams } = require("../../../common/dynamo");
require('dotenv').config({path:'../env'});

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

const helperValidation = async (req, res, data, method , startTime) => {
  // const time = new Date().getTime();
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
      await getApiParams(req, startTime, data, errorMessages, status);
    else postApiParams(req, startTime, data, errorMessages, status);
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
  if (action === "getUserTransaction" || action === "getBlock") {
    axios.defaults.headers['X-API-KEY'] = req?.headers?.['x-api-key'] || '';
    try {
      await axios.get(`${process.env.DOMAINNAME}${req.originalUrl}`).then(result => console.log(result.data));
    }
    catch (error) {
      if (error.response) {
        return res.status(error.response.status).json(
          error.response.data
        );
      } else {
        return res.status(500).json({ message: 'Internal server error' });
      }
    }
  };
  try {
    const time = new Date().getTime();
    const data = await helper.chainCommon(action, method === 'GET' ? req.query : req.body);
    return helperValidation(req , res, data, method , time);
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json(throwServerError());
  }
};

exports.chainQueryController = async (req, res, next) => {
  const route = req.route.path.split('/');

  req.method = 'GET';
  switch (route[route.length - 1]) {
    case 'getbalance':
      req.action = 'getBalance';
      break;
    case 'getblock':
      req.action = 'getBlock';
      req.cacheRequired = true;
      break;
    case 'getflashbotblocks':
      req.action = 'getFlashbotBlocks';
      break;
    case 'getflashbottransactions':
      req.action = 'getFlashbotTransactions';
      break;
    case 'getflashbotbundle':
      req.action = 'getFlashbotBundle';
      break;
    case 'getstorage':
      req.action = 'getStorage';
      break;
    case 'gettransaction':
      req.action = 'getTransaction';
      break;
    case 'getgasfees':
      req.action = 'getGasFees';
      break;
    case 'getgasprice':
      req.action = 'getGasPrice';
      break;
    case 'getpublicrpc':
      req.action = 'getPublicRpc';
      break;
    case 'gettokenaddress':
      req.action = 'getTokenAddress';
      break;
    case 'gethistoricalrewards':
      req.action = 'getHistoricalRewards';
      req.cacheRequired = true;
      break;
    case 'portfolio':
      req.action = 'getUserPortfolio';
      req.cacheRequired = true;
      break;
    case 'getusertransactions':
      req.action = 'getUserTransaction';
      req.cacheRequired = true;
      break;
    case 'getevents':
      req.action = 'getEvents';
      break;
    case 'getlatestledger':
      req.action = 'getLatestLedger';
      break;
    case 'estimategas':
      req.action = 'estimateGas';
      req.method = 'POST';
      break;
    case 'generic':
      req.action = 'postGeneric';
      req.method = 'POST';
      req.body.chainId = req.body.chainId ? req.body.chainId : '1';
      req.body.rpc = config.chains[req.body.chainId].thirdPartyRpc;
      break;
    case 'genericsmartcontractmethod':
      req.action = 'postGeneric';
      req.method = 'POST';
      req.body.chainId = req.body.chainId ? req.body.chainId : '1';
      req.body.rpc = config.chains[req.body.chainId].thirdPartyRpc;
      break;
    case 'sendtransaction':
      req.action = 'sendTransaction';
      req.method = 'POST';
      break;
    case 'decodetransaction':
      req.action = 'decodeTransaction';
      req.method = 'POST';
      break;
    case 'simulatetransaction':
      req.action = 'simulateTransaction';
      req.method = 'POST';
      break;
    case 'gettokenmarketdata':
      req.action = 'getTokenMarketData';
      break;
    default:
      break;
  }
  return next();
};
