const axios = require("axios");
const config = require("../../../common/configuration/config.json");
const schemaValidator = require('../../../common/configuration/schemaValidator');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const { isValidContractAddress, isSmartContract } = require('../../../common/contractCommon');
const { getStartAndEndBlocks } = require("../../../common/historicalTxsCommon");
const {getBlockEvm} = require("../chain/getBlock");


const throwErrorMessage = (msg) => ({
  'message': errorMessage.error.message[msg],
  'code': errorMessage.error.code.invalidInput
});

module.exports = {

  getRewardsLido: async (web3, options) => {
    /*
    * Function will fetch rewards for an user on Lido
    */

    const filterOptions = options;
    filterOptions.function = "getRewardsLido()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
      return (validJson);
    }

    const { liquidStakingId, address, page } = options;
   
    if (!await isValidContractAddress(web3, address))
      return throwErrorMessage("invalidAddress");
    
    if (await isSmartContract(web3, address))
      return throwErrorMessage("invalidEOAAddress");

    if (!config.liquidStaking[liquidStakingId].aprData)
      return throwErrorMessage("rewardDataNotSupported");
    const { rewardsURL } = config.liquidStaking[liquidStakingId];

    // Create the request
    const reqUrl = `${rewardsURL}address=${address}&skip=${ (page-1)*100 || 0}&limit=100&onlyRewards=true`;

    const aprConfig = {
      method: 'get',
      maxBodyLength: Infinity,
      url: reqUrl,
      headers: {
        'accept': 'application/json'
      }
    };


    try {
      // Rewards for an address
      const aprData = await axios.request(aprConfig);
      return aprData.data;
    } catch(error) {
      return error.response.data;
    }

  },

  getRewardsChorusOne: async (web3, options) => {
    /*
    * Function will get the daily rewards in Chorus One
    */

    const filterOptions = options;
    filterOptions.function = "getRewardsChorusOne()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
      return (validJson);
    }

    const { liquidStakingId, address, startBlock, endBlock } = filterOptions;
    const { defaultBlockRange, rewardsDataSource, opusPool } = config.liquidStaking[liquidStakingId];
    
    if (!await isValidContractAddress(web3, address)) return throwErrorMessage("invalidAddress");

    const currentBlock = await web3.eth.getBlockNumber();

    if (startBlock > (endBlock - 1)) return throwErrorMessage("invalidStartEndBlock");
    if (startBlock > currentBlock || (endBlock - 1) > currentBlock) return throwErrorMessage('invalidStartOrEndBlock');
    if ((endBlock - startBlock) > Number(defaultBlockRange)) return throwErrorMessage('invalidBlockRange');

    const { fromBlock, toBlock } = getStartAndEndBlocks(startBlock, endBlock, currentBlock, defaultBlockRange);

    const [fromBlockDetails, toBlockDetails] = await Promise.all(
      [getBlockEvm(web3, {blockNumber: fromBlock}), getBlockEvm(web3, {blockNumber: toBlock})]
      );
    const startDate = fromBlockDetails.timestamp;
    const endDate = toBlockDetails.timestamp;

    const apiConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: rewardsDataSource,
      headers: { 
        'Content-Type': 'application/json'
      },
      data :  {
        query: `{
          userRewards(
            dateFrom: "${startDate}"
            user: "${address}"
            vaultAddress: "${opusPool}"
            dateTo: "${endDate}"
          ) {
            sumRewards
            dailyRewards
            dateStr
            dailyRewardsUsd
          }
        }`,
        variables: {}
      }};
    
    const response = await axios.request(apiConfig).then(res => res.data);
    if (response.errors) return throwErrorMessage("invalidInput");
    
    const rewards = response.data?.userRewards.map(({dateStr, dailyRewardsUsd, dailyRewards, sumRewards}) => ({
      date: dateStr,
      dailyRewards,
      dailyRewardsUsd,
      totalRewards: sumRewards
    }));

    return { rewards };
  },
};