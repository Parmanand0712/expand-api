/* eslint-disable max-len */
const AWS = require("aws-sdk");
const moment = require('moment');
const { postApiParams } = require('../../../common/dynamo');
const errorMessages = require('../../../common/configuration/errorMessage.json');
require("dotenv").config({ path: '../../../.env' });

AWS.config.update({ region: 'ap-southeast-1' });
const apiGatewayClient = new AWS.APIGateway();
const docClient = new AWS.DynamoDB.DocumentClient();

async function getUserByAPIKey(xAPIKey) {
    return new Promise((resolve, reject) => {
        const params = {
            TableName: process.env.DYNAMODB_USER_TABLE,
            FilterExpression: '#userKey = :userKey',
            ExpressionAttributeNames: {
                '#userKey': 'userKey',
            },
            ExpressionAttributeValues: {
                ':userKey': xAPIKey
            },
        };
        docClient.scan(params, (err, data) => {
            if (err) {
                reject(new Error('false'));
            } else {
                resolve(data.Count > 0 ? data.Items[0] : null);
            }
        });
    });
}
/* eslint-disable consistent-return */
exports.generateKey = async (req, res) => {

    try {

        const params = {
            description: req.body.description,
            enabled: true,
            name: req.body.name,
            stageKeys: [
                {
                    restApiId: process.env.REST_API_ID,
                    stageName: process.env.STAGE_NAME
                },
            ],
        };

        apiGatewayClient.createApiKey(params, async (err, key) => {

            const time = new Date().getTime();
            if (!err) {
                try {
                    await postApiParams(req, time, key, errorMessages, 'success');
                }
                catch (error) {
                    console.log(error);
                }
                return res
                    .status(200)
                    .json({ status: 200, msg: "success", data: key });
            } else {
                try {
                    await postApiParams(req, time, key, errorMessages, 'serverError');
                }
                catch (error) {
                    console.log(error);
                }
                console.log("inner error", err);
                return res.status(500).json({ status: 500, msg: "internal server error" });
            }

        });

    } catch (error) {
        return res.status(500).json({ status: 500, msg: "internal server error" });
    }

};


exports.addPlanForKey = async (req, res) => {

    try {

        const params = {
            keyId: req.body.keyId,
            keyType: 'API_KEY',
            usagePlanId: process.env.USAGE_PLAN_ID
        };

        apiGatewayClient.createUsagePlanKey(params, async (err, key) => {
            const time = new Date().getTime();
            if (!err) {
                try {
                    await postApiParams(req, time, key, errorMessages, 'success');
                }
                catch (error) {
                    console.log(error);
                }
                return res
                    .status(200)
                    .json({ status: 200, msg: "success", data: key });
            } else {
                try {
                    await postApiParams(req, time, key, errorMessages, 'serverError');
                }
                catch (error) {
                    console.log(error);
                }
                return res.status(500).json({ status: 500, msg: "internal server error" });
            }
        });

    } catch (error) {
        return res.status(500).json({ status: 500, msg: "internal server error" });
    }

};

exports.getAPIKey = async (req, res) => {
    const { keyId } = req.body;
    const time = new Date().getTime();

    const params = {
        apiKey: keyId
    };

    try {
        apiGatewayClient.getApiKey(params, async (err, key) => {
            if (err) {
                await postApiParams(req, time, key, errorMessages, 'serverError');
                return res.status(500).json({ status: 500, msg: "internal server error" });
            } else {
                await postApiParams(req, time, key, errorMessages, 'success');
                return res.status(200).json({ status: 200, msg: "success", key });
            }
        });
    } catch (error) {
        return res.status(500).json({ status: 500, msg: "internal server error" });
    }
};


exports.deleteAPIKey = async (req, res) => {
    const { keyId } = req.body;
    const time = new Date().getTime();

    const params = {
        apiKey: keyId
    };

    try {
        apiGatewayClient.deleteApiKey(params, async (err, data) => {
            if (err) {
                await postApiParams(req, time, data, errorMessages, 'serverError');
                return res.status(500).json({ status: 500, msg: "internal server error" });
            } else {
                await postApiParams(req, time, data, errorMessages, 'success');
                return res.status(200).json({ status: 200, msg: "success", data });
            }
        });
    } catch (error) {
        return res.status(500).json({ status: 500, msg: "internal server error" });
    }

};


exports.updateAPIKey = async (req, res) => {
    const { keyId, value } = req.body;
    const time = new Date().getTime();

    const params = {
        apiKey: keyId,
        patchOperations: [{
            op: 'replace',
            path: '/enabled',
            value
        }]
    };

    try {
        apiGatewayClient.updateApiKey(params, async (err, data) => {
            if (err) {
                await postApiParams(req, time, data, errorMessages, 'serverError');
                return res.status(500).json({ status: 500, msg: "internal server error" });
            } else {
                await postApiParams(req, time, data, errorMessages, 'success');
                return res.status(200).json({ status: 200, msg: "success", data });
            }
        });
    } catch (error) {
        return res.status(500).json({ status: 500, msg: "internal server error" });
    }

};

async function queryDynamoDB(queryParams, key, data) {
    const requestParams = queryParams;
    let allItems = data;
    let lastEvaluatedKey = key;
    try {
        if (lastEvaluatedKey) {
            requestParams.ExclusiveStartKey = lastEvaluatedKey;
        }
        // Perform the query operation
        const response = await docClient.query(queryParams).promise();

        // Add items to the list
        allItems = allItems.concat(response.Items);

        // Check if there are more results
        lastEvaluatedKey = response.LastEvaluatedKey;
        if (lastEvaluatedKey) {
            return await queryDynamoDB(requestParams, lastEvaluatedKey, allItems); // Recursively call the function
        }else {
            return allItems;
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

exports.getTotalComputeUnits = async (req, res) => {
    const { apiKey } = req.params;
    const { startDate, endDate } = req.query;

    // Validation for apiKey
    if (!apiKey) {
        return res.status(400).json({
            status: 400,
            msg: 'failed to query',
            error: {
                code: 400,
                message: 'Invalid API key'
            }
        });
    }

    // Validation for startDate and endDate format
    if (startDate && !moment(startDate, 'YYYY-MM-DD', true).isValid()) {
        return res.status(400).json({
            status: 400,
            msg: 'failed to query',
            error: {
                code: 400,
                message: 'startDate is not in valid format (YYYY-MM-DD)'
            }
        });
    }

    if (endDate && !moment(endDate, 'YYYY-MM-DD', true).isValid()) {
        return res.status(400).json({
            status: 400,
            msg: 'failed to query',
            error: {
                code: 400,
                message: 'endDate is not in valid format (YYYY-MM-DD)'
            }
        });
    }

    let startDateToLocale = null;
    let endDateToLocale = null;

    if (!startDate && !endDate) {
        // if startDate and endDate is not available, fetch data from current month 1st day to currentDate.
        // startDateToLocale = moment().startOf('month').format('YYYY-MM-DDTHH:mm:ss');
        startDateToLocale = moment().subtract('days', 30).format('YYYY-MM-DDTHH:mm:ss');
        endDateToLocale = moment().add('days', 1).format('YYYY-MM-DDTHH:mm:ss');
    } else if (startDate && !endDate) {
        startDateToLocale = moment(startDate, 'YYYY-MM-DD').format('YYYY-MM-DDTHH:mm:ss');
        endDateToLocale = moment().add('days', 1).format('YYYY-MM-DDTHH:mm:ss');
    } else if (!startDate && endDate) {
        endDateToLocale = moment(endDate, 'YYYY-MM-DD').add('days', 1).format('YYYY-MM-DDTHH:mm:ss');
        try {
            const user = await getUserByAPIKey(apiKey);
            if (user)
                startDateToLocale = moment(user?.registeredAt).format('YYYY-MM-DDTHH:mm:ss');
            else
                startDateToLocale = moment(endDate, 'YYYY-MM-DD').subtract('days', 30).format('YYYY-MM-DDTHH:mm:ss');

        } catch (error) {
            startDateToLocale = moment(endDate, 'YYYY-MM-DD').subtract('days', 30).format('YYYY-MM-DDTHH:mm:ss');
        }
    } else if (moment(endDate).diff(moment(startDate)) < 0) {
        return res.status(400).json({
            status: 400,
            msg: 'failed to query',
            error: {
                code: 400,
                message: 'endDate is smaller than startDate'
            }
        });
    } else {
        startDateToLocale = moment(startDate, 'YYYY-MM-DD').format('YYYY-MM-DDTHH:mm:ss');
        endDateToLocale = moment(endDate, 'YYYY-MM-DD').add('days', 1).format('YYYY-MM-DDTHH:mm:ss');
    }
    const requestParams = {
        TableName: process.env.DYNAMODB_USAGE_TABLE,
        KeyConditionExpression: '#xAPIKey = :apiKey',
        FilterExpression: "#timestamp BETWEEN :startDate AND :endDate",
        ExpressionAttributeNames: {
            "#xAPIKey": "x-api-key",
            '#apiEndpoint': 'api-endpoint',
            '#timestamp': 'timestamp',
            '#status': 'status'
        },
        ExpressionAttributeValues: {
            ":startDate": startDateToLocale,
            ":endDate": endDateToLocale,
            ":apiKey": apiKey
        },
        // select only required fields from dynamodb
        ProjectionExpression: 'totalComputeUnits, responseTime, #apiEndpoint, #timestamp, totalWebsocketComputeUnits, bytes, #xAPIKey, chainId, #status'
    };
    
    const allItems = await queryDynamoDB(requestParams, null, []);

    let overAllComputeUnits = 0;
    let overAllWebSocketComputeUnits=0;
    console.log("AllItems --", allItems);

    for (const request of allItems) {
        // total calculation of compute units
        overAllComputeUnits += parseFloat(request?.totalComputeUnits || 0);
        overAllWebSocketComputeUnits += parseFloat(request?.totalWebsocketComputeUnits || 0);
    }

    return res.status(200).json({
        overAllComputeUnits,
        overAllWebSocketComputeUnits,
        length:allItems?.length,
        allItems
    });
};