const SendUserOps = require('./sendUserOps');
const GetUserOps = require('./getUserOps');
const GetSignatureMessage = require('./getSignatureMessage');
const GetPaymasterData = require('./getPaymasterData');

const errorMessage = require('../../../common/configuration/errorMessage.json');
const config = require('../../../common/configuration/config.json');
const common = require('../../../common/common');
const schemaValidator = require('../../../common/configuration/schemaValidator');

const INVALID_CHAIN_ID = {
    'message': errorMessage.error.message.invalidChainId,
    'code': errorMessage.error.code.invalidInput
};

exports.getUserOps = async( web3, options ) => {

    const filterOptions = options;
    filterOptions.function = "getUserOps()";
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
        return (INVALID_CHAIN_ID);
    }

    const transaction = await GetUserOps[`getUserOps${chainName}`]( web3, filterOptions );
    return (transaction);

};

exports.sendUserOps = async( web3, options ) => {

    const filterOptions = options;
    filterOptions.function = "sendUserOps()";
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
        return (INVALID_CHAIN_ID);
    }

    const transaction = await SendUserOps[`sendUserOps${chainName}`]( web3, options );
    return (transaction);

};

exports.getSignatureMessage = async( web3, options ) => {

    const filterOptions = options;
    filterOptions.function = "getSignatureMessage()";
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
        return (INVALID_CHAIN_ID);
    }

    const transaction = await GetSignatureMessage[`getSignatureMessage${chainName}`]( web3, options );
    return (transaction);

};

exports.getPaymasterData = async( web3, options ) => {

    const filterOptions = options;
    filterOptions.function = "getPaymasterData()";
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
        return (INVALID_CHAIN_ID);
    }

    const transaction = await GetPaymasterData[`getPaymasterData${chainName}`]( web3, options );
    return (transaction);

};