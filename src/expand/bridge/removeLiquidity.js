const config = require('../../../common/configuration/config.json');
const stargateRouter = require('../../../assets/abis/StargateRouter.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const { getGasPrice } = require('../chain/index');

module.exports = {
    removeLiquidityStargate: async (web3, options) => {
        const filterOptions = options;
        filterOptions.function = "removeLiquidityStargate";
        const validJson = await schemaValidator.validateInput(options);
        if (!validJson.valid) {
            return (validJson);
        }
        const routerAddress = config.bridge[filterOptions.bridgeId].routerAddress[filterOptions.srcChainId];
        const srcChain = config.bridge[filterOptions.bridgeId].chainId[filterOptions.srcChainId];
        if(!srcChain){
            return { 'message': errorMessage.error.message.invalidChain, 'code': errorMessage.error.code.notFound };
        }
        let poolId = config.bridge[filterOptions.bridgeId].pools[filterOptions.srcTokenSymbol];
        poolId = config.bridge[filterOptions.bridgeId].poolId[filterOptions.srcChainId][poolId];

        if(!poolId){
            return { 'message': errorMessage.error.message.poolDoesNotExist, 'code': errorMessage.error.code.notFound };
        }
        const router = new web3.eth.Contract(stargateRouter, routerAddress);
        const data = router.methods.instantRedeemLocal
                     (poolId,filterOptions.amountOut,filterOptions.from)
                     .encodeABI();

        
        const transactionObject = {
            "chainId": filterOptions.srcChainId,
            "from": filterOptions.from,
            "to": routerAddress,
            "value": "0",
            "gas": filterOptions.gas,
            "data": data,
        };

        if (filterOptions.gasPriority !== undefined) {
            transactionObject.gasPrice = await getGasPrice(web3, {
                gasPriority: filterOptions.gasPriority
            }).then(res => res.gasPrice);
        }

        return (transactionObject);
    }


};
