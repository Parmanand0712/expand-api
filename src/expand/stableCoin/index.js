const GetPrice = require('./getPrice');

const config = require('../../../common/configuration/config.json');
const common = require('../../../common/common');
const errorMessage = require('../../../common/configuration/errorMessage.json');

const invalidChainId = {
    'message': errorMessage.error.message.invalidChainId,
    'code': errorMessage.error.code.invalidInput
};

exports.getPrice = async( web3, options ) => {

    const filterOptions = options;

    let {chainId} = filterOptions;
    const {chainSymbol } = filterOptions;

    chainId = await common.getChainId( { chainId, chainSymbol } );
    let chainName; 

    try {
        chainName = config.chains[chainId].chainName;
    } catch (error) {
        return (invalidChainId);
    }

    const price = await GetPrice[`getPrice${chainName}`]( web3, filterOptions );
    return (price);

};

