const getLiquidity = require('./getLiquidity');
const swap = require('./swap');
const addLiquidity = require('./addLiquidity');
const removeLiquidity = require('./removeLiquidity');
const getTransaction = require('./getTransaction');
const getPrice = require('./getPrice');
const getRoute = require('./getRoute');
const getTokensSupported = require('./getTokensSupported');
const getChainsSupported = require('./getChainsSupported');

const errorMessage = require('../../../common/configuration/errorMessage.json');
const config = require('../../../common/configuration/config.json');
const common = require('../../../common/common');


const INVALID_BRIDGE_ID = {
    message: errorMessage.error.message.invalidBridgeId,
    code: errorMessage.error.code.invalidInput
};

const NOT_IMPLEMENTED_YET = {
    message: errorMessage.error.message.invalidFunction,
    code: errorMessage.error.code.invalidInput
};

const INVALID_CHAIN_ID = {
    'message': errorMessage.error.message.invalidChainId,
    'code': errorMessage.error.code.invalidInput
};

exports.getLiquidity = async (web3, options) => {
    const filterOptions = options;
    filterOptions.bridgeId = filterOptions.bridgeId == null ? await common.getBridgeIdFromBridgeName(config.default.bridge) : filterOptions.bridgeId;
    let bridgeName = null;

    try {
        bridgeName = config.bridge[filterOptions.bridgeId].bridgeName;
    } catch (error) {
        return (INVALID_BRIDGE_ID);
    }

    let { srcChainId } = filterOptions;
    const { srcChainSymbol } = filterOptions;

    srcChainId = await common.getChainId({ chainId: srcChainId, chainSymbol: srcChainSymbol });
    // console.log(config.chains[srcChainId].chainName);
    if (!config || !config.chains[srcChainId] || !config.chains[srcChainId].chainName)
        return (INVALID_CHAIN_ID);

    const response = await getLiquidity[`getLiquidity${bridgeName}`](web3, options);
    return (response);

};

exports.swap = async (web3, options) => {
    const filterOptions = options;
    filterOptions.bridgeId = filterOptions.bridgeId == null ? await common.getBridgeIdFromBridgeName(config.default.bridge) : filterOptions.bridgeId;
    let bridgeName = null;

    try {
        bridgeName = config.bridge[filterOptions.bridgeId].bridgeName;
    } catch (error) {
        return (INVALID_BRIDGE_ID);
    }

    let { srcChainId } = filterOptions;
    const { srcChainSymbol } = filterOptions;

    srcChainId = await common.getChainId({ chainId: srcChainId, chainSymbol: srcChainSymbol });

    if (!config || !config.chains[srcChainId] || !config.chains[srcChainId].chainName)
        return (INVALID_CHAIN_ID);


    const response = await swap[`swap${bridgeName}`](web3, options);
    return (response);

};

exports.addLiquidity = async (web3, options) => {
    const filterOptions = options;
    filterOptions.bridgeId = filterOptions.bridgeId == null ? await common.getBridgeIdFromBridgeName(config.default.bridge) : filterOptions.bridgeId;
    let bridgeName = null;

    try {
        bridgeName = config.bridge[filterOptions.bridgeId].bridgeName;
    } catch (error) {
        return (INVALID_BRIDGE_ID);
    }

    let { srcChainId } = filterOptions;
    const { srcChainSymbol } = filterOptions;

    srcChainId = await common.getChainId({ chainId: srcChainId, chainSymbol: srcChainSymbol });

    if (!config || !config.chains[srcChainId] || !config.chains[srcChainId].chainName)
        return (INVALID_CHAIN_ID);


    if (!config.addLiquiditySupportedBridge.includes(filterOptions.bridgeId)) return NOT_IMPLEMENTED_YET;
    const response = await addLiquidity[`addLiquidity${bridgeName}`](web3, options);
    return response;
};

exports.removeLiquidity = async (web3, options) => {
    const filterOptions = options;
    filterOptions.bridgeId = filterOptions.bridgeId == null ? await common.getBridgeIdFromBridgeName(config.default.bridge) : filterOptions.bridgeId;
    let bridgeName = null;

    try {
        bridgeName = config.bridge[filterOptions.bridgeId].bridgeName;
    } catch (error) {
        return (INVALID_BRIDGE_ID);
    }

    let { srcChainId } = filterOptions;
    const { srcChainSymbol } = filterOptions;

    srcChainId = await common.getChainId({ chainId: srcChainId, chainSymbol: srcChainSymbol });

    if (!config || !config.chains[srcChainId] || !config.chains[srcChainId].chainName)
        return (INVALID_CHAIN_ID);

    if (!config.removeLiquiditySupportedBridge.includes(filterOptions.bridgeId)) return NOT_IMPLEMENTED_YET;

    const response = await removeLiquidity[`removeLiquidity${bridgeName}`](web3, options);
    return response;
};

exports.getTransaction = async (web3, options) => {
    const filterOptions = options;
    filterOptions.bridgeId = filterOptions.bridgeId == null ? await common.getBridgeIdFromBridgeName(config.default.bridge) : filterOptions.bridgeId;
    let bridgeName = null;

    try {
        bridgeName = config.bridge[filterOptions.bridgeId].bridgeName;
    } catch (error) {
        return (INVALID_BRIDGE_ID);
    }

    let { srcChainId } = filterOptions;
    const { srcChainSymbol } = filterOptions;

    srcChainId = await common.getChainId({ chainId: srcChainId, chainSymbol: srcChainSymbol });

    if (!config || !config.chains[srcChainId] || !config.chains[srcChainId].chainName)
        return (INVALID_CHAIN_ID);


    const response = await getTransaction[`getTransaction${bridgeName}`](web3, options);
    return response;
};

exports.getPrice = async (web3, options) => {
    const filterOptions = options;
    filterOptions.bridgeId = filterOptions.bridgeId == null ? await common.getBridgeIdFromBridgeName(config.default.bridge) : filterOptions.bridgeId;
    let bridgeName = null;

    try {
        bridgeName = config.bridge[filterOptions.bridgeId].bridgeName;
    } catch (error) {
        return (INVALID_BRIDGE_ID);
    }

    const response = await getPrice[`getPrice${bridgeName}`](web3, options);
    return response;
};

exports.getRoute = async (web3, options) => {
    const filterOptions = options;
    filterOptions.bridgeId = filterOptions.bridgeId == null ? await common.getBridgeIdFromBridgeName(config.default.bridge) : filterOptions.bridgeId;
    let bridgeName = null;

    try {
        bridgeName = config.bridge[filterOptions.bridgeId].bridgeName;
    } catch (error) {
        return (INVALID_BRIDGE_ID);
    }

    const response = await getRoute[`getRoute${bridgeName}`](web3, options);
    return response;
};

exports.getChainsSupported = async (web3, options) => {
    const filterOptions = options;
    filterOptions.bridgeId = filterOptions.bridgeId == null ? await common.getBridgeIdFromBridgeName(config.default.bridge) : filterOptions.bridgeId;
    let bridgeName = null;

    try {
        bridgeName = config.bridge[filterOptions.bridgeId].bridgeName;
    } catch (error) {
        return (INVALID_BRIDGE_ID);
    }

    const response = await getChainsSupported[`getChainsSupported${bridgeName}`](web3, options);
    return response;
};

exports.getTokensSupported = async (web3, options) => {
    const filterOptions = options;
    
    if (filterOptions.bridgeId == null)
        filterOptions.bridgeId = await common.getBridgeIdFromBridgeName(config.default.bridge);

    if (filterOptions.chainId == null)
        filterOptions.chainId = await common.getBridgeIdFromBridgeName(config.default.chainId);

    let bridgeName = null;

    try {
        bridgeName = config.bridge[filterOptions.bridgeId].bridgeName;
    } catch (error) {
        return (INVALID_BRIDGE_ID);
    }

    const response = await getTokensSupported[`getTokensSupported${bridgeName}`](web3, options);
    return response;
};
