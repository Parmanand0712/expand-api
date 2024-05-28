const config = require('../../../common/configuration/config.json');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const common = require('../../../common/common');
const SetTrustline = require("./setTrustline");
const IssueAsset = require("./issueAsset");
const BurnAsset = require("./burnAsset");
const TransferAsset = require("./transferAsset");
const FreezeAsset = require("./freezeAsset");

const throwErrorMessage = (msg) => ({
  'message': errorMessage.error.message[msg],
  'code': errorMessage.error.code.invalidInput
});

const performOperation = async (operationName, operationFunction, web3, options) => {
  let { chainId } = options;
  const { chainSymbol } = options;

  chainId = await common.getChainId({ chainId, chainSymbol });
  let chainName;

  try {
    chainName = config.chains[chainId].chainName;
  } catch (error) {
    return throwErrorMessage("invalidChainId");
  }

  if (!config.rwaSupportedChains.includes(chainId)) return throwErrorMessage("notApplicable");
  const transaction = await operationFunction[`${operationName}${chainName}`](web3, { ...options, chainId });
  return transaction;
};

module.exports = {
  setTrustline: async (web3, options) => {
    const transaction = await performOperation('setTrustline', SetTrustline, web3, options);
    return transaction;
  },

  issueAsset: async (web3, options) => {
    const transaction = await performOperation('issueAsset', IssueAsset, web3, options);
    return transaction;
  },

  burnAsset: async (web3, options) => {
    const transaction = await performOperation('burnAsset', BurnAsset, web3, options);
    return transaction;
  },

  transferAsset: async (web3, options) => {
    const transaction = await performOperation('transferAsset', TransferAsset, web3, options);
    return transaction;
  },

  freezeAsset: async (web3, options) => {
    const transaction = await performOperation('freezeAsset', FreezeAsset, web3, options);
    return transaction;
  },
};
