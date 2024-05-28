const GetPool = require('./getPool');
const GetPools = require('./getPools');
const Borrow = require('./borrow');
const Deposit = require('./deposit');
const Liquidate = require('./liquidate');
const Repay = require('./repay');
const Withdraw = require('./withdraw');
const EnterMarket = require('./enterMarket');
const ExitMarket = require('./exitMarket');
const GetRepayAmount = require('./getRepayAmount');
const GetBorrowAmount = require('./getBorrowAmount');
const GetUserAccountData = require('./getUserAccountData');
const EnterMarketStatus = require('./enterMarketStatus');
const SetUserEMode = require('./setUserEMode');
const ExitIsolationMode = require('./exitIsolationMode');
const Migrate = require('./migrate');
const GetAssetInfo = require('./getAssetInfo');
const BundleActions = require('./bundleActions');
const Governer = require('./governer');
const MaxAmounts = require('./getMaxWithdrawableAmount');
const GetClaimedRewards = require('./getClaimedRewards');
const ClaimRewards = require('./claimRewards');
const Transfer = require('./transfer');
const Allow = require('./allow');
const UserPositions = require("./getUserPositions");
const config = require('../../../common/configuration/config.json');
const common = require('../../../common/common');
const errorMessage = require('../../../common/configuration/errorMessage.json');


const INVALID_LENDBORROW_ID = {
    'message': errorMessage.error.message.invalidLendBorrowId,
    'code': errorMessage.error.code.invalidInput
};


exports.getPool = async( web3, options ) => {

    const filterOptions = options;
    filterOptions.lendborrowId = filterOptions.lendborrowId == null ? 
        await common.getLendborrowIdFromLendborrowName(config.default.lendborrow): filterOptions.lendborrowId;
    let borrowName = null;

    try{
        borrowName = config.lendborrow[filterOptions.lendborrowId].lendborrowName;
    } catch (error) {
        return (INVALID_LENDBORROW_ID);
    }

    const pool = await GetPool[`getPool${borrowName}`]( web3, options );
    return (pool);
};

exports.getPools = async( web3, options ) => {

    const filterOptions = options;
    filterOptions.lendborrowId = filterOptions.lendborrowId == null ? 
        await common.getLendborrowIdFromLendborrowName(config.default.lendborrow): filterOptions.lendborrowId;
    let borrowName = null;

    try{
        borrowName = config.lendborrow[filterOptions.lendborrowId].lendborrowName;
    } catch (error) {
        return (INVALID_LENDBORROW_ID);
    }
    const pool = await GetPools[`getPools${borrowName}`]( web3, options );
    return (pool);
};

exports.getRepayAmount = async( web3, options ) => {

    const filterOptions = options;
    filterOptions.lendborrowId = filterOptions.lendborrowId == null ? 
        await common.getLendborrowIdFromLendborrowName(config.default.lendborrow): filterOptions.lendborrowId;
    let borrowName = null;

    try{
        borrowName = config.lendborrow[filterOptions.lendborrowId].lendborrowName;
    } catch (error) {
        return (INVALID_LENDBORROW_ID);
    }

    const repayAmount = await GetRepayAmount[`getRepayAmount${borrowName}`]( web3, options );
    return repayAmount;
};

exports.borrow = async( web3, options ) => {

    const filterOptions = options;
    filterOptions.lendborrowId = filterOptions.lendborrowId == null ? 
        await common.getLendborrowIdFromLendborrowName(config.default.lendborrow): filterOptions.lendborrowId;
    let borrowName = null;
    
    try{
        borrowName = config.lendborrow[filterOptions.lendborrowId].lendborrowName;
    } catch (error) {
        return (INVALID_LENDBORROW_ID);
    }

    const transactionReciept = await Borrow[`borrow${borrowName}`]( web3, options );
    return (transactionReciept);

};


exports.deposit = async( web3, options ) => {

    const filterOptions = options;
    filterOptions.lendborrowId = filterOptions.lendborrowId == null ? 
        await common.getLendborrowIdFromLendborrowName(config.default.lendborrow): filterOptions.lendborrowId;
    let borrowName = null;
    
    try{
        borrowName = config.lendborrow[filterOptions.lendborrowId].lendborrowName;
    } catch (error) {
        return (INVALID_LENDBORROW_ID);
    }
    
    const transactionReciept = await Deposit[`deposit${borrowName}`]( web3, options );
    return (transactionReciept);

};


exports.liquidate = async( web3, options ) => {

    const filterOptions = options;
    filterOptions.lendborrowId = filterOptions.lendborrowId == null ?
        await common.getLendborrowIdFromLendborrowName(config.default.lendborrow): filterOptions.lendborrowId;
    let borrowName = null;
    
    try{
        borrowName = config.lendborrow[filterOptions.lendborrowId].lendborrowName;
    } catch (error) {
        return (INVALID_LENDBORROW_ID);
    }

    const transactionReciept = await Liquidate[`liquidate${borrowName}`]( web3, options );
    return (transactionReciept);

};


exports.repay = async( web3, options ) => {

    const filterOptions = options;
    filterOptions.lendborrowId = filterOptions.lendborrowId == null ? 
        await common.getLendborrowIdFromLendborrowName(config.default.lendborrow): filterOptions.lendborrowId;
    let borrowName = null;
    
    try{
        borrowName = config.lendborrow[filterOptions.lendborrowId].lendborrowName;
    } catch (error) {
        return (INVALID_LENDBORROW_ID);
    }

    const transactionReciept = await Repay[`repay${borrowName}`]( web3, options );
    return (transactionReciept);

};


exports.withdraw = async( web3, options ) => {

    const filterOptions = options;
    filterOptions.lendborrowId = filterOptions.lendborrowId == null ? 
        await common.getLendborrowIdFromLendborrowName(config.default.lendborrow): filterOptions.lendborrowId;
    let borrowName = null;
    
    try{
        borrowName = config.lendborrow[filterOptions.lendborrowId].lendborrowName;
    } catch (error) {
        return (INVALID_LENDBORROW_ID);
    }
    const transactionReciept = await Withdraw[`withdraw${borrowName}`]( web3, options );
    return (transactionReciept);
    
};

exports.allow = async( web3, options ) => {

    const filterOptions = options;
    filterOptions.lendborrowId = filterOptions.lendborrowId == null ? 
        await common.getLendborrowIdFromLendborrowName('CompoundV3'): filterOptions.lendborrowId;
    let borrowName = null;
    
    try{
        borrowName = config.lendborrow[filterOptions.lendborrowId].lendborrowName;
    } catch (error) {
        return (INVALID_LENDBORROW_ID);
    }
    const transactionReciept = await Allow[`allow${borrowName}`]( web3, options );
    return (transactionReciept);
    
};


exports.enterMarket = async( web3, options ) => {

    const filterOptions = options;
    filterOptions.lendborrowId = filterOptions.lendborrowId == null ? 
        await common.getLendborrowIdFromLendborrowName('Compound'): filterOptions.lendborrowId;
    let borrowName = null;
    
    try{
        borrowName = config.lendborrow[filterOptions.lendborrowId].lendborrowName;
    } catch (error) {
        return (INVALID_LENDBORROW_ID);
    }
    const transactionReciept = await EnterMarket[`enterMarket${borrowName}`]( web3, options );
    return (transactionReciept);
    
};

exports.exitMarket = async( web3, options ) => {
    const filterOptions = options;
    filterOptions.lendborrowId = filterOptions.lendborrowId == null ? 
        await common.getLendborrowIdFromLendborrowName('Compound'): filterOptions.lendborrowId;
    let borrowName = null;
    
    try{
        borrowName = config.lendborrow[filterOptions.lendborrowId].lendborrowName;
    } catch (error) {
        return (INVALID_LENDBORROW_ID);
    }
    const transactionReciept = await ExitMarket[`exitMarket${borrowName}`]( web3, options );
    return (transactionReciept);
    
};

exports.getBorrowAmount = async( web3, options ) => {

    const filterOptions = options;
    filterOptions.lendborrowId = filterOptions.lendborrowId == null ? 
    await common.getLendborrowIdFromLendborrowName(config.default.lendborrow): filterOptions.lendborrowId;
    let borrowName = null;
    try{
        borrowName = config.lendborrow[filterOptions.lendborrowId].lendborrowName;
    } catch (error) {
        return (INVALID_LENDBORROW_ID);
    }
    const transactionReciept = await GetBorrowAmount[`getBorrowAmount${borrowName}`]( web3, options );
    return (transactionReciept);
    
};

exports.getUserAccountData = async( web3, options ) => {

    const filterOptions = options;
    filterOptions.lendborrowId = filterOptions.lendborrowId == null ? 
    await common.getLendborrowIdFromLendborrowName(config.default.lendborrow): filterOptions.lendborrowId;
    let borrowName = null;
    try{
        borrowName = config.lendborrow[filterOptions.lendborrowId].lendborrowName;
    } catch (error) {
        return (INVALID_LENDBORROW_ID);
    }
    const transactionReciept = await GetUserAccountData[`getUserAccountData${borrowName}`]( web3, options );
    return (transactionReciept);
    
};

exports.enterMarketStatus = async( web3, options ) => {

    const filterOptions = options;
    filterOptions.lendborrowId = filterOptions.lendborrowId == null ? 
    await common.getLendborrowIdFromLendborrowName('Compound'): filterOptions.lendborrowId;
    let borrowName = null;
    try{
        borrowName = config.lendborrow[filterOptions.lendborrowId].lendborrowName;
    } catch (error) {
        return (INVALID_LENDBORROW_ID);
    }
    const transactionReciept = await EnterMarketStatus[`enterMarketStatus${borrowName}`]( web3, options );
    return (transactionReciept);
    
};

exports.getAssetInfo = async( web3, options ) => {

    const filterOptions = options;
    filterOptions.lendborrowId = filterOptions.lendborrowId == null ? 
    await common.getLendborrowIdFromLendborrowName('CompoundV3'): filterOptions.lendborrowId;
    let borrowName = null;
    try{
        borrowName = config.lendborrow[filterOptions.lendborrowId].lendborrowName;
    } catch (error) {
        return (INVALID_LENDBORROW_ID);
    }
    const transactionReciept = await GetAssetInfo[`getAssetInfo${borrowName}`]( web3, options );
    return (transactionReciept);
    
};

exports.setUserEMode = async( web3, options ) => {

    const filterOptions = options;
    filterOptions.lendborrowId = filterOptions.lendborrowId == null ? 
    await common.getLendborrowIdFromLendborrowName('AaveV3'): filterOptions.lendborrowId;
    let borrowName = null;
    try{
        borrowName = config.lendborrow[filterOptions.lendborrowId].lendborrowName;
    } catch (error) {
        return (INVALID_LENDBORROW_ID);
    }
    const transactionReciept = await SetUserEMode[`setUserEMode${borrowName}`]( web3, options );
    return (transactionReciept);
    
};

exports.bundleActions = async( web3, options ) => {

    const filterOptions = options;
    filterOptions.lendborrowId = filterOptions.lendborrowId == null ? 
    await common.getLendborrowIdFromLendborrowName('CompoundV3'): filterOptions.lendborrowId;
    let borrowName = null;
    try{
        borrowName = config.lendborrow[filterOptions.lendborrowId].lendborrowName;
    } catch (error) {
        return (INVALID_LENDBORROW_ID);
    }

    const transactionReciept = await BundleActions[`bundleActions${borrowName}`]( web3, options );
    return (transactionReciept);
    
};

exports.exitIsolationMode = async( web3, options ) => {

    const filterOptions = options;
    filterOptions.lendborrowId = filterOptions.lendborrowId == null ? 
    await common.getLendborrowIdFromLendborrowName('AaveV3'): filterOptions.lendborrowId;
    let borrowName = null;
    try{
        borrowName = config.lendborrow[filterOptions.lendborrowId].lendborrowName;
    } catch (error) {
        return (INVALID_LENDBORROW_ID);
    }
    const transactionReciept = await ExitIsolationMode[`exitIsolationMode${borrowName}`]( web3, options );
    return (transactionReciept);
    
};

exports.migrate = async( web3, options ) => {

    const filterOptions = options;
    filterOptions.lendborrowId = filterOptions.lendborrowId == null ? 
    await common.getLendborrowIdFromLendborrowName('AaveV3'): filterOptions.lendborrowId;
    let borrowName = null;
    try{
        borrowName = config.lendborrow[filterOptions.lendborrowId].lendborrowName;
    } catch (error) {
        return (INVALID_LENDBORROW_ID);
    }
    const transactionReciept = await Migrate[`migrate${borrowName}`]( web3, options );
    return (transactionReciept);
    
};

exports.claimRewards = async( web3, options ) => {

    const filterOptions = options;
    filterOptions.lendborrowId = filterOptions.lendborrowId == null ? 
    await common.getLendborrowIdFromLendborrowName('CompoundV3'): filterOptions.lendborrowId;
    let borrowName = null;
    try{
        borrowName = config.lendborrow[filterOptions.lendborrowId].lendborrowName;
    } catch (error) {
        return (INVALID_LENDBORROW_ID);
    }
    const transactionReciept = await ClaimRewards[`claimRewards${borrowName}`]( web3, options );
    return (transactionReciept);
    
};

exports.transfer = async( web3, options ) => {

    const filterOptions = options;
    filterOptions.lendborrowId = filterOptions.lendborrowId == null ? 
    await common.getLendborrowIdFromLendborrowName('CompoundV3'): filterOptions.lendborrowId;
    let borrowName = null;
    try{
        borrowName = config.lendborrow[filterOptions.lendborrowId].lendborrowName;
    } catch (error) {
        return (INVALID_LENDBORROW_ID);
    }
    const transactionReciept = await Transfer[`transfer${borrowName}`]( web3, options );
    return (transactionReciept);
    
};

exports.governer = async( web3, options ) => {

    const filterOptions = options;
    filterOptions.lendborrowId = filterOptions.lendborrowId == null ? 
    await common.getLendborrowIdFromLendborrowName('CompoundV3'): filterOptions.lendborrowId;
    let borrowName = null;
    try{
        borrowName = config.lendborrow[filterOptions.lendborrowId].lendborrowName;
    } catch (error) {
        return (INVALID_LENDBORROW_ID);
    }
    const transactionReciept = await Governer[`governerData${borrowName}`]( web3, options );
    return (transactionReciept);
    
};

exports.getMaxAmounts = async( web3, options ) => {

    const filterOptions = options;
    filterOptions.lendborrowId = filterOptions.lendborrowId == null ? 
    await common.getLendborrowIdFromLendborrowName('CompoundV3'): filterOptions.lendborrowId;
    let borrowName = null;
    try{
        borrowName = config.lendborrow[filterOptions.lendborrowId].lendborrowName;
    } catch (error) {
        return (INVALID_LENDBORROW_ID);
    }
    const transactionReciept = await MaxAmounts[`getMaxAmounts${borrowName}`]( web3, options );
    return (transactionReciept);
    
};

exports.getClaimedRewards = async( web3, options ) => {

    const filterOptions = options;
    filterOptions.lendborrowId = filterOptions.lendborrowId == null ? 
    await common.getLendborrowIdFromLendborrowName('CompoundV3'): filterOptions.lendborrowId;
    let borrowName = null;
    try{
        borrowName = config.lendborrow[filterOptions.lendborrowId].lendborrowName;
    } catch (error) {
        return (INVALID_LENDBORROW_ID);
    }
    const transactionReciept = await GetClaimedRewards[`getClaimedRewards${borrowName}`]( web3, options );
    return (transactionReciept);
    
};

exports.getUserPositions = async( web3, options ) => {

    const filterOptions = options;
    filterOptions.lendborrowId = filterOptions.lendborrowId == null ? 
    await common.getLendborrowIdFromLendborrowName(config.default.lendborrow): filterOptions.lendborrowId;
    let borrowName = null;
    try{
        borrowName = config.lendborrow[filterOptions.lendborrowId].lendborrowName;
    } catch (error) {
        return (INVALID_LENDBORROW_ID);
    }
    const transactionReciept = await UserPositions[`getUserPositions${borrowName}`]( web3, options );
    return (transactionReciept);
    
};