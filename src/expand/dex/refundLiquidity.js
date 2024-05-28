/* eslint-disable no-void */
/* 
 * All the function in this file
 * should be returning the following schema
 * 
 * 
    {
        "transactionHash": "0x61f77b95990e4facfaee10b993e9c68cc5d8a8c74ebbcbc122011c5e79afa9cc"
    }  
 */


// const SendTransaction = require("../chain/sendTransaction");
const { Router, ROUTER_REVISION, ROUTER_REVISION_ADDRESS } = require('@ston-fi/sdk');
const TonWeb = require('tonweb');
const {getHttpEndpoint} = require('@orbs-network/ton-access');
const {payloadModifier} = require('../../../common/tonHelper');
// const uniswapV3Common = require("../../../common/uniswapV3Common");
const config = require('../../../common/configuration/config.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const errorMessage = require('../../../common/configuration/errorMessage.json');

const poolDoesNotExist = {
    'message': errorMessage.error.message.poolDoesNotExist,
    'code': errorMessage.error.code.invalidInput
};

module.exports = {

    refundLiquidityStonFi: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "refundLiquidityStonFi()";
        const validJson = await schemaValidator.validateInput(options);
    
        if (!validJson.valid) {
          return validJson;
        }

        try{

          const {chainId , tokenA , tokenB , from , queryId} = filterOptions;
          const {stonFiExtraGas} = config.chains[chainId];
          const tonweb = new TonWeb.HttpProvider();
          tonweb.host = await getHttpEndpoint({ network: config.chains[chainId].network });

          const router = new Router(tonweb, {
            revision: ROUTER_REVISION.V1,
            address: ROUTER_REVISION_ADDRESS.V1,
          });

          const pool = await router.getPool({
            jettonAddresses: [tokenA, tokenB],
          });

          if (!pool) {
            return poolDoesNotExist;
          }

          const lpAccount = await pool.getLpAccount({ ownerAddress: from });

          if (!lpAccount) {
            throw Error(
              `LpAccount for ${from} at ${tokenA}/${tokenB} pool not found`,
            );
          }

          const refundTxParams = await lpAccount.buildRefundTxParams({
            queryId: (queryId === undefined || queryId === null) ? 0 : queryId,
          });

          return ({
            chainId,
            to: refundTxParams.to.toString(),
            value: (refundTxParams.gasAmount.add(TonWeb.utils.toNano(stonFiExtraGas))).toString(),
            message: await payloadModifier(refundTxParams.payload),
          });

        }
        catch(err){
            return(poolDoesNotExist);
        }

      }

};