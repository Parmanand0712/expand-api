const errorMessage = require("../../../common/configuration/errorMessage.json");
const config = require("../../../common/configuration/config.json");
const common = require("../../../common/common");
const GetOrders = require("./getOrders");
const GetFills = require("./getFills");
const GetHistoricalPnL = require("./getHistoricalPnL");
const GetAssets = require("./getAssets");
const GetOrder = require("./getOrder");
const GetPerpetualPositions = require("./getPerpetualPositions");
const GetSubAccounts = require("./getSubAccounts");
const GetTransfers = require("./getTransfers");

const INVALID_DERIVATIVE_ID = {
  message: errorMessage.error.message.invalidDerivativeId,
  code: errorMessage.error.code.invalidInput,
};

exports.getOrders = async (web3, options) => {
  const filterOptions = options;
  filterOptions.derivativeId =
    filterOptions.derivativeId == null
      ? await common.getDerivativeIdFromDerivativeName(config.default.derivative)
      : filterOptions.derivativeId;
  let derivativeName = null;

  try {
    derivativeName = config.derivative[filterOptions.derivativeId].derivativeName;
  } catch (error) {
    return INVALID_DERIVATIVE_ID;
  }

  const orders = await GetOrders[`getOrders${derivativeName}`](web3, options);
  return orders;
};

exports.getFills = async (web3, options) => {
  const filterOptions = options;
  filterOptions.derivativeId =
    filterOptions.derivativeId == null
      ? await common.getDerivativeIdFromDerivativeName(config.default.derivative)
      : filterOptions.derivativeId;
  let derivativeName = null;

  try {
    derivativeName = config.derivative[filterOptions.derivativeId].derivativeName;
  } catch (error) {
    return INVALID_DERIVATIVE_ID;
  }

  const fills = await GetFills[`getFills${derivativeName}`](web3, options);
  return fills;
};

exports.getAssets = async (web3, options) => {
  const filterOptions = options;
  filterOptions.derivativeId =
    filterOptions.derivativeId == null
      ? await common.getDerivativeIdFromDerivativeName(config.default.derivative)
      : filterOptions.derivativeId;
  let derivativeName = null;

  try {
    derivativeName = config.derivative[filterOptions.derivativeId].derivativeName;
  } catch (error) {
    return INVALID_DERIVATIVE_ID;
  }

  const price = await GetAssets[`getAssets${derivativeName}`](web3, options);
  return price;
};

exports.getHistoricalPnL = async (web3, options) => {
  const filterOptions = options;
  filterOptions.derivativeId =
    filterOptions.derivativeId == null
      ? await common.getDerivativeIdFromDerivativeName(config.default.derivative)
      : filterOptions.derivativeId;
  let derivativeName = null;

  try {
    derivativeName = config.derivative[filterOptions.derivativeId].derivativeName;
  } catch (error) {
    return INVALID_DERIVATIVE_ID;
  }

  const price = await GetHistoricalPnL[`getHistoricalPnL${derivativeName}`](web3, options);
  return price;
};

exports.getOrder = async (web3, options) => {
  const filterOptions = options;
  filterOptions.derivativeId =
    filterOptions.derivativeId == null
      ? await common.getDerivativeIdFromDerivativeName(config.default.derivative)
      : filterOptions.derivativeId;
  let derivativeName = null;

  try {
    derivativeName = config.derivative[filterOptions.derivativeId].derivativeName;
  } catch (error) {
    return INVALID_DERIVATIVE_ID;
  }

  const price = await GetOrder[`getOrder${derivativeName}`](web3, options);
  return price;
};

exports.getPerpetualPositions = async (web3, options) => {
  const filterOptions = options;
  filterOptions.derivativeId =
    filterOptions.derivativeId == null
      ? await common.getDerivativeIdFromDerivativeName(config.default.derivative)
      : filterOptions.derivativeId;
  let derivativeName = null;

  try {
    derivativeName = config.derivative[filterOptions.derivativeId].derivativeName;
  } catch (error) {
    return INVALID_DERIVATIVE_ID;
  }

  const price = await GetPerpetualPositions[`getPerpetualPositions${derivativeName}`](web3, options);
  return price;
};

exports.getSubAccounts = async (web3, options) => {
  const filterOptions = options;
  filterOptions.derivativeId =
    filterOptions.derivativeId == null
      ? await common.getDerivativeIdFromDerivativeName(config.default.derivative)
      : filterOptions.derivativeId;
  let derivativeName = null;

  try {
    derivativeName = config.derivative[filterOptions.derivativeId].derivativeName;
  } catch (error) {
    return INVALID_DERIVATIVE_ID;
  }

  const price = await GetSubAccounts[`getSubAccounts${derivativeName}`](web3, options);
  return price;
};

exports.getTransfers = async (web3, options) => {
  const filterOptions = options;
  filterOptions.derivativeId =
    filterOptions.derivativeId == null
      ? await common.getDerivativeIdFromDerivativeName(config.default.derivative)
      : filterOptions.derivativeId;
  let derivativeName = null;

  try {
    derivativeName = config.derivative[filterOptions.derivativeId].derivativeName;
  } catch (error) {
    return INVALID_DERIVATIVE_ID;
  }

  const price = await GetTransfers[`getTransfers${derivativeName}`](web3, options);
  return price;
};
