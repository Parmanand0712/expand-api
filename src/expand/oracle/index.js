const GetPrice = require('./getPrice');
const GetPrices = require('./getPrices');
const GetSupportedTokens = require('./getSupportedTokens');
const GetSupportedToken = require('./getSupportedToken');
const { getOracleId } = require('../../../common/common');

const errorMessage = require('../../../common/configuration/errorMessage.json');
const config = require('../../../common/configuration/config.json');

const INVALID_ORACLE_ID = {
    'message': errorMessage.error.message.invalidOracleId,
    'code': errorMessage.error.code.invalidInput
};

exports.getPrice = async (web3, options) => {

    let oracleName;

    const filterOptions = options;
    let price;

    if ((filterOptions.oracleId === undefined && filterOptions.oracleName === undefined) ||
        (filterOptions.oracleId === null && filterOptions.oracleName === null)) {
        price = await GetPrices.getPriceOracle(filterOptions);
        return price;
    }

    try {
        filterOptions.oracleId = await getOracleId({ oracleId: filterOptions.oracleId, oracleName: filterOptions.oracleName });
        oracleName = config.oracle[filterOptions.oracleId].oracleName;
    } catch (error) {
        return (INVALID_ORACLE_ID);
    }

    price = await GetPrice[`getPrice${oracleName}`](web3, filterOptions);
    return (price);

};

exports.getSupportedTokens = async (web3, options) => {

    let oracleName;

    const filterOptions = options;
    let tokens;

    if ((filterOptions.oracleId === undefined && filterOptions.oracleName === undefined) ||
        (filterOptions.oracleId === null && filterOptions.oracleName === null)) {
        tokens = await GetSupportedTokens.getSupportedTokensOracle(filterOptions);
        return tokens;
    }

    try {
        filterOptions.oracleId = await getOracleId({ oracleId: filterOptions.oracleId, oracleName: filterOptions.oracleName });
        oracleName = config.oracle[filterOptions.oracleId].oracleName;
    } catch (error) {
        return (INVALID_ORACLE_ID);
    }

    tokens = await GetSupportedToken[`getSupportedTokens${oracleName}`](web3, filterOptions);
    return (tokens);
    
};