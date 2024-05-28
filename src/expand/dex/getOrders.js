const { default: axios } = require('axios');
const config = require('../../../common/configuration/config.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const errorMessage = require('../../../common/configuration/errorMessage.json');

const throwErrorMessage = (msg) => ({
  'message': errorMessage.error.message[msg],
  'code': errorMessage.error.code.invalidInput
});


module.exports = {
  getOrdersUniswapV2: async () => throwErrorMessage("notApplicable"),
  getOrdersSushiswapV2: async () => throwErrorMessage("notApplicable"),
  getOrdersPancakeV2: async () => throwErrorMessage("notApplicable"),
  getOrdersUniswapV3: async () => throwErrorMessage("notApplicable"),
  getOrdersCurveV2: async () => throwErrorMessage("notApplicable"),
  getOrdersBalancerV2: async () => throwErrorMessage("notApplicable"),
  getOrders0x: async () => throwErrorMessage("notApplicable"),
  getOrders1inch: async () => throwErrorMessage("notApplicable"),
  getOrdersKyberswap: async () => throwErrorMessage("notApplicable"),
  getOrdersTraderJoe: async () => throwErrorMessage("notApplicable"),
  getOrdersOrca: async () => throwErrorMessage("notApplicable"),


  getOrdersUniswapX: async (web3, options) => {
    const filterOptions = options;

    filterOptions.function = "getOrdersUniswapX()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) return validJson;

    const { dexId, status: orderStatus, orderHashes, filler, sort } = filterOptions;
    const { chainId } = config.dex[dexId];

    const apiURL = config.dex[dexId]?.ordersApi || null;
    if (!apiURL) return throwErrorMessage("notApplicable");

    const apiConfig = {
      method: 'get',
      maxBodyLength: Infinity,
      url: config.dex[dexId].ordersApi,
      params: {
        limit: Number(config.dex[dexId].ordersOffset),
        chainId: Number(chainId),
        ...(!orderHashes && {desc: sort === "desc", sortKey: 'createdAt'}),
        ...(orderStatus !== "all" && { orderStatus }),
        ...(orderHashes && { orderHashes }),
        ...(filler && { filler }
        )
      },
      headers: {}
    };

    console.log(apiConfig);
    try {
      const response = await axios.request(apiConfig);
      delete response.data?.cursor;
      return response.data;
    } catch (err) {
      const errMsg = err.response.data.detail;
      return ({
        'message': errMsg,
        'code': errorMessage.error.code.invalidInput
      });
    }
  },
};
