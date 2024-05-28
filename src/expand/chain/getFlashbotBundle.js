const axios = require('axios');
const config = require('../../../common/configuration/config.json');

module.exports = {

    getFlashbotBundle : async(hash) => {
        const conf = {
            method: "get",
            maxBodyLength: Infinity,
            url: `${config.privateTransaction.baseUrl}bundle/${hash}`,
            headers: { }
        };
        const response = await axios.request(conf);
        return response.data;
    }
};
