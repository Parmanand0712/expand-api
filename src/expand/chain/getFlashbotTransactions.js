const axios = require('axios');
const config = require('../../../common/configuration/config.json');

module.exports = {

    getFlashbotTransactions : async() => {
        const conf = {
            method: "get",
            maxBodyLength: Infinity,
            url: `${config.privateTransaction.baseUrl}transactions`,
            headers: { }
        };
        const response = await axios.request(conf);
        return response.data;
    }
};
