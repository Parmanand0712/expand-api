const AWS = require('aws-sdk');
const https = require('https');
const errMessages = require('../../../common/configuration/errorMessage.json');

const region = 'ap-southeast-1';
AWS.config.region = region;
console.log(region);
const additionalParams = {};
const httpProtocol = https;


const agent = new httpProtocol.Agent({
  keepAlive: true,
  maxSockets: 100,
});

AWS.config.update({
  httpOptions: {
    agent,
  },
  maxRetries: 5,
});

const dynamoService = new AWS.DynamoDB({
  ...additionalParams,
  httpOptions: {
    agent,
  },
});

const dynamo = new AWS.DynamoDB.DocumentClient({ service: dynamoService, httpOptions: { agent } });

const getApiParams = async (req, time, apiName, errorMessages, status) => {
  let bytes;
  if (
    status === 'failed'
  ) {
    bytes = JSON.stringify({
      status: errorMessages.statusCodes.failed,
      msg: errorMessages.api.queryErrorMessage,
      error: apiName,
    }).length;
  }
  else if (status === 'success') {
    bytes = JSON.stringify({
      status: errorMessages.statusCodes.success,
      msg: errorMessages.api.successMessage,
      data: apiName,
    }).length;
  }
  else if (status === '!chainId') {
    bytes = JSON.stringify({
      status: errorMessages.statusCodes.failed,
      msg: errMessages.error.message.invalidChainId,
    }).length;
  }
  else if (status === '!tokenSymbol') {
    bytes = JSON.stringify({
      status: errorMessages.statusCodes.failed,
      msg: errMessages.error.message.invalidToken,
    }).length;
  }

  const params = {
    TableName: process.env.DYNAMODB_USAGE_TABLE,
    Item: {
      'x-api-key': req.headers['x-api-key'], 
      'timestamp': new Date().toLocaleString('en-GB'),
      "api-endpoint": req.route.path,
      'responseTime': ((new Date().getTime() - time).toString()),
      'chainId': (req.query.chainId === null || req.query.chainId === undefined) ? '1' : req.query.chainId,
      'bytes': bytes,
      'TotalCost': ((((new Date().getTime() - time)) / 1000) * 0.00001622222222) + ((bytes) * (0.09 / 10 ** 9))
    },
  };

  try {
    console.log(params);
    await dynamo.put(params).promise();
    return 'true';
  }
  catch (error) {
    return error;
  }
};

const postApiParams = async (req, time, apiName, errorMessages, status) => {
  let bytes;
  if (
    status === 'failed'
  ) {
    bytes = JSON.stringify({
      status: errorMessages.statusCodes.failed,
      msg: errorMessages.api.queryErrorMessage,
      error: apiName,
    }).length;
  }
  else if (status === 'success') {
    bytes = JSON.stringify({
      status: errorMessages.statusCodes.success,
      msg: errorMessages.api.successMessage,
      data: apiName,
    }).length;
  }
  else {
    bytes = JSON.stringify({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    }).length;
  }
  const params = {
    TableName: process.env.DYNAMODB_USAGE_TABLE,
    Item: {
      'x-api-key': req.headers['x-api-key'], 
      'timestamp': new Date().toLocaleString('en-GB'),
      "api-endpoint": req.route.path,
      'responseTime': ((new Date().getTime() - time).toString()),
      'chainId': (req.body.chainId === null || req.body.chainId === undefined) ? '1' : req.body.chainId,
      'bytes': bytes,
      'TotalCost': ((((new Date().getTime() - time)) / 1000) * 0.00001622222222) + ((bytes) * (0.09 / 10 ** 9))
    },
  };

  try {
    await dynamo.put(params).promise();
    return 'true';
  }
  catch (error) {
    return error;
  }
};

module.exports = {
  getApiParams,
  postApiParams
};
