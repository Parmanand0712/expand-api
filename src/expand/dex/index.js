const GetPrice = require("./getPrice");
const GetPool = require("./getPool");
const Swap = require("./swap");
const AddLiquidity = require("./addLiquidity");
const RemoveLiquidity = require("./removeLiquidity");
const GetLiquidity = require("./getLiquidity");
const GetPoolLiquidity = require("./getPoolLiquidity");
const GetPosition = require("./getUserPosition");
const GetTokenHolder = require("./getTokenHolders");
const GetTokenLiquidity = require("./getTokenLiquidity");
const GetIndividualPoolPosition = require('./getPoolIndividualLiquidity');
const GetLiquiditySources = require('./getLiquiditySources');
const GetPoolChartData = require('./getPoolChartData');
const GetHistoricalTimeSeries = require('./getHistoricalTimeSeries');
const GetHistoricalTransactions = require('./getHistoricalTransactions');
const GetTadeData = require('./getPoolTradesData');
const GetOrders = require('./getOrders');
const CreateOrder = require('./createOrder');
const GetWalletPosition = require('./getWalletPosition');
const RefundLiquidity = require('./refundLiquidity');
const getRoute = require('./getRoute');
const errorMessage = require("../../../common/configuration/errorMessage.json");
const config = require("../../../common/configuration/config.json");
const common = require("../../../common/common");
const swapAggregator = require("./swapAggregator");
const quoteAggregator = require("./quoteAggregator");

const throwErrorMessage = (msg) => ({
  'message': errorMessage.error.message[msg],
  'code': errorMessage.error.code.invalidInput
});

const INVALID_DEX_ID = {
  message: errorMessage.error.message.invalidDexId,
  code: errorMessage.error.code.invalidInput,
};

exports.getPrice = async (web3, options) => {
  const filterOptions = options;
  filterOptions.dexId =
    filterOptions.dexId == null
      ? await common.getDexIdFromDexName(config.default.dex)
      : filterOptions.dexId;
  let dexName = null;

  try {
    dexName = config.dex[filterOptions.dexId].dexName;
  } catch (error) {
    return INVALID_DEX_ID;
  }

  const price = await GetPrice[`getPrice${dexName}`](web3, options);
  return price;
};

exports.getPool = async (web3, options) => {
  const pools = await GetPool.getPoolDex(web3, options);
  return pools;
};

exports.getLiquidity = async (web3, options) => {
  const filterOptions = options;
  filterOptions.dexId =
    filterOptions.dexId == null
      ? await common.getDexIdFromDexName(config.default.dex)
      : filterOptions.dexId;
  let dexName = null;

  try {
    dexName = config.dex[filterOptions.dexId].dexName;
  } catch (error) {
    return INVALID_DEX_ID;
  }

  const liquidity = await GetLiquidity[`getLiquidity${dexName}`](web3, options);
  return liquidity;
};

exports.getPoolLiquidity = async (web3, options) => {
  const filterOptions = options;
  filterOptions.dexId =
    filterOptions.dexId == null
      ? await common.getDexIdFromDexName(config.default.dex)
      : filterOptions.dexId;
  let dexName = null;

  try {
    dexName = config.dex[filterOptions.dexId].dexName;
  } catch (error) {
    return INVALID_DEX_ID;
  }

  const liquidity = await GetPoolLiquidity[`getPoolLiquidity${dexName}`](
    web3,
    options
  );
  return liquidity;
};

exports.getPoolChartData = async (web3, options) => {
  const filterOptions = options;
  filterOptions.dexId =
    filterOptions.dexId == null
      ? await common.getDexIdFromDexName(config.default.dex)
      : filterOptions.dexId;
  let dexName = null;

  try {
    dexName = config.dex[filterOptions.dexId].dexName;
  } catch (error) {
    return INVALID_DEX_ID;
  }

  const getPoolChartData = await GetPoolChartData[`getPoolChartData${dexName}`](
    web3,
    options
  );
  return getPoolChartData;
};

exports.getHistoricalTimeSeries = async (web3, options) => {
  const filterOptions = options;
  filterOptions.dexId =
    filterOptions.dexId == null
      ? await common.getDexIdFromDexName(config.default.dex)
      : filterOptions.dexId;
  let dexName = null;

  try {
    dexName = config.dex[filterOptions.dexId].dexName;
  } catch (error) {
    return INVALID_DEX_ID;
  }

  const getHistoricalTimeSeries = await GetHistoricalTimeSeries[`getHistoricalTimeSeries${dexName}`](
    web3,
    options
  );
  return getHistoricalTimeSeries;
};

exports.getHistoricalTransactions = async (web3, options) => {
  const filterOptions = options;
  filterOptions.dexId =
    filterOptions.dexId == null
      ? await common.getDexIdFromDexName(config.default.dex)
      : filterOptions.dexId;
  let dexName = null;

  try {
    dexName = config.dex[filterOptions.dexId].dexName;
  } catch (error) {
    return INVALID_DEX_ID;
  }

  const getHistoricalTransactions = await GetHistoricalTransactions[`getHistoricalTransactions${dexName}`](
    web3,
    options
  );
  return getHistoricalTransactions;
};

exports.getPoolTradeData = async (web3, options) => {
  const filterOptions = options;
  filterOptions.dexId =
    filterOptions.dexId == null
      ? await common.getDexIdFromDexName(config.default.dex)
      : filterOptions.dexId;
  let dexName = null;

  try {
    dexName = config.dex[filterOptions.dexId].dexName;
  } catch (error) {
    return INVALID_DEX_ID;
  }

  const getHistoricalTransactions = await GetTadeData[`getPoolTradeData${dexName}`](
    web3,
    options
  );
  return getHistoricalTransactions;
};

exports.getTokenLiquidity = async (web3, options) => {
  const filterOptions = options;
  filterOptions.dexId =
    filterOptions.dexId == null
      ? await common.getDexIdFromDexName(config.default.dex)
      : filterOptions.dexId;
  let dexName = null;

  try {
    dexName = config.dex[filterOptions.dexId].dexName;
  } catch (error) {
    return INVALID_DEX_ID;
  }

  const liquidity = await GetTokenLiquidity[`getTokenLiquidity${dexName}`](
    web3,
    options
  );
  return liquidity;
};

exports.getPosition = async (web3, options) => {
  const filterOptions = options;
  filterOptions.dexId =
    filterOptions.dexId == null
      ? await common.getDexIdFromDexName(config.default.dex)
      : filterOptions.dexId;
  let dexName = null;

  try {
    dexName = config.dex[filterOptions.dexId].dexName;
  } catch (error) {
    return INVALID_DEX_ID;
  }

  const liquidity = await GetPosition[`getPosition${dexName}`](web3, options);
  return liquidity;
};
exports.getPoolIndividualLiquidity = async (web3, options) => {
  const filterOptions = options;
  filterOptions.dexId =
    filterOptions.dexId == null
      ? await common.getDexIdFromDexName(config.default.dex)
      : filterOptions.dexId;
  let dexName = null;

  try {
    dexName = config.dex[filterOptions.dexId].dexName;
  } catch (error) {
    return INVALID_DEX_ID;
  }

  const liquidity = await GetIndividualPoolPosition[`getPoolIndividualLiquidity${dexName}`](web3, options);
  return liquidity;
};

exports.getTokenHolder = async (web3, options) => {
  const filterOptions = options;
  filterOptions.dexId =
    filterOptions.dexId == null
      ? await common.getDexIdFromDexName(config.default.dex)
      : filterOptions.dexId;
  let dexName = null;
  
  if(['1306' , '1307'].includes(filterOptions.dexId)) return INVALID_DEX_ID;

  try {
    dexName = config.dex[filterOptions.dexId].dexName;
  } catch (error) {
    return INVALID_DEX_ID;
  }

  const liquidity = await GetTokenHolder[`getTokenHolder${dexName}`](
    web3,
    options
  );
  return liquidity;
};

exports.swap = async (web3, options) => {
  const filterOptions = options;
  filterOptions.dexId =
    filterOptions.dexId == null
      ? await common.getDexIdFromDexName(config.default.dex)
      : filterOptions.dexId;
  let dexName = null;

  try {
    dexName = config.dex[filterOptions.dexId].dexName;
  } catch (error) {
    return INVALID_DEX_ID;
  }
  const transactionReciept = await Swap[`swap${dexName}`](web3, options);
  return transactionReciept;
};

exports.addLiquidity = async (web3, options) => {
  const filterOptions = options;
  filterOptions.dexId =
    filterOptions.dexId == null
      ? await common.getDexIdFromDexName(config.default.dex)
      : filterOptions.dexId;
  let dexName = null;

  try {
    dexName = config.dex[filterOptions.dexId].dexName;
  } catch (error) {
    return INVALID_DEX_ID;
  }

  const transactionReciept = await AddLiquidity[`addLiquidity${dexName}`](
    web3,
    filterOptions
  );
  return transactionReciept;
};

exports.removeLiquidity = async (web3, options) => {
  const filterOptions = options;
  filterOptions.dexId =
    filterOptions.dexId == null
      ? await common.getDexIdFromDexName(config.default.dex)
      : filterOptions.dexId;
  let dexName = null;

  try {
    dexName = config.dex[filterOptions.dexId].dexName;
  } catch (error) {
    return INVALID_DEX_ID;
  }

  const transactionReciept = await RemoveLiquidity[`removeLiquidity${dexName}`](
    web3,
    options
  );
  return transactionReciept;
};

exports.refundLiquidity = async (web3, options) => {
  const filterOptions = options;
  filterOptions.dexId =
    filterOptions.dexId == null
      ? await common.getDexIdFromDexName(config.default.dex)
      : filterOptions.dexId;
  let dexName = null;

  try {
    dexName = config.dex[filterOptions.dexId].dexName;
  } catch (error) {
    return INVALID_DEX_ID;
  }

  const transactionReciept = await RefundLiquidity[`refundLiquidity${dexName}`](
    web3,
    options
  );
  return transactionReciept;
};

exports.swapAggregator = async (web3, options) => {
  const filterOptions = options;
  let chainId = filterOptions.chainId ? filterOptions.chainId : null;
  const chainSymbol = filterOptions.chainSymbol ? filterOptions.chainSymbol : null;
  
  chainId = await common.getChainId( { chainId, chainSymbol } );
  if (!chainId) return throwErrorMessage("invalidChainSymbol"); 

  let chainName; 
  try {
      chainName = config.chains[chainId].chainName;
  } catch (error) {
      return throwErrorMessage("invalidChainId");
  }

  const transactionReciept = await swapAggregator[`swapAggregator${chainName}`](web3, options);
  return transactionReciept;
};

exports.quoteAggregator = async (web3, options) => {
  const filterOptions = options;
  let chainId = filterOptions.chainId ? filterOptions.chainId : null;
  const chainSymbol = filterOptions.chainSymbol ? filterOptions.chainSymbol : null;
  
  chainId = await common.getChainId( { chainId, chainSymbol } );
  if (!chainId) return throwErrorMessage("invalidChainSymbol"); 

  let chainName; 
  try {
      chainName = config.chains[chainId].chainName;
  } catch (error) {
      return throwErrorMessage("invalidChainId");
  }

  const transactionReciept = await quoteAggregator[`quoteAggregator${chainName}`](web3, options);
  return transactionReciept;
};

exports.getLiquiditySources = async (web3, options) => {
  const filterOptions = options;
  filterOptions.dexId =
    filterOptions.dexId == null
      ? await common.getDexIdFromDexName(config.default.dex)
      : filterOptions.dexId;
  let dexName = null;

  try {
    dexName = config.dex[filterOptions.dexId].dexName;
  } catch (error) {
    return INVALID_DEX_ID;
  }

  const lSources = await GetLiquiditySources[`getLiquiditySources${dexName}`](web3, options);
  return lSources;
};

exports.getOrders = async (web3, options) => {
  const filterOptions = options;
  let {dexId} = filterOptions;
  dexId = dexId == null ? await common.getDexIdFromDexName(config.default.dex) : dexId;
  let dexName = null;

  try {
    dexName = config.dex[dexId].dexName;
  } catch (error) {
    return INVALID_DEX_ID;
  }

  const orders = await GetOrders[`getOrders${dexName}`](web3, filterOptions);
  return orders;
};

exports.createOrder = async (web3, options) => {
  const filterOptions = options;
  let {dexId} = filterOptions;
  dexId = dexId == null ? await common.getDexIdFromDexName(config.default.dex) : dexId;
  let dexName = null;

  try {
    dexName = config.dex[dexId].dexName;
  } catch (error) {
    return INVALID_DEX_ID;
  }

  const orders = await CreateOrder[`createOrder${dexName}`](web3, filterOptions);
  return orders;
};

exports.getWalletPosition = async (web3, options) => {
  const filterOptions = options;
  const liquidity = await GetWalletPosition.getWalletPosition(web3, filterOptions);
  return liquidity;
};

exports.getRoute = async (web3, options) => {
  let { dexId } = options;
  dexId =
    dexId == null
      ? await common.getDexIdFromDexName(config.default.dex)
      : dexId;
  let dexName = null;

  try {
    dexName = config.dex[dexId].dexName;
  } catch (error) {
    return INVALID_DEX_ID;
  }

  if( !config.getRoute.dexesSupport.includes(dexId) ){
    return throwErrorMessage("notApplicable");
  }

  const routePlan = await getRoute[`getRoute${dexName}`](web3, options);
  return routePlan;
};
