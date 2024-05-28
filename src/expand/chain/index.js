const GetTransaction = require('./getTransaction');
const GetHistoricalRewards = require('./getHistoricalRewards');
const GetBlock = require('./getBlock');
const GetFlashbotBlock = require('./getFlashbotBlocks');
const GetFlashbotTransactions = require('./getFlashbotTransactions');
const GetFlashbotBundle = require('./getFlashbotBundle');

const GetBalance = require('./getBalance');
const GetGasPrice = require('./getGasPrice');
const GetStorage = require('./getStorage');
const SendTransaction = require('./sendTransaction');
const GetGasFees = require('./getGasFees');
const PostGeneric = require('./postGeneric');
const DecodeTransaction = require('./decodeTransaction');
const GetUserPortfolio = require('./getUserPortfolio');
const GetUserTransaction = require('./getUserTransaction');
const SimulateTransaction = require('./simulateTransaction');
const GetEvents = require('./getEvents');
const GetLatestLedger = require('./getLatestLedger');
const GetTokenMarketData = require('./getTokenMarketData');
const EstimateGas = require('./estimateGas');

const config = require('../../../common/configuration/config.json');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const common = require('../../../common/common');
const tokenConfig = require('../../../common/configuration/tokenConfig.json');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
  });

const privateTransactionDataNotSupported = {
    "status": 300,
    "msg": "private transactions on this chain not supported yet"
};

exports.getTransaction = async(web3, options) => {

    const filterOptions = options;
    let {chainId} = filterOptions;

    filterOptions.function = (chainId === '1100' || chainId === '1101') ? "getTransactionTon()" : "getTransaction()";
    const validJson = await schemaValidator.validateInput(options);

    if ( !validJson.valid ) {
        return (validJson);
    }

    const {chainSymbol} = filterOptions;

    chainId = await common.getChainId( { chainId, chainSymbol } );
    let chainName; 

    try {
        chainName = config.chains[chainId].chainName;
    } catch (error) {
        return (throwErrorMessage("invalidChainId"));
    }

    filterOptions.chainId = chainId;
    const transaction = await GetTransaction[`getTransaction${chainName}`]( web3, filterOptions );
    return (transaction);

};

exports.getHistoricalRewards = async(web3, options) => {

    const filterOptions = options;
    filterOptions.function = "getHistoricalRewards()";
    const validJson = await schemaValidator.validateInput(options);

    if ( !validJson.valid ) {
        return (validJson);
    }

    let {chainId} = filterOptions;
    const {chainSymbol } = filterOptions;

    chainId = await common.getChainId( { chainId, chainSymbol } );
    let chainName; 

    try {
        chainName = config.chains[chainId].chainName;
    } catch (error) {
        if(chainSymbol) return (throwErrorMessage("invalidChainSymbol"));
        return (throwErrorMessage("invalidChainId"));
    }

    if (!(config.getHistoricalRewards[chainId])) return throwErrorMessage("invalidFunction");



    const alltransaction = await GetHistoricalRewards[`getHistoricalRewards${chainName}`]( web3, options );
    return (alltransaction);

};

exports.getBlock = async(web3, options) => {
    const {chainSymbol} = options;
    let {chainId} = options;

    chainId = await common.getChainId( { chainId, chainSymbol } );
    let chainName;
    try {
        chainName = config.chains[chainId].chainName;
    } catch (error) {
        return (throwErrorMessage("invalidChainId"));
    }

    const block = await GetBlock[`getBlock${chainName}`]( web3, {...options, chainId} );
    return (block);

};

exports.getFlashbotBlocks = async(web3, options) => {

    const filterOptions = options;
    filterOptions.function = "getFlashbotBlocks()";
    const validJson = await schemaValidator.validateInput(options);

    if ( !validJson.valid ) {
        return (validJson);
    }

    let {chainId } = filterOptions;
    const {chainSymbol} = filterOptions;

    chainId = await common.getChainId( { chainId, chainSymbol } );
    try {
        console.log(config.chains[chainId].chainName);
    } catch (error) {
        return (throwErrorMessage("invalidChainId"));
    }
    
    if(options.chainId !== "1"){
        return privateTransactionDataNotSupported;
    }

    const block = await GetFlashbotBlock.getFlashbotBlocks();
    return (block);

};

exports.getFlashbotTransactions = async(web3, options) => {

    const filterOptions = options;
    filterOptions.function = "getFlashbotTransactions()";
    const validJson = await schemaValidator.validateInput(options);

    if ( !validJson.valid ) {
        return (validJson);
    }

    let {chainId } = filterOptions;
    const {chainSymbol} = filterOptions;

    chainId = await common.getChainId( { chainId, chainSymbol } );
    try {
        console.log(config.chains[chainId].chainName);
    } catch (error) {
        return (throwErrorMessage("invalidChainId"));
    }
    
    if(options.chainId !== "1"){
        return privateTransactionDataNotSupported;
    }

    const block = await GetFlashbotTransactions.getFlashbotTransactions();
    return (block);

};


exports.getFlashbotBundle = async(web3, options) => {

    const filterOptions = options;
    filterOptions.function = "getFlashbotBundle()";
    const validJson = await schemaValidator.validateInput(options);

    if ( !validJson.valid ) {
        return (validJson);
    }

    // eslint-disable-next-line prefer-const
    let {chainId, bundleHash } = filterOptions;
    const {chainSymbol} = filterOptions;

    chainId = await common.getChainId( { chainId, chainSymbol } );
    try {
        console.log(config.chains[chainId].chainName);
    } catch (error) {
        return (throwErrorMessage("invalidChainId"));
    }
    
    if(options.chainId !== "1"){
        return privateTransactionDataNotSupported;
    }

    const block = await GetFlashbotBundle.getFlashbotBundle(bundleHash);
    return (block);

};

exports.getPublicRpc = async(web3, options) => {

    const filterOptions = options;
    filterOptions.function = "getPublicRpc()";
    const validJson = await schemaValidator.validateInput(options);

    if ( !validJson.valid ) {
        return (validJson);
    }

    let {chainId} = filterOptions;
    const {chainSymbol} = filterOptions;

    chainId = await common.getChainId( { chainId, chainSymbol } );
    let publicRpc;
    try {
        publicRpc = config.chains[chainId].publicRpc;
    } catch (error) {
        return (throwErrorMessage("invalidChainId"));
    }

    return ({ 'rpc': publicRpc });

};


exports.getBalance = async(web3, options) => {

    const filterOptions = options;
    let {chainId} = filterOptions;

    filterOptions.function = (chainId === "1500" || chainId === "1501") ? "getXLMBalance" : "getBalance()";
    const validJson = await schemaValidator.validateInput(options);

    if ( !validJson.valid ) {
        return (validJson);
    }

    const {chainSymbol} = filterOptions;

    chainId = await common.getChainId( { chainId, chainSymbol } );
    let chainName;

    try {
        chainName = config.chains[chainId].chainName;
    } catch (error) {
        return (throwErrorMessage("invalidChainId"));
    }
    // eslint-disable-next-line no-param-reassign
    web3.chainId = chainId;
    const balance = await GetBalance[`getBalance${chainName}`]( web3, filterOptions );
    return (balance);

};


exports.getGasPrice = async(web3, options) => {

    const filterOptions = options;
    filterOptions.function = "getGasPrice()";
    const validJson = await schemaValidator.validateInput(options);

    if ( !validJson.valid ) {
        return (validJson);
    }

    let {chainId} = filterOptions;
    const {chainSymbol} = filterOptions;

    chainId = await common.getChainId( { chainId, chainSymbol } );
    let chainName;

    try {
        chainName = config.chains[chainId].chainName;
    } catch (error) {
        return (throwErrorMessage("invalidChainId"));
    }

    filterOptions.chainId = chainId;
    const balance = await GetGasPrice[`getGasPrice${chainName}`]( web3, filterOptions );
    return (balance);

};


exports.getStorage = async(web3, options) => {

    let {chainId} = options;
    const {chainSymbol} = options;

    chainId = await common.getChainId( { chainId, chainSymbol } );
    let chainName;

    try {
        chainName = config.chains[chainId].chainName;
    } catch (error) {
        return (throwErrorMessage("invalidChainId"));
    }

    const storage = await GetStorage[`getStorage${chainName}`]( web3, options );
    return storage;
};


exports.sendTransaction = async(web3, options) => {

    const filterOptions = options;
    filterOptions.function = "sendTransaction()";
    const validJson = await schemaValidator.validateInput(options);

    if ( !validJson.valid ) {
        return (validJson);
    }

    let {chainId} = filterOptions;
    const {chainSymbol} = filterOptions;

    chainId = await common.getChainId( { chainId, chainSymbol } );
    filterOptions.chainId = chainId;
    let chainName;

    try {
        chainName = config.chains[chainId].chainName;
    } catch (error) {
        return (throwErrorMessage("invalidChainId"));
    }

    const transactionReceipt = await SendTransaction[`sendTransaction${chainName}`]( web3, filterOptions );
    return (transactionReceipt);

};


exports.decodeTransaction = async(web3, options) => {

    const filterOptions = options;
    filterOptions.function = "decodeTransaction()";
    const validJson = await schemaValidator.validateInput(options);

    if ( !validJson.valid ) {
        return (validJson);
    }

    let {chainId} = filterOptions;
    const {chainSymbol} = filterOptions;

    chainId = await common.getChainId( { chainId, chainSymbol } );
    filterOptions.chainId = chainId;
    let chainName;

    try {
        chainName = config.chains[chainId].chainName;
    } catch (error) {
        return (throwErrorMessage("invalidChainId"));
    }

    const transactionReceipt = await DecodeTransaction[`decodeTransaction${chainName}`]( web3, filterOptions );
    return (transactionReceipt);

};

exports.postGeneric = async (web3, options) => {

    const filterOptions = options;
    filterOptions.function = "postGeneric()";
    const validJson = await schemaValidator.validateInput(options);

    if (!validJson.valid) {
        return (validJson);
    }

    let { chainId } = filterOptions;
    const { chainSymbol } = filterOptions;

    chainId = await common.getChainId({ chainId, chainSymbol });
    filterOptions.chainId = chainId;
    let chainName;

    try {
        chainName = config.chains[chainId].chainName;
    }
    catch (error) {
        return (throwErrorMessage("invalidChainId"));
    }

    const response = await PostGeneric[`postGeneric${chainName}`](web3, filterOptions);
    return (response);

};

exports.getGasFees = async(web3, options) => {

    const filterOptions = options;
    filterOptions.function = "getGasFees()";
    const validJson = await schemaValidator.validateInput(options);

    if ( !validJson.valid ) {
        return (validJson);
    }

    let {chainId} = filterOptions;
    const {chainSymbol} = filterOptions;

    chainId = await common.getChainId( { chainId, chainSymbol } );
    filterOptions.chainId = chainId;
    let chainName;

    try {
        chainName = config.chains[chainId].chainName;
    } catch (error) {
        return (throwErrorMessage("invalidChainId"));
    }

    if (!(chainId in config.supportedGasFees)) return (throwErrorMessage("invalidFunction"));

    const response = await GetGasFees[`getGasFees${chainName}`]( web3, filterOptions );
    return (response);

};

exports.estimateGas = async(web3, options) => {
    const filterOptions = options;
    let {chainId} = filterOptions;
    const {chainSymbol} = filterOptions;

    chainId = await common.getChainId( { chainId, chainSymbol } );
    filterOptions.chainId = chainId;
    let chainName;

    try {
        chainName = config.chains[chainId].chainName;
    } catch (error) {
        return (throwErrorMessage("invalidChainId"));
    }

    const response = await EstimateGas[`estimateGas${chainName}`]( web3, filterOptions );
    return (response);
};

exports.getTokenAddress = async(web3, options) => {

    const filterOptions = options;
    filterOptions.function = "getTokenAddress()";
    const validJson = await schemaValidator.validateInput(options);

    if ( !validJson.valid ) {
        return (validJson);
    }

    const uppercaseToken = {};
    let {chainId} = filterOptions;
    const {chainSymbol} = filterOptions;
    const {tokenSymbol} = filterOptions;

    chainId = await common.getChainId( { chainId, chainSymbol } );
    let tokenAddress;

    if (!(chainId in tokenConfig)) return (throwErrorMessage("invalidChainId"));

    for (const key in tokenConfig[chainId]) {
        // eslint-disable-next-line no-prototype-builtins
        if (tokenConfig[chainId].hasOwnProperty(key)) {
          const uppercaseKey = key.toUpperCase();
          uppercaseToken[uppercaseKey] = tokenConfig[chainId][key];
        }
    }

    if(!(((tokenSymbol).toUpperCase() in uppercaseToken))) return throwErrorMessage("invalidInput");

    try {
        tokenAddress = uppercaseToken[tokenSymbol.toUpperCase()];
    } catch (error) {
        return (error);
    }

    return ({ 'tokenAddress': tokenAddress });

};

exports.getUserPortfolio = async(web3, options) => {
    const filterOptions = options;

    let {chainId} = filterOptions;
    const {chainSymbol} = filterOptions;

    chainId = await common.getChainId( { chainId, chainSymbol } );

    let chainName;

    try {
        chainName = config.chains[chainId].chainName;
    } catch (error) {
        return (throwErrorMessage("invalidChainId"));
    }

    filterOptions.chainId = chainId;
    const portfolio = await GetUserPortfolio[`getUserPortfolio${chainName}`]( web3, filterOptions );
    return (portfolio);
};

exports.getTokenMarketData = async(web3, options) => {
    const filterOptions = options;

    let {chainId} = filterOptions;
    const {chainSymbol} = filterOptions;

    chainId = await common.getChainId( { chainId, chainSymbol } );

    let chainName;

    try {
        chainName = config.chains[chainId].chainName;
    } catch (error) {
        return (throwErrorMessage("invalidChainId"));
    }

    if(chainId !== "1") return (throwErrorMessage("invalidFunction"));
    filterOptions.chainId = chainId;
    
    const portfolio = await GetTokenMarketData[`getTokenMarketData${chainName}`]( web3, filterOptions );
    return (portfolio);
};

exports.getUserTransaction = async(web3, options) => {

    const filterOptions = options;

    let {chainId} = filterOptions;
    const {chainSymbol} = filterOptions;
    chainId = await common.getChainId({ chainId, chainSymbol });

    let chainName;

    try {
        chainName = config.chains[chainId].chainName;
    } catch (error) {
        return (throwErrorMessage("invalidChainId"));
    }

    if (!(config.historicalUserTxSupportedChains.includes(chainId))) return (throwErrorMessage("invalidFunction"));
    filterOptions.chainId = chainId;
    const transaction = await GetUserTransaction[`getUserTransaction${chainName}`](web3, filterOptions);
    return (transaction);
};

exports.simulateTransaction = async(web3, options) => {
    let {chainId} = options;
    const {chainSymbol} = options;
    chainId = await common.getChainId({ chainId, chainSymbol });

    let chainName;
    try {
        chainName = config.chains[chainId].chainName;
    } catch (error) {
        return (throwErrorMessage("invalidChainId"));
    }

    if (!config.simulateTxSupportedChains.includes(chainId)) return (throwErrorMessage("invalidFunction"));
    const transaction = await SimulateTransaction[`simulateTransaction${chainName}`](web3, {...options, chainId});
    return (transaction);
};

exports.getEvents = async(web3, options) => {
    let {chainId} = options;
    const {chainSymbol} = options;
    chainId = await common.getChainId({ chainId, chainSymbol });

    let chainName;
    try {
        chainName = config.chains[chainId].chainName;
    } catch (error) {
        return throwErrorMessage("invalidChainId");
    }

    if (!config.getEventSupportedChains.includes(chainId)) return (throwErrorMessage("invalidFunction"));
    const transaction = await GetEvents[`getEvents${chainName}`](web3, {...options, chainId});
    return (transaction);
};

exports.getLatestLedger = async (web3, options) => {
    let { chainId } = options;
    const { chainSymbol } = options;

    chainId = await common.getChainId({ chainId, chainSymbol });
    let chainName;

    try {
        chainName = config.chains[chainId].chainName;
    } catch (error) {
        return throwErrorMessage("invalidChainId");
    }

    if (!config.getLatestLedgerSupportedChains.includes(chainId)) return throwErrorMessage("notApplicable");
    const transaction = await GetLatestLedger[`getLatestLedger${chainName}`](web3, { ...options, chainId });
    return (transaction);
};
