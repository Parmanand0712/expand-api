const axios = require('axios');
const config = require('../../../common/configuration/config.json');

module.exports = {

    getFlashbotBlocks : async() => {
        const conf = {
            method: "get",
            maxBodyLength: Infinity,
            url: `${config.privateTransaction.baseUrl}blocks`,
            headers: { }
        };
        const response = await axios.request(conf);
        return response.data;
    }
};
