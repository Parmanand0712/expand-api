const { gql, GraphQLClient } = require('graphql-request');
const config = require("../../../common/configuration/config.json");

const endpoint = `${config.shyft.endpoint}?api_key=${config.shyft.apiKey}`; // Shyft's gQl endpoint

const graphQLClient = new GraphQLClient(endpoint, {
  method: `POST`,
  jsonSerializer: {
    parse: JSON.parse,
    stringify: JSON.stringify,
  },
});  // Initialize gQL Client

async function getWhirlpoolsforToken(tokenA, tokenB) {
    const query = gql`
    query MyQuery {
      ORCA_WHIRLPOOLS_whirlpool(
        where: {tokenMintA: {_eq: ${JSON.stringify(tokenA)}}, tokenMintB: {_eq: ${JSON.stringify(tokenB)}}}
        order_by: {liquidity: desc}
      ) {
        tokenMintA
        tokenMintB
        liquidity
        whirlpoolsConfig
        tickSpacing
        pubkey
      }
    }
    `;

  const response = await graphQLClient.request(query);
  // console.log(response);
  return response.ORCA_WHIRLPOOLS_whirlpool;
};

async function getWhirpool(tokenA, tokenB) {
  try {  
    let response = await getWhirlpoolsforToken(tokenA, tokenB);
      if(response.length === 0) {
          response = await getWhirlpoolsforToken(tokenB, tokenA);
      }
      return response;
  } catch(error){
    return {
      status: 409
    };
  }
}

// getWhirlpoolsforToken('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB');
module.exports = { getWhirpool };
//  ORCA_SUPPORTED_TICK_SPACINGS = [1, 2, 4, 8, 16, 64, 128, 256];