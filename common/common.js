const config = require('./configuration/config.json');
const errorMessage = require('./configuration/errorMessage.json');


const getChainIdFromChainSymbol = async(chainSymbol) => {
    /*
     * This functions returns the appropriate chainId 
     * for the given chainSymbol
     *    
     */
    const upperCaseChainSymbol = chainSymbol.toUpperCase();

    for(const chain in config.chains){
        if ( config.chains[chain].chainSymbol.toUpperCase() === upperCaseChainSymbol ) {
            return (chain);
        }
    }

    // Always returning null by default
    return (null);

};

exports.getChainId = async(options) => {
    /*
     * This functions returns the appropriate chainId 
     * for the given combination of chainId and chainSymbol
     *    
     */

    let chainId = options.chainId ? options.chainId : null;
    const chainSymbol = options.chainSymbol ? options.chainSymbol.toUpperCase() : null;

    if ( chainId === null && chainSymbol === null ) {
        // By default setting it to EVM based chains
        chainId = "1"; 
    } else if ( chainId === null && chainSymbol != null ) {
        // Fetch the equivalent chain ID from the configuration File
        chainId = getChainIdFromChainSymbol(chainSymbol);
    } else {
        // By default priority will be given to chainId 
        chainId = chainId.toString();
    }

    return (chainId);
};


exports.encodeFunctionData = async(web3, options) => {
    /*
     * This functions execute a transaction for the given options, 
     * Mainly to be used to interact with a smart contract
     *    
     */
    const params = web3.eth.abi.encodeParameters(
        options.parametersType,
        options.parameters
    );

    const data = options.functionHash + params.slice(2);

    return (data);

};

exports.getDexIdFromDexName = async(dexName) => {
    /*
     * This functions returns the appropriate dexId 
     * for the given dexName
     *    
     */

    for(const dex in config.dex){
        if ( config.dex[dex].dexName === dexName ) {
            return (dex);
        }
    }

    // Always returning null by default
    return (null);

};

exports.getBridgeIdFromBridgeName = async(bridgeName) => {
    /*
     * This functions returns the appropriate dexId 
     * for the given dexName
     *    
     */

    for(const bridge in config.bridge){
        if ( config.bridge[bridge].bridgeName === bridgeName ) {
            return (bridge);
        }
    }

    // Always returning null by default
    return (null);

};


exports.getLendborrowIdFromLendborrowName = async(lendBorrowName) => {
    /*
     * This functions returns the appropriate getLendborrowId 
     * for the given lendBorrowName
     *    
     */

    for(const lendborrow in config.lendborrow){
        if ( config.lendborrow[lendborrow].lendborrowName === lendBorrowName ) {
            return (lendborrow);
        }
    }

    // Always returning null by default
    return (null);

};

exports.getOracleIdFromOracleName = async(oracleName) => {
 
    /*
     * This functions returns the appropriate oracleID 
     * for the given oracleName
     *    
     */

    for(const oracle in config.oracle){
        if ( config.oracle[oracle].oracleName === oracleName ) {
            return (oracle);
        }
    }

    // Always returning null by default
    return (null);

};

exports.getOracleId = async(options) => {
    /*
     * This functions returns the appropriate chainId 
     * for the given combination of chainId and chainSymbol
     *    
     */

    let oracleId = options.oracleId ? options.oracleId : null;
    const oracleName = options.oracleName ? options.oracleName : null;

    if ( oracleId === null && oracleName === null ) {
        // By default setting it to EVM based chains
        oracleId = "1000"; 
    } else if ( oracleId === null && oracleName != null ) {
        // Fetch the equivalent oracle ID from the configuration File
        oracleId = this.getOracleIdFromOracleName(oracleName);
    } else {
        // By default priority will be given to oracleId 
        oracleId = oracleId.toString();
    }

    return (oracleId);
};

exports.getsyntheticIdFromSyntheticName = async(syntheticName) => {
    /*
        * This functions returns the appropriate dexId 
        * for the given dexName
        *    
        */

    for(const synthetic in config.synthetic){
        if ( config.synthetic[synthetic].syntheticNAme === syntheticName ) {
            return (synthetic);
        }
    }

    // Always returning null by default
    return (null);

};

exports.getNftProtocolByChainName = async(chainName) => {
    /*
     * This functions returns the appropriate nftProtocol 
     * for the given chainName
     *    
     */
    const protocolId = `${chainName.toLowerCase()}NftProtocolId`;
    if (protocolId in config.default){
        return config.default[protocolId].toString();
    }

    // Always returning null by default
    return (null);

};

exports.getDerivativeIdFromDerivativeName = async(derivativeName) => {
    /*
     * This functions returns the appropriate derivativeId 
     * for the given derivativeName
     */

    for(const derivative in config.derivative){
        if ( config.derivative[derivative].derivativeName === derivativeName ) {
            return (derivative);
        }
    }

    // Always returning null by default
    return (null);

};

exports.checkAmountsForProperFormat = async(data) => {
    /*
     * This functions returns the appropriate response 
     * for the given data for validation check of input for amounts
     */

    if (!(/^\+?\d+$/.test(data))) return {
        'message': `Error: invalid BigNumber string (argument="${"value"}",value="${data}",code=INVALID_ARGUMENT, version=bignumber/5.7.0)`,
        'code': errorMessage.error.code.invalidInput
    };

    return false;
    

};

exports.getliquidStakingProtocolIdFromProtocolName = async(stakeProtocolName) => {
    /*
     * This functions returns the appropriate dexId 
     * for the given dexName
     *    
     */

    for(const protocol in config.liquidStaking){
        if ( config.liquidStaking[protocol].stakeProtocolName === stakeProtocolName ) {
            return (protocol);
        }
    }

    // Always returning null by default
    return (null);

};
