/* eslint-disable no-await-in-loop */
const axios = require('axios');
require("dotenv").config({ path: '../../../.env' });
const config = require('../../../common/configuration/config.json');

module.exports = {
    getHistoricalRewardsAVAX: async (web3, options) => {

        const { address, nodeIds, sortOrder, pageToken } = options;
        const baseUrl = config.glacier.rewardsUrl;
        const pageLength = parseInt(config.glacier.pageSize);

        let sortBy;
        if (!sortOrder) {
            sortBy = config.glacier.sortOrder;
        } else {
            sortBy = sortOrder;
        }


        let url;
        if (pageToken) {
            url = `${baseUrl}?addresses=${address}&pageSize=${pageLength}
                    &sortOrder=${sortBy}&pageToken=${pageToken}`;
        } else
            url = `${baseUrl}?addresses=${address}&pageSize=${pageLength}&sortOrder=${sortBy}`;

        if (nodeIds) {
            url = `${url}&nodeIds=${nodeIds}`;
        }

        console.log(url);

        try {

            const response = {};
            const transactions = [];
            let nextPageToken;
            let fold = 5;
            while (fold > 0) {
                const configuration = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url,
                    headers: {
                        'accept': 'application/json',
                        'x-glacier-api-key': process.env.GLACIER
                    }
                };
                let result = await axios.request(configuration);
                console.log("working on iter: ", fold);
                result = result.data;
                transactions.push(result.historicalRewards);
                if (result.nextPageToken) {
                    nextPageToken = result.nextPageToken;
                    url = `${baseUrl}?addresses=${address}&pageSize=${pageLength}
                            &sortOrder=${sortBy}&pageToken=${nextPageToken}`;                    // console.log(url);
                } else {
                    nextPageToken = undefined;
                    break;
                }
                fold -= 1;
            }
            response.historicalRewards = transactions.flat();
            if (nextPageToken) {
                response.nextPageToken = nextPageToken;
            }
            return response;
        } catch (error) {
            console.log(error.response.data);
            if (error.response.data.statusCode === 500) {
                return [];
            }
            return error.response.data;
        }

    },

};