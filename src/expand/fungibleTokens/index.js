const Approve = require('./approve');
const ConvertBaseTokenToWrapToken = require('./convertBaseTokenToWrapToken');
const ConvertWrapTokenToBaseToken = require('./convertWrapTokenToBaseToken');
const GetDecimals = require('./getDecimals');
const GetName = require('./getName');
const GetSymbol = require('./getSymbol');
const GetTokenDetails = require('./getTokenDetails');
const Transfer = require('./transfer');
const TransferFrom = require('./transferFrom');
const GetUserAllowance = require('./getUserAllowance');
const GetUserBalance = require('./getUserBalance');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const config = require('../../../common/configuration/config.json');
const common = require('../../../common/common');
const getHistoricalTransactions = require('./getHistoricalTransactions');
const getHistoricalLogs = require('./getHistoricalLogs');
const getHistoricalLogsWeth = require('./getHistoricalLogsWeth');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});

exports.approve = async(web3, options) => {

    try {
        let {chainId} = options;
        const {chainSymbol} = options;

        chainId = await common.getChainId( { chainId, chainSymbol } );
        const {chainName} = config.chains[chainId];

        const transaction = await Approve[`approve${chainName}`]( web3, options );
        return (transaction);
    } catch (error) {
        return throwErrorMessage("invalidInput");
    }

};


exports.getDecimals = async(web3, options) => {

    try {
        let {chainId} = options;
        const {chainSymbol} = options;

        chainId = await common.getChainId( { chainId, chainSymbol } );
        const {chainName} = config.chains[chainId];

        const transaction = await GetDecimals[`getDecimals${chainName}`]( web3, options );
        return (transaction);
        
    } catch (error) {
        return throwErrorMessage("invalidInput");
    }

};

exports.convertWrapTokenToBaseToken = async(web3, options) => {

    try {
        let {chainId} = options;
        const {chainSymbol} = options;

        chainId = await common.getChainId( { chainId, chainSymbol } );
        const {chainName} = config.chains[chainId];

        const transaction = await ConvertWrapTokenToBaseToken[`convertWrapTokenToBaseToken${chainName}`]( web3, options );
        return (transaction);
        
    } catch (error) {
        return throwErrorMessage("invalidInput");
    }

};

exports.convertBaseTokenToWrapToken = async(web3, options) => {

    try {
        let {chainId} = options;
        const {chainSymbol} = options;

        chainId = await common.getChainId( { chainId, chainSymbol } );
        const {chainName} = config.chains[chainId];

        const transaction = await ConvertBaseTokenToWrapToken[`convertBaseTokenToWrapToken${chainName}`]( web3, options );
        return (transaction);
        
    } catch (error) {
        return throwErrorMessage("invalidInput");
    }

};

exports.getName = async(web3, options) => {
    
    try {
        
        let {chainId} = options;
        const {chainSymbol} = options;
        chainId = await common.getChainId( { chainId, chainSymbol } );
        const {chainName} = config.chains[chainId];
        const transaction = await GetName[`getName${chainName}`]( web3, options );
        return (transaction);
    } catch (error) {
        return throwErrorMessage("invalidInput");
    }

};

exports.getSymbol = async(web3, options) => {

    try {
        const filterOptions = options;
        let {chainId} = filterOptions;
        const {chainSymbol} = filterOptions;
        chainId = await common.getChainId( { chainId, chainSymbol } );
        const {chainName} = config.chains[chainId];
        filterOptions.chainId = chainId;
        const transaction = await GetSymbol[`getSymbol${chainName}`]( web3, filterOptions );
        return (transaction);
    } catch (error) {
        return throwErrorMessage("invalidInput");
    }

};

exports.getTokenDetails = async(web3, options) => {

    try {
        const filterOptions = options;
        let {chainId} = filterOptions;
        const {chainSymbol} = filterOptions;
        chainId = await common.getChainId( { chainId, chainSymbol } );
        const {chainName} = config.chains[chainId];
        filterOptions.chainId = chainId;
        const transaction = await GetTokenDetails[`getTokenDetails${chainName}`]( web3, filterOptions );
        return (transaction);
    } catch (error) {
        return throwErrorMessage("invalidInput");
    }

};

exports.transfer = async(web3, options) => {
    
    try {
        let {chainId} = options;
        const {chainSymbol} = options;
        chainId = await common.getChainId( { chainId, chainSymbol } );
        const {chainName} = config.chains[chainId];
        const transaction = await Transfer[`transfer${chainName}`]( web3, options );
        return (transaction);
    } catch (error) {
        return throwErrorMessage("invalidInput");
    }

};

exports.transferFrom = async(web3, options) => {

    try {
        let {chainId} = options;
        const {chainSymbol} = options;
        chainId = await common.getChainId( { chainId, chainSymbol } );
        const {chainName} = config.chains[chainId];
        const transaction = await TransferFrom[`transferFrom${chainName}`]( web3, options );
        return (transaction);
    } catch (error) {
        return throwErrorMessage("invalidInput");
    }

};

exports.getUserAllowance = async(web3, options) => {
    try {
        let {chainId} = options;
        const {chainSymbol} = options;
        chainId = await common.getChainId( { chainId, chainSymbol } );
        const {chainName} = config.chains[chainId];
        const transaction = await GetUserAllowance[`getUserAllowance${chainName}`]( web3, options );
        return (transaction);
    } catch (error) {
        return throwErrorMessage("invalidInput");
    }
};

exports.getUserBalance = async(web3, options) => {
    try {
        let {chainId} = options;
        const {chainSymbol} = options;
        chainId = await common.getChainId( { chainId, chainSymbol } );
        const {chainName} = config.chains[chainId];
        const transaction = await GetUserBalance[`getUserBalance${chainName}`]( web3, options );
        return (transaction);
    } catch (error) {
        return throwErrorMessage("invalidInput");
    }
};

exports.getWethBalance = async(web3, options) => {
    try {
        let {chainId} = options;
        const {chainSymbol} = options;
        chainId = await common.getChainId( { chainId, chainSymbol } );
        if(!(chainId in config.chains)) return throwErrorMessage('invalidChainId');
        const {chainName} = config.chains[chainId];
        const filterOptions = options;
        filterOptions.tokenAddress = config.wethAddress[chainId];
        if(!(chainId in config.wethAddress)) return throwErrorMessage("invalidFunction");
        const transaction = await GetUserBalance[`getUserBalance${chainName}`]( web3, options );
        return (transaction);
    } catch (error) {
        return throwErrorMessage("invalidInput");

    }
};


exports.getHistoricalTransactions = async (web3, options) => {
    const filterOptions = options;
    let { chainId } = filterOptions;
    const { chainSymbol } = filterOptions;
    chainId = await common.getChainId({ chainId, chainSymbol });

    let chainName;
    try {
        chainName = config.chains[chainId].chainName;
    } catch (error) {
        return throwErrorMessage("invalidChainId");
    }

    if (!(chainId in config.fungibleToken)) return throwErrorMessage("invalidFunction");

    filterOptions.chainId = chainId;
    filterOptions.chainName = chainName;
    const transaction = await getHistoricalTransactions[`getHistoricalTransactions${chainName}`](web3, filterOptions);
    return (transaction);
};

exports.getHistoricalLogs = async (web3, options) => {
    const filterOptions = options;
    let { chainId } = filterOptions;
    const { chainSymbol } = filterOptions;
    chainId = await common.getChainId({ chainId, chainSymbol });

    let chainName;
    try {
        chainName = config.chains[chainId].chainName;
    } catch (error) {
        return throwErrorMessage("invalidChainId");
    }

    if (!(chainId in config.fungibleToken)) return throwErrorMessage("invalidFunction");

    filterOptions.chainId = chainId;
    const logs = await getHistoricalLogs[`getHistoricalLogs${chainName}`](web3, filterOptions);
    return (logs);
};

exports.getHistoricalLogsWeth = async (web3, options) => {
    const filterOptions = options;
    let { chainId } = filterOptions;
    const { chainSymbol } = filterOptions;
    chainId = await common.getChainId({ chainId, chainSymbol });
    let chainName;
    try{
        chainName = config.chains[chainId].chainName;
    }catch (err) {
        return throwErrorMessage("invalidChainId");
    } 

    if (!(chainId in config.weth)) return throwErrorMessage("invalidFunction");

    filterOptions.chainId = chainId;
    filterOptions.chainName = chainName;
    const logs = await getHistoricalLogsWeth.getHistoricalLogsWeth(web3, filterOptions);
    return (logs);
};

exports.getWethHistoricalTransactions = async (web3, options) => {
    const filterOptions = options;
    let { chainId } = filterOptions;
    const { chainSymbol } = filterOptions;
    chainId = await common.getChainId({ chainId, chainSymbol });
    if (!(chainId in config.fungibleToken)) return throwErrorMessage("invalidFunction");

    let chainName;
    try {
        chainName = config.chains[chainId].chainName;
    } catch (error) {
        return throwErrorMessage("invalidChainId");
    }
    if(!(chainId in config.wethAddress)) return throwErrorMessage("invalidFunction");
    filterOptions.chainId = chainId;
    filterOptions.chainName = chainName;
    filterOptions.tokenAddress = config.wethAddress[chainId];
    try {
        const transaction = await getHistoricalTransactions[`getHistoricalTransactions${chainName}`](web3, filterOptions);
        return (transaction);
    } catch (error) {
        return error;
    }
};
