const DepositVault = require('./depositVault');
const GetBalance = require('./getBalance');
const GetVaults = require('./getVaults');
const DepositPool = require('./depositPool');
const WithdrawVault = require('./withdrawVault');
const WithdrawPool = require('./withdrawPool');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const config = require('../../../common/configuration/config.json');

const invalidYieldAggregatorId = {
    'message': errorMessage.error.message.invalidYieldAggregatorId,
    'code': errorMessage.error.code.invalidInput
};

exports.depositVault = async(web3, options) => {

    try {

        const { yieldAggregatorId } = options;
        const transaction = await DepositVault[`depositVault${config.yieldAggregator[yieldAggregatorId].yieldAggregatorName}`]( web3, options );

        return (transaction);

    } catch (error) {
        return (invalidYieldAggregatorId);
    }

};

exports.depositPool = async(web3, options) => {

    try {

        const { yieldAggregatorId } = options;
        const transaction = await DepositPool[`depositPool${config.yieldAggregator[yieldAggregatorId].yieldAggregatorName}`]( web3, options );
        return (transaction);

    } catch (error) {
        return (invalidYieldAggregatorId);
    }

};

exports.getBalance = async(web3, options) => {

    try {

        const { yieldAggregatorId } = options;
        const transaction = await GetBalance[`getBalance${config.yieldAggregator[yieldAggregatorId].yieldAggregatorName}`]( web3, options );

        return (transaction);

    } catch (error) {
        return (invalidYieldAggregatorId);
    }

};

exports.getVaults = async(web3, options) => {

    try {

        const { yieldAggregatorId } = options;
        const transaction = await GetVaults[`getVaults${config.yieldAggregator[yieldAggregatorId].yieldAggregatorName}`]( web3, options );

        return (transaction);

    } catch (error) {
        return (invalidYieldAggregatorId);
    }

};

exports.withdrawPool = async(web3, options) => {

    try {

        const { yieldAggregatorId } = options;
        const transaction = await WithdrawPool[`withdrawPool${config.yieldAggregator[yieldAggregatorId].yieldAggregatorName}`]( web3, options );

        return (transaction);

    } catch (error) {
        return (invalidYieldAggregatorId);
    }

};

exports.withdrawVault = async(web3, options) => {

    try {

        const { yieldAggregatorId } = options;
        const transaction = await WithdrawVault[`withdrawVault${config.yieldAggregator[yieldAggregatorId].yieldAggregatorName}`]( web3, options );

        return (transaction);

    } catch (error) {
        return (invalidYieldAggregatorId);
    }

};
