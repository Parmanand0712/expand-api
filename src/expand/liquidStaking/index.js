const getStake = require('./getStake');
const getRewards = require('./getRewards');
const getAPR = require('./getAPR');
const stake = require('./stake');
const approveWithdrawals = require('./approveWithdrawals');
const wrap = require('./wrap');
const unwrap = require('./unwrap');
const withdraw = require('./reqWithdrawal');
const claim  = require('./claim');
const decreaseAllowance = require('./decreaseAllowance');
const increaseAllowance = require('./increaseAllowance');
const allowance = require('./getAllowance');
const withdrawalcalls = require('./getWithdrawalCalls');
const mint = require('./mint');
const burn = require('./burn');
const common = require('../../../common/common');

const errorMessage = require('../../../common/configuration/errorMessage.json');
const config = require('../../../common/configuration/config.json');

const invalidStakingProtocolId = {
    'message': errorMessage.error.message.invalidStakingProtocolId,
    'code': errorMessage.error.code.invalidInput
};


exports.getStake = async(web3, options) => {

    const filterOptions = options;
    filterOptions.liquidStakingId = filterOptions.liquidStakingId == null ?
        await common.getliquidStakingProtocolIdFromProtocolName(config.default.liquidStakingProtocol) : filterOptions.liquidStakingId;
    let liquidStakingProtocol = null;

    try {
        liquidStakingProtocol = config.liquidStaking[filterOptions.liquidStakingId].stakeProtocolName;
    } catch(error){
        return (invalidStakingProtocolId);
    }
    console.log(`getStake${liquidStakingProtocol}`);

    const stakeData = await getStake[`getStake${liquidStakingProtocol}`](web3, filterOptions);
    return stakeData;

};

exports.getAPR = async(web3, options) => {

    const filterOptions = options;
    filterOptions.liquidStakingId = filterOptions.liquidStakingId == null ?
        await common.getliquidStakingProtocolIdFromProtocolName(config.default.liquidStakingProtocol) : filterOptions.liquidStakingId;
    let liquidStakingProtocol = null;

    try {
        liquidStakingProtocol = config.liquidStaking[filterOptions.liquidStakingId].stakeProtocolName;
    } catch(error){
        return (invalidStakingProtocolId);
    }

    const apr = await getAPR[`getAPR${liquidStakingProtocol}`](web3, filterOptions);
    return apr;

};

exports.getProtocolAPR = async(web3, options) => {

    const filterOptions = options;
    filterOptions.liquidStakingId = filterOptions.liquidStakingId == null ?
        await common.getliquidStakingProtocolIdFromProtocolName(config.default.liquidStakingProtocol) : filterOptions.liquidStakingId;
    let liquidStakingProtocol = null;

    try {
        liquidStakingProtocol = config.liquidStaking[filterOptions.liquidStakingId].stakeProtocolName;
    } catch(error){
        return (invalidStakingProtocolId);
    }

    const apr = await getAPR[`getProtocolAPR${liquidStakingProtocol}`](web3, filterOptions);
    return apr;

};

exports.stake = async(web3, options) => {

    const filterOptions = options;
    filterOptions.liquidStakingId = filterOptions.liquidStakingId == null ?
        await common.getliquidStakingProtocolIdFromProtocolName(config.default.liquidStakingProtocol) : filterOptions.liquidStakingId;
    let liquidStakingProtocol = null;

    try {
        liquidStakingProtocol = config.liquidStaking[filterOptions.liquidStakingId].stakeProtocolName;
    } catch(error){
        return (invalidStakingProtocolId);
    }

    const apr = await stake[`stake${liquidStakingProtocol}`](web3, filterOptions);
    return apr;

};

exports.approveWithdrawals = async(web3, options) => {

    const filterOptions = options;
    filterOptions.liquidStakingId = filterOptions.liquidStakingId == null ?
        await common.getliquidStakingProtocolIdFromProtocolName(config.default.liquidStakingProtocol) : filterOptions.liquidStakingId;
    let liquidStakingProtocol = null;

    try {
        liquidStakingProtocol = config.liquidStaking[filterOptions.liquidStakingId].stakeProtocolName;
    } catch(error){
        return (invalidStakingProtocolId);
    }

    const apr = await approveWithdrawals[`approveWithdrawals${liquidStakingProtocol}`](web3, filterOptions);
    return apr;

};

exports.withdraw = async(web3, options) => {

    const filterOptions = options;
    filterOptions.liquidStakingId = filterOptions.liquidStakingId == null ?
        await common.getliquidStakingProtocolIdFromProtocolName(config.default.liquidStakingProtocol) : filterOptions.liquidStakingId;
    let liquidStakingProtocol = null;

    try {
        liquidStakingProtocol = config.liquidStaking[filterOptions.liquidStakingId].stakeProtocolName;
    } catch(error){
        return (invalidStakingProtocolId);
    }

    const apr = await withdraw[`reqWithdraw${liquidStakingProtocol}`](web3, filterOptions);
    return apr;

};

exports.wrap = async(web3, options) => {

    const filterOptions = options;
    filterOptions.liquidStakingId = filterOptions.liquidStakingId == null ?
        await common.getliquidStakingProtocolIdFromProtocolName(config.default.liquidStakingProtocol) : filterOptions.liquidStakingId;
    let liquidStakingProtocol = null;

    try {
        liquidStakingProtocol = config.liquidStaking[filterOptions.liquidStakingId].stakeProtocolName;
    } catch(error){
        return (invalidStakingProtocolId);
    }

    const wrapTx = await wrap[`wrap${liquidStakingProtocol}`](web3, filterOptions);
    return wrapTx;

};

exports.unwrap = async(web3, options) => {

    const filterOptions = options;
    filterOptions.liquidStakingId = filterOptions.liquidStakingId == null ?
        await common.getliquidStakingProtocolIdFromProtocolName(config.default.liquidStakingProtocol) : filterOptions.liquidStakingId;
    let liquidStakingProtocol = null;

    try {
        liquidStakingProtocol = config.liquidStaking[filterOptions.liquidStakingId].stakeProtocolName;
    } catch(error){
        return (invalidStakingProtocolId);
    }

    const unwrapTx = await unwrap[`unwrap${liquidStakingProtocol}`](web3, filterOptions);
    return unwrapTx;

};

exports.claim = async(web3, options) => {

    const filterOptions = options;
    filterOptions.liquidStakingId = filterOptions.liquidStakingId == null ?
        await common.getliquidStakingProtocolIdFromProtocolName(config.default.liquidStakingProtocol) : filterOptions.liquidStakingId;
    let liquidStakingProtocol = null;

    try {
        liquidStakingProtocol = config.liquidStaking[filterOptions.liquidStakingId].stakeProtocolName;
    } catch(error){
        return (invalidStakingProtocolId);
    }

    const claimTx = await claim[`claim${liquidStakingProtocol}`](web3, filterOptions);
    return claimTx;

};

exports.getallowance = async(web3, options) => {

    const filterOptions = options;
    filterOptions.liquidStakingId = filterOptions.liquidStakingId == null ?
        await common.getliquidStakingProtocolIdFromProtocolName(config.default.liquidStakingProtocol) : filterOptions.liquidStakingId;
    let liquidStakingProtocol = null;

    try {
        liquidStakingProtocol = config.liquidStaking[filterOptions.liquidStakingId].stakeProtocolName;
    } catch(error){
        return (invalidStakingProtocolId);
    }

    const allowanceData = await allowance[`getAllowance${liquidStakingProtocol}`](web3, filterOptions);
    return allowanceData;

};

exports.decreaseAllowance = async(web3, options) => {

    const filterOptions = options;
    filterOptions.liquidStakingId = filterOptions.liquidStakingId == null ?
        await common.getliquidStakingProtocolIdFromProtocolName(config.default.liquidStakingProtocol) : filterOptions.liquidStakingId;
    let liquidStakingProtocol = null;

    try {
        liquidStakingProtocol = config.liquidStaking[filterOptions.liquidStakingId].stakeProtocolName;
    } catch(error){
        return (invalidStakingProtocolId);
    }

    const decreaseAllowanceTx = await decreaseAllowance[`decreaseAllowance${liquidStakingProtocol}`](web3, filterOptions);
    return decreaseAllowanceTx;

};

exports.increaseAllowance = async(web3, options) => {

    const filterOptions = options;
    filterOptions.liquidStakingId = filterOptions.liquidStakingId == null ?
        await common.getliquidStakingProtocolIdFromProtocolName(config.default.liquidStakingProtocol) : filterOptions.liquidStakingId;
    let liquidStakingProtocol = null;

    try {
        liquidStakingProtocol = config.liquidStaking[filterOptions.liquidStakingId].stakeProtocolName;
    } catch(error){
        return (invalidStakingProtocolId);
    }

    const increaseAllowanceTx = await increaseAllowance[`increaseAllowance${liquidStakingProtocol}`](web3, filterOptions);
    return increaseAllowanceTx;

};

exports.getwithdrwalrequests = async(web3, options) => {

    const filterOptions = options;
    filterOptions.liquidStakingId = filterOptions.liquidStakingId == null ?
        await common.getliquidStakingProtocolIdFromProtocolName(config.default.liquidStakingProtocol) : filterOptions.liquidStakingId;
    let liquidStakingProtocol = null;

    try {
        liquidStakingProtocol = config.liquidStaking[filterOptions.liquidStakingId].stakeProtocolName;
    } catch(error){
        return (invalidStakingProtocolId);
    }

    const withdrawalCalls = await withdrawalcalls[`getWithdrawalRequests${liquidStakingProtocol}`](web3, filterOptions);
    return withdrawalCalls;

};

exports.getwithdrwalstatus = async(web3, options) => {

    const filterOptions = options;
    filterOptions.liquidStakingId = filterOptions.liquidStakingId == null ?
        await common.getliquidStakingProtocolIdFromProtocolName(config.default.liquidStakingProtocol) : filterOptions.liquidStakingId;
    let liquidStakingProtocol = null;

    try {
        liquidStakingProtocol = config.liquidStaking[filterOptions.liquidStakingId].stakeProtocolName;
    } catch(error){
        return (invalidStakingProtocolId);
    }

    const withdrawalCalls = await withdrawalcalls[`getWithdrawalRequestsStatus${liquidStakingProtocol}`](web3, filterOptions);
    return withdrawalCalls;

};

exports.getrewards = async(web3, options) => {
    const filterOptions = options;
    filterOptions.liquidStakingId = filterOptions.liquidStakingId == null ?
        await common.getliquidStakingProtocolIdFromProtocolName(config.default.liquidStakingProtocol) : filterOptions.liquidStakingId;
    let liquidStakingProtocol = null;

    try {
        liquidStakingProtocol = config.liquidStaking[filterOptions.liquidStakingId].stakeProtocolName;
    } catch(error){
        return (invalidStakingProtocolId);
    }

    const apr = await getRewards[`getRewards${liquidStakingProtocol}`](web3, filterOptions);
    return apr;
};

exports.mint = async(web3, options) => {

    const filterOptions = options;
    filterOptions.liquidStakingId = filterOptions.liquidStakingId == null ?
        await common.getliquidStakingProtocolIdFromProtocolName(config.default.liquidStakingProtocol) : filterOptions.liquidStakingId;
    let liquidStakingProtocol = null;

    try {
        liquidStakingProtocol = config.liquidStaking[filterOptions.liquidStakingId].stakeProtocolName;
    } catch(error){
        return (invalidStakingProtocolId);
    }

    const apr = await mint[`mint${liquidStakingProtocol}`](web3, filterOptions);
    return apr;
};

exports.burn = async(web3, options) => {

    const filterOptions = options;
    filterOptions.liquidStakingId = filterOptions.liquidStakingId == null ?
        await common.getliquidStakingProtocolIdFromProtocolName(config.default.liquidStakingProtocol) : filterOptions.liquidStakingId;
    let liquidStakingProtocol = null;

    try {
        liquidStakingProtocol = config.liquidStaking[filterOptions.liquidStakingId].stakeProtocolName;
    } catch(error){
        return (invalidStakingProtocolId);
    }

    const apr = await burn[`burn${liquidStakingProtocol}`](web3, filterOptions);
    return apr;
};
