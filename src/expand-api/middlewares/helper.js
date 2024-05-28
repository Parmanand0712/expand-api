const chain = require("../../expand/chain/index");
const dex = require("../../expand/dex/index");
const bridge = require("../../expand/bridge/index");
const lendborrow = require("../../expand/lendBorrow/index");
const fungibleToken = require("../../expand/fungibleTokens/index");
const nonFungibleToken = require("../../expand/nonFungibleToken/index");
const oracle = require("../../expand/oracle/index");
const yieldAggregator = require("../../expand/yieldAggregator/index");
const stableCoin = require("../../expand/stableCoin/index");
const accountAbstraction = require("../../expand/accountAbstraction/index");
const derivative = require("../../expand/derivative/index");
const liquidStaking = require("../../expand/liquidStaking/index");
const rwa = require("../../expand/realWorldAsset/index");

const Web3 = require("../../../common/intialiseWeb3");

const errorMessage = require("../../../common/configuration/errorMessage.json");
const { getOracleId } = require("../../../common/common");

const config = require("../../../common/configuration/config.json");

const throwErrorMessage = (msg) => ({
  'message': errorMessage.error.message[msg],
  'code': errorMessage.error.code.invalidInput
});

// Chain helper function
exports.chainCommon = async (functionName, data) => {
  let response = null;
  const options = data;
  try {
    let { chainId } = options;
    chainId = chainId || "1";
    if (!(chainId in config.chains)) return throwErrorMessage("invalidChainId");
    if (functionName === "getBlock" && config.historicalBlocks.chains.includes(chainId)) options.rpc = config.chains[chainId].publicRpc;
    const web3 = await Web3.initialiseWeb3(data);
    console.log(functionName);
    response = await chain[functionName](web3, data);
  } catch (err) {
    response = {
      error: err.toString(),
    };
  }
  return response;
};

// Bridge helper function
exports.bridgeCommon = async (functionName, data) => {
  let response = null;
  try {
    const web3 = await Web3.initialiseWeb3ForBridges(data);
    response = await bridge[functionName](web3, data);
  } catch (err) {
    response = {
      error: err.toString()
    };
  }
  return response;
};

// Dex helper function
exports.dexCommon = async (functionName, data) => {
  let response;
  const options = data;
  try {
    options.dexId = options.dexId || "1000";
    options.chainId = config.dex[options.dexId].chainId;
  } catch (error) {
    return throwErrorMessage("invalidDexId");
  }

  try {
    if (functionName === "getTokenHolder" && ["1300", "1305", "1307", "1306"].includes(data.dexId)) {
      options.chainId = config.dex[data.dexId].chainId;
      options.rpc = config.chains[options.chainId].getVaultYearnRpc;
      const web3 = await Web3.initialiseWeb3(options);
      response = await dex[functionName](web3, options);
    }
    else if (functionName === config.extraParamatersSchemaFunctions[0]) {
      options.chainId = config.dex[data.dexId || "1000"].chainId;
      options.rpc = (options.rpc === undefined && (!['1306', '1200'].includes(data.dexId)))
        ? config.chains[options.chainId].getVaultYearnRpc : options.rpc;
      const web3 = await Web3.initialiseWeb3(options);
      delete options.rpc;
      delete options.chainId;
      response = await dex[functionName](web3, options);
    }
    else if ((config.extraParamatersSchemaFunctions).includes(functionName)) {
      options.chainId = config.dex[data.dexId || "1000"].chainId;
      options.rpc = (options.rpc === undefined) ? config.chains[options.chainId].publicRpc : options.rpc;
      const web3 = await Web3.initialiseWeb3(options);
      delete options.rpc;
      delete options.chainId;
      response = await dex[functionName](web3, options);
    }

    else if (functionName === "getWalletPosition") {
      options.chainId = config.dex["1000"].chainId;
      options.rpc = config.chains[options.chainId].getVaultYearnRpc;
      const web3 = await Web3.initialiseWeb3(options);
      delete options.rpc;
      delete options.chainId;
      response = await dex[functionName](web3, options);
    }
    else {
      const web3 = await Web3.initialiseWeb3(data);
      response = await dex[functionName](web3, options);

    }
  } catch (err) {
    console.log(err);
    response = {
      error: err.toString(),
    };
  }
  return response;
};

exports.dexAggregatorCommon = async (functionName, data) => {
  let response;
  const options = data;
  try {
    options.chainId = options.chainId || "1";
  } catch (error) {
    return throwErrorMessage("invalidDexId");
  }
  try {
    const web3 = await Web3.initialiseWeb3(data);
    response = await dex[functionName](web3, options);
  } catch (err) {
    response = {
      error: err.toString(),
    };
  }
  return response;
};

exports.dexCommonGetPool = async (functionName, data) => {
  let response;
  const options = data;
  try {
    options.chainId = config.dex[data.dexId[0] || "1000"].chainId;
  } catch (error) {
    return throwErrorMessage("invalidDexId");
  }

  try {
    const web3 = await Web3.initialiseWeb3(options);
    response = await dex[functionName](web3, data);
  } catch (err) {
    response = {
      error: err.toString(),
    };
  }
  return response;
};

// LendBorrow helper function
exports.lendBorrowCommon = async (functionName, data) => {
  let response;
  const options = data;
  try {
    options.chainId = config.lendborrow[data.lendborrowId || "1000"].chainId;
  } catch (error) {
    return throwErrorMessage("invalidLendBorrowId");
  }
  try {
    const web3 = await Web3.initialiseWeb3(data);
    response = await lendborrow[functionName](web3, data);
  } catch (err) {
    response = {
      error: err.toString(),
    };
  }
  return response;
};

// Fungible Token helper function
exports.fungibleTokenCommon = async (functionName, data) => {
  let response;
  const options = data;
  try {
    const web3 = await Web3.initialiseWeb3(options);
    response = await fungibleToken[functionName](web3, data);
  } catch (err) {
    response = {
      error: err.toString(),
    };
  }
  return response;
};

// Non Fungible Token helper function
exports.nonFungibleTokenCommon = async (functionName, data) => {
  let response;
  const options = data;
  try {
    const web3 = await Web3.initialiseWeb3(options);
    response = await nonFungibleToken[functionName](web3, data);

  } catch (err) {
    response = {
      error: err.toString(),
    };
  }
  return response;
};

exports.oracleCommon = async (functionName, data) => {
  let response;
  const options = data;
  let oracleId;
  try {
    oracleId = await getOracleId({
      oracleId: data.oracleId,
      oracleName: data.oracleName,
    });
    options.chainId = await config.oracle[oracleId].chainId;
  } catch (error) {
    return throwErrorMessage("invalidOracleId");
  }

  try {
    if (oracleId === '1100') options.rpc = config.chains[options.chainId].publicRpc;
    const web3 = await Web3.initialiseWeb3(options);
    response = await oracle[functionName](web3, options);
  } catch (err) {
    response = {
      error: err.toString(),
    };
  }

  return response;
};

exports.yieldAggregatorCommon = async (functionName, data) => {
  let response;
  try {
    const web3 = await Web3.initialiseWeb3(data);
    response = await yieldAggregator[functionName](web3, data);
  } catch (err) {
    response = {
      error: err.toString(),
    };
  }

  return response;
};

exports.stableCoinCommon = async (functionName, data) => {
  let response;

  try {
    const web3 = await Web3.initialiseWeb3(data);
    response = await stableCoin[functionName](web3, data);
  } catch (err) {
    response = {
      error: err.toString(),
    };
  }

  return response;
};

// important data type conversion for get query parameters
exports.pathStringToArray = async (data) => {
  const options = data;
  if (options.path !== undefined) {
    options.path = data.path.split(",");
  }
  return data;
};

exports.assetsStringToArray = async (data) => {
  const options = data;
  if (options.assets !== undefined) {
    options.assets = data.assets.split(",");
  }
  return data;
};

exports.pathStringToArraygetPool = async (data) => {
  const options = data;
  if (options.path !== undefined) {
    options.path = data.path.split(",");
  }
  if (options.dexId === undefined)
    options.dexId = '1000';
  if (options.dexId !== undefined) {
    options.dexId = data.dexId.split(",");
  }
  return data;
};

// Account Abstraction helper function
exports.accountAbstractionCommon = async (functionName, data) => {
  let response = null;
  try {
    const web3 = await Web3.initialiseWeb3(data);
    response = await accountAbstraction[functionName](web3, data);
  } catch (err) {
    response = {
      error: err.toString(),
    };
  }
  return response;
};

// Derivative helper function
exports.derivativeCommon = async (functionName, data) => {
  let response;
  const options = data;
  try {
    const web3 = await Web3.initialiseWeb3(options);
    response = await derivative[functionName](web3, data);
  } catch (err) {
    response = {
      error: err.toString(),
    };
  }
  return response;
};

// liquidStaking helper function
exports.liquidStakingCommon = async (functionName, data) => {
  let response = null;
  try {
    const options = data;
    let { liquidStakingId } = options;
    if (!liquidStakingId) liquidStakingId = "1";
    if (!(liquidStakingId in config.liquidStaking)) return throwErrorMessage("invalidStakingProtocolId");
    options.chainId = config.liquidStaking[liquidStakingId].chainId;
    const web3 = await Web3.initialiseWeb3(options);
    response = await liquidStaking[functionName](web3, data);
  } catch (err) {
    response = {
      error: err.toString()
    };
  }
  return response;
};

// RWA helper function
exports.rwaCommon = async (functionName, data) => {
  let response;
  const options = data;
  try {
    const web3 = await Web3.initialiseWeb3(options);
    response = await rwa[functionName](web3, data);
  } catch (err) {
    response = {
      error: err.toString(),
    };
  }
  return response;
};


