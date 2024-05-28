const { default: axios } = require('axios');
const errorMessage = require('../../../common/configuration/errorMessage.json');

const config = require('../../../common/configuration/config.json');
require("dotenv").config({ path: '../../../.env' });

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
  });

module.exports = {
    getLiquiditySourcesUniswapV2: async () => throwErrorMessage("notApplicable"),
    getLiquiditySourcesSushiswapV2: async () => throwErrorMessage("notApplicable"),
    getLiquiditySourcesPancakeV2: async () => throwErrorMessage("notApplicable"),
    getLiquiditySourcesUniswapV3: async () => throwErrorMessage("notApplicable"),
    getLiquiditySourcesCurveV2: async () => throwErrorMessage("notApplicable"),
    getLiquiditySourcesBalancerV2: async () => throwErrorMessage("notApplicable"),
    getLiquiditySourcesTraderJoe: async () => throwErrorMessage("notApplicable"),
    getLiquiditySourcesUniswapX: async () => throwErrorMessage("notApplicable"),
    getLiquiditySourcesOrca: async () => throwErrorMessage("notApplicable"),

    // eslint-disable-next-line no-unused-vars
    getLiquiditySources0x: async (web3, options) => {
        /*
         * Function will fetch the liquidity sources of uniswapV2
         */
        const baseUrl = config.dex[options.dexId].apiBaseUrl;

        const apiConfig = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${baseUrl}sources`,
            headers: {
                "0x-api-key": process.env['0x'],
            }
        };
        try {
            const res = await axios.request(apiConfig);
            return res.data.records;
        } catch (err) {
            if (err.response.data) return err.response.data;
            return (err);
        }
    },

    // eslint-disable-next-line no-unused-vars
    getLiquiditySources1inch: async (web3, options) => {
        /*
         * Function will fetch the liquidity sources of 1inch
         */

        const {dexId} = options;

        const apiConfig = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${config.dex[dexId].baseUrl}liquidity-sources`,
            headers: {
                Authorization: `Bearer ${process.env['1inch']}`,
            }
        };
        try {
            const res = await axios.request(apiConfig);
            const {protocols} = res.data;
            return protocols ? protocols.map((protocol) => protocol.title): [];
        } catch (err) {
            if (err.response.data) return err.response.data;
            return (err);
        }
    },

    // eslint-disable-next-line no-unused-vars
    getLiquiditySourcesKyberswap: async (web3, options) => {
        /*
         * Function will fetch the liquidity sources of Kyberswap
         */

        const {dexId} = options;
        return config.dex[dexId].sources;
    },
    getLiquiditySourcesJupiter: async (web3, options) => {
        /*
         * Function will fetch the liquidity sources of Jupiter
         */

        const { dexId } = options;

        const ammConfig = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${config.dex[dexId].statsUrl}`,
            headers: { }
        };
          
        try {
            const res = await axios.request(ammConfig);
            const  protocols = res.data.lastXVolumeByAMMs;
            return protocols ? protocols.map((protocol) => protocol.amm) : [];
        } catch (err) {
            if (err.response.data) return err.response.data;
            return (err);
        }
    },

};
