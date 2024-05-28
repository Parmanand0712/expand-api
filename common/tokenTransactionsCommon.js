const axios = require('axios');
const config = require('./configuration/config.json');

exports.getMethodSignatureById = async (methodId) => {
    const apiConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${config.byteDirectory.baseUrl}?hex_signature=${methodId}`,
        headers: {}
    };

    try {
        const response = await axios.request(apiConfig);
        const result = response.data.results;
        return response.data.results[result.length - 1].text_signature;
    } catch (err) {
        return null;
    }
};

