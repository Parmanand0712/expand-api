/* eslint-disable guard-for-in */
const fs = require('fs').promises;
const fss = require('fs');
const AWS = require('aws-sdk');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const https = require('https');
const errMessages = require('./configuration/errorMessage.json');
require("dotenv").config({ path: '../.env' });

const config = require("./configuration/config.json");

const region = 'ap-southeast-1';
AWS.config.region = region;
const additionalParams = {};
const httpProtocol = https;

const apigateway = new AWS.APIGateway();

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

function scanDynamoDB(params) {
  return new Promise((resolve, reject) => {
    dynamo.scan(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Count);
      }
    });
  });
}


const getUsagePlanKeys = async (usagePlanId) => {

  let response;
  const allKeys = [];
  do {

    // eslint-disable-next-line no-await-in-loop
    response = await apigateway.getUsagePlanKeys({
      usagePlanId,
      position: response ? response.position : undefined,
    }).promise();
    // Process the current page of results
    allKeys.push(...response.items);
  } while (response.position);

  return allKeys;
};

async function getUsagePlans(apiKey) {
  let multiplicationFactor;
  let costPerComputeUnit;
  let WAF;
  let planName;
  const response = await apigateway.getUsagePlans({ limit: 500 }).promise();
  const usagePlanIds = response.items.map((plan) => ({ id: plan.id, name: plan.name }));

  for (const usagePlans of usagePlanIds) {
    // eslint-disable-next-line no-await-in-loop
    const keysData = await getUsagePlanKeys(usagePlans.id);
    const apiKeys = keysData.map((key) => key.value);
    if ((apiKey in config.oldApiPlanKeys)) {
      planName = config.oldApiPlanKeys[apiKey].planName;
      [costPerComputeUnit, WAF, multiplicationFactor] = [config.oldApiPlanKeys[apiKey].costPerComputeUnit
        , config.oldApiPlanKeys[apiKey].WAF, 3];
    }
    else if (apiKeys.find(key => key === apiKey)) {
      planName = usagePlans.name;
      [costPerComputeUnit, WAF, multiplicationFactor] = [config.usagePlans[planName].costPerComputeUnit
        , config.usagePlans[planName].WAF, 10];

    }
  }

  return { costPerComputeUnit, WAF, planName, multiplicationFactor };

}

const apiDetails = async (apiKey) => {
  let computeData;
  if (!fss.existsSync('newdata.json')) {
    // Create the file if it doesn't exist
    await fs.writeFile('newdata.json', '{}');
    console.log(`File 'newdata.json' created successfully.`);
  }

  const apiKeysData = await fs.readFile('newdata.json', 'utf8');
  const jsonData = JSON.parse(apiKeysData);
  if (!(apiKey in jsonData)) {
    computeData = await getUsagePlans(apiKey);
    jsonData[apiKey] = computeData;
    const newDataString = JSON.stringify(jsonData, null, 2);

    await fs.writeFile('newdata.json', newDataString);
  }
  else {
    computeData = jsonData[apiKey];
  }

  return computeData;
};

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
  let totalCostAws;

  const computeData = await apiDetails(req.headers['x-api-key']);

  if (req.route.path === '/dex/getpoolindividualliquidity' && status === 'success') {
    totalCostAws = (((((new Date().getTime() - time)) / 1000) * computeData.costPerComputeUnit) + ((bytes) * (0.09 / 10 ** 9)) + computeData.WAF)
      * apiName.users.length;
  }
  else {
    totalCostAws = (((((new Date().getTime() - time)) / 1000) * computeData.costPerComputeUnit) + ((bytes) * (0.09 / 10 ** 9)) + computeData.WAF);
  }

  const uuid = uuidv4().replaceAll('-', '');

  const params = {
    TableName: process.env.DYNAMODB_USAGE_TABLE,
    Item: {
      uuid,
      'x-api-key': req.headers['x-api-key'],
      'timestamp': moment().format('YYYY-MM-DDTHH:mm:ss'),
      "api-endpoint": req.route.path,
      'responseTime': ((new Date().getTime() - time).toString()),
      'chainId': (req.query.chainId === null || req.query.chainId === undefined) ? '1' : req.query.chainId,
      'bytes': bytes,
      'TotalCostAWS': totalCostAws,
      'TotalCostUser': totalCostAws * computeData.multiplicationFactor,
      'totalComputeUnits': ((totalCostAws * computeData.multiplicationFactor) / computeData.costPerComputeUnit),
      'actualComputeUnits': ((totalCostAws) / computeData.costPerComputeUnit),
      'PlanName': computeData.planName,
      'Parameters': req.originalUrl,
      'status': status === 'failed' ? errorMessages.statusCodes.failed : errorMessages.statusCodes.success,
    },
  };

  try {
    await dynamo.put(params).promise();
    console.log(`GET request data stored in ${process.env.DYNAMODB_USAGE_TABLE} table successfully`);
    return 'true';
  }
  catch (error) {
    console.log("GET request store failed", error);
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
  else if (status === 'serverError') {
    bytes = JSON.stringify({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.queryErrorMessage,
      data: apiName,
    }).length;
  }
  else {
    bytes = JSON.stringify({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    }).length;
  }

  const computeData = await apiDetails(req.headers['x-api-key']);

  const uuid = uuidv4().replaceAll('-', '');
  const params = {
    TableName: process.env.DYNAMODB_USAGE_TABLE,
    Item: {
      uuid,
      'x-api-key': req.headers['x-api-key'],
      'timestamp': moment().format('YYYY-MM-DDTHH:mm:ss'),
      "api-endpoint": req.route.path,
      'responseTime': ((new Date().getTime() - time).toString()),
      'chainId': (req.body.chainId === null || req.body.chainId === undefined) ? '1' : req.body.chainId,
      'bytes': bytes,
      'TotalCostAWS': ((((new Date().getTime() - time)) / 1000) * computeData.costPerComputeUnit) + ((bytes) * (0.09 / 10 ** 9)) + computeData.WAF,
      'TotalCostUser': (((((new Date().getTime() - time)) / 1000) * computeData.costPerComputeUnit) + ((bytes) * (0.09 / 10 ** 9))
        + computeData.WAF) * computeData.multiplicationFactor,
      'totalComputeUnits': (((((((new Date().getTime() - time)) / 1000) * computeData.costPerComputeUnit) + ((bytes) * (0.09 / 10 ** 9))
        + computeData.WAF) * computeData.multiplicationFactor) / computeData.costPerComputeUnit),
      'actualComputeUnits': (((((((new Date().getTime() - time)) / 1000) * computeData.costPerComputeUnit) + ((bytes) * (0.09 / 10 ** 9))
        + computeData.WAF)) / computeData.costPerComputeUnit),
      'PlanName': computeData.planName,
      'Parameters': req.body,
      'status': status === 'failed' ? errorMessages.statusCodes.failed : errorMessages.statusCodes.success,
      'bdnTransaction': req.body.bdnTransaction === true
    },
  };


  try {
    await dynamo.put(params).promise();
    console.log(`POST request data stored in ${process.env.DYNAMODB_USAGE_TABLE} table successfully`);
    return 'true';
  }
  catch (error) {
    console.log("POST request store failed", error);
    return error;
  }
};

const getAddonPlan = async (apiKey) => {
  const computeData = await getUsagePlans(apiKey);
  return computeData;
};


const getbdnTransactionCount = async (apiKey, specificTimestamp) => {
  try {

    const params = {
      TableName: process.env.DYNAMODB_USAGE_TABLE,
      // FilterExpression: '#apiKey = :apiKey',
      FilterExpression: '#apiKey = :apiKey AND #bdnTransaction = :bdnTransaction  AND #timestamp > :specificTimestamp',
      ExpressionAttributeNames: {
        '#apiKey': 'x-api-key',
        '#bdnTransaction': 'bdnTransaction',
        '#timestamp': 'timestamp', // Assuming 'timestamp' is the attribute name
      },
      ExpressionAttributeValues: {
        ':apiKey': apiKey,
        ':bdnTransaction': true,
        ':specificTimestamp': specificTimestamp,
      },
    };

    const counts = await scanDynamoDB(params);
    console.log('Count of records:', counts);
    return counts;
  } catch (error) {
    return error;
  }

};


module.exports = {
  getApiParams,
  postApiParams,
  getAddonPlan,
  getbdnTransactionCount
};
