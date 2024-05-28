const GetPrice = require('./getPrice');
const ConvertBaseToPeggedToken = require('./convertBaseToPeggedToken');
const ConvertBaseToProtocolToken = require('./convertBaseToProtocolToken');
const ConvertPeggedToProtocolToken = require('./convertPeggedToProtocolToken');
const ConvertProtocolToBaseToken = require('./convertProtocolToBaseToken');
const ConvertProtocolToPeggedToken = require('./convertProtocolToPeggedToken');
const Liquidate = require('./liquidate');
const DepositPeggedToken = require('./depositPeggedToken');
const WithdrawPeggedToken = require('./withdrawPeggedToken');

const errorMessage = require('../../../common/configuration/errorMessage.json');
const config = require('../../../common/configuration/config.json');
const common = require('../../../common/common');

const INVALID_SYNTHETIC_ID = {
    'message': errorMessage.error.message.invalidSyntheticId,
    'code': errorMessage.error.code.invalidInput
};

const getSyntheticName = async(options) => {
    const filterOptions = options;
    let syntheticName = null;

    filterOptions.syntheticId = filterOptions.syntheticId == null ? await common.getsyntheticIdFromSyntheticName(
        config.default.synthetic
    ): filterOptions.syntheticId;

    try {
        syntheticName = config.synthetic[filterOptions.syntheticId].syntheticName;
        return syntheticName;
    } catch (error) {
        return INVALID_SYNTHETIC_ID;
    }
};

exports.getPrice = async( web3, options ) => {
    const syntheticName = await getSyntheticName(options);
    if (syntheticName.message) {
        return syntheticName; 
    }
    try {
        const price = await GetPrice[`getPrice${syntheticName}`]( web3, options );
        return price;
    } catch (error) {
        return error;
    }
};

exports.convertBaseToPeggedToken = async( web3, options ) => {
    const syntheticName = await getSyntheticName(options);
    if (syntheticName.message) {
        return syntheticName; 
    }
    try {
        const transaction = await ConvertBaseToPeggedToken[`convertBaseToPeggedToken${syntheticName}`]( web3, options );
        return transaction;
    } catch (error) {
        return error;
    }
};

exports.convertBaseToProtocolToken = async( web3, options ) => {
    const syntheticName = await getSyntheticName(options);
    if (syntheticName.message) {
        return syntheticName; 
    }
    try {
        const transaction = await ConvertBaseToProtocolToken[`convertBaseToProtocolToken${syntheticName}`]( web3, options );
        return transaction;
    } catch (error) {
        return error;
    }
};

exports.convertPeggedToProtocolToken = async( web3, options ) => {
    const syntheticName = await getSyntheticName(options);
    if (syntheticName.message) {
        return syntheticName; 
    }
    try {
        const transaction = await ConvertPeggedToProtocolToken[`convertPeggedToProtocolToken${syntheticName}`]( web3, options );
        return transaction;
    } catch (error) {
        return error;
    }
};

exports.convertProtocolToBaseToken = async( web3, options ) => {
    const syntheticName = await getSyntheticName(options);
    if (syntheticName.message) {
        return syntheticName; 
    }
    try {
        const transaction = await ConvertProtocolToBaseToken[`convertProtocolToBaseToken${syntheticName}`]( web3, options );
        return transaction;
    } catch (error) {
        return error;
    }
};

exports.convertProtocolToPeggedToken = async( web3, options ) => {
    const syntheticName = await getSyntheticName(options);
    if (syntheticName.message) {
        return syntheticName; 
    }
    try{
        const transaction = await ConvertProtocolToPeggedToken[`convertProtocolToPeggedToken${syntheticName}`]( web3, options );
        return transaction;
    } catch (error) {
        return error;
    }
};

exports.liquidate = async( web3, options ) => {
    const syntheticName = await getSyntheticName(options);
    if (syntheticName.message) {
        return syntheticName; 
    }
    try {
        const transaction = await Liquidate[`liquidate${syntheticName}`]( web3, options );
        return transaction;
    } catch (error) {
        return error;
    }
};

exports.depositPeggedToken = async( web3, options ) => {
    const syntheticName = await getSyntheticName(options);
    if (syntheticName.message) {
        return syntheticName; 
    }
    try {
        const transaction = await DepositPeggedToken[`depositPeggedToken${syntheticName}`]( web3, options );
        return transaction;
    } catch (error) {
        return error;
    }
};

exports.withdrawPeggedToken = async( web3, options ) => {
    const syntheticName = await getSyntheticName(options);
    if (syntheticName.message) {
        return syntheticName; 
    }
    try {
        const transaction = await WithdrawPeggedToken[`withdrawPeggedToken${syntheticName}`]( web3, options );
        return transaction;
    } catch (error) {
        return error;
    }
};