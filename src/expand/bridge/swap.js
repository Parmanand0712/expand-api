const { default: axios } = require('axios');
const config = require('../../../common/configuration/config.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const stargateRouterABI = require('../../../assets/abis/StargateRouter.json');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const squidRouterCommon = require('../../../common/squidRouterCommon');
const { getGasPrice } = require('../chain/index');

module.exports = {

  swapStargate: async(evmWeb3, options) => {
        const filterOptions = options;
        filterOptions.function = "swapStargate()";
        const validJson = await schemaValidator.validateInput(options);
    
        if (!validJson.valid) {
          return (validJson);
        }
    
        const routerAddress = config.bridge[filterOptions.bridgeId].routerAddress[filterOptions.srcChainId];
        const srcChain = config.bridge[filterOptions.bridgeId].chainId[filterOptions.srcChainId];
        const dstChain = config.bridge[filterOptions.bridgeId].chainId[filterOptions.dstChainId];
        
        if(!dstChain || !srcChain ){
          return { 'message': errorMessage.error.message.invalidChain, 'code': errorMessage.error.code.notFound };
        }
        const poolId = config.bridge[filterOptions.bridgeId].pools[filterOptions.srcTokenSymbol];
        if(!poolId){
          return { 'message': errorMessage.error.message.poolDoesNotExist, 'code': errorMessage.error.code.notFound };
        }
        const srcPool = config.bridge[filterOptions.bridgeId].poolId[filterOptions.srcChainId][poolId];
        let dstPool = config.bridge[filterOptions.bridgeId].poolId[filterOptions.dstChainId][poolId];
        
        if(filterOptions.dstTokenSymbol!==undefined && filterOptions.dstTokenSymbol !== filterOptions.srcTokenSymbol){
             if(config.bridge[filterOptions.bridgeId].swaps[(filterOptions.srcTokenSymbol)+(filterOptions.dstTokenSymbol)]){
               const dstPoolId = config.bridge[filterOptions.bridgeId].pools[filterOptions.dstTokenSymbol];
               dstPool = config.bridge[filterOptions.bridgeId].poolId[filterOptions.dstChainId][dstPoolId];
             }
             else
             return { 'message': errorMessage.error.message.poolDoesNotExist, 'code': errorMessage.error.code.notFound }; 
          }
                
        if(!srcPool || !dstPool ){
          return { 'message': errorMessage.error.message.poolDoesNotExist, 'code': errorMessage.error.code.notFound };
        }
    
        const router = new evmWeb3.eth.Contract(stargateRouterABI, routerAddress);
        const quoteData = await router.methods.quoteLayerZeroFee(
            dstChain,           
            1,                              
            filterOptions.from,        
            '0x',                           
            ({
                dstGasForCall: 0,
                dstNativeAmount: 0,       
                dstNativeAddr: "0x"
            })
            ).call();

            const data = router.methods.swap(
            dstChain,
            srcPool,      // src pool id
            dstPool,      // dst pool id
            filterOptions.from,
            filterOptions.amountIn.toString(),
            (filterOptions.slippage === undefined) ? filterOptions.amountOutMin.toString() 
            : BigInt(Math.round(filterOptions.amountOutMin - ( (filterOptions.slippage / 100) * filterOptions.amountOutMin ))).toString() ,
            { dstGasForCall: 0, dstNativeAmount: 0, dstNativeAddr: "0x" },
            filterOptions.from,
            "0x",
        ).encodeABI();


        const transactionObject = {
            "chainId": filterOptions.srcChainId,
            "from": filterOptions.from,
            "to": routerAddress,
            "value": quoteData['0'],
            "gas": filterOptions.gas,
            "data": data,
        };

        if (filterOptions.gasPriority !== undefined) {
          transactionObject.gasPrice = await getGasPrice(evmWeb3, {
              gasPriority: filterOptions.gasPriority
          }).then(res => res.gasPrice);
      }
    
        return (transactionObject);
    
      },

  swapSquidRouter: async (web3, options) => {
    /*
     * Function will provide the swap payload from squid router
     */

    let filterOptions = options;
    filterOptions.function = "swapSquidRouter()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
      return (validJson);
    }

    const apiConfig = await squidRouterCommon.getSwapRoute(filterOptions);
    if (apiConfig.code === 400) return apiConfig;

    try {
      const res = await axios.request(apiConfig);
      const { data, targetAddress, value } = res.data.route.transactionRequest;
      filterOptions = { ...filterOptions, data, targetAddress, value };
    } catch (err) {
      if (err.response.data) return { 'message': err.response.data.errors, 'code': errorMessage.error.code.notFound };
      return (err);
    }

    const { from, targetAddress, gasPriority, value, data, gas } = filterOptions;


    const transactionObject = {
      from,
      to: targetAddress,
      value,
      gas,
      data,
    };

    if (gasPriority !== undefined) {
      transactionObject.gasPrice = await getGasPrice(web3, {
          gasPriority: filterOptions.gasPriority
      }).then(res => res.gasPrice);
  }

    return (transactionObject);
  }
};
