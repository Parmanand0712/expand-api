const axios = require("axios");
const config = require("../../../common/configuration/config.json");
const schemaValidator = require('../../../common/configuration/schemaValidator');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const { getBlockForTimestamp } = require("./getBlockNumber");
const { getBlockEvm } = require("../chain/getBlock");

module.exports = {

  getAPRLido: async (web3, options) => {
    /*
    * Function will get the APR of Lido
    */

    const filterOptions = options;
    filterOptions.function = "getAPR()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
      return (validJson);
    }

    const { liquidStakingId } = filterOptions;
    if (!config.liquidStaking[liquidStakingId].aprData) {
      return {
        'message': errorMessage.error.message.aprDataNotSupported,
        'code': errorMessage.error.code.notFound
      };
    }
    const { aprURL } = config.liquidStaking[liquidStakingId];
    const aprConfig = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${aprURL}last`,
      headers: {
        'accept': 'application/json'
      }
    };


    // getting current APR
    const aprData = await axios.request(aprConfig).then(res => res.data.data);

    aprData.blockNumber = await getBlockForTimestamp(aprData.timeUnix, config.liquidStaking[liquidStakingId].chainId);

    return {
      timeUnix: aprData.timeUnix.toString(),
      apr: aprData.apr.toString(),
      blockNumber: aprData.blockNumber.toString()
    };
  },

  getProtocolAPRLido: async (web3, options) => {
    /*
    * Function will get the Protocol APR of Lido
    */

    const filterOptions = options;
    filterOptions.function = "getAPR()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
      return (validJson);
    }

    const { liquidStakingId } = filterOptions;
    if (!config.liquidStaking[liquidStakingId].aprData) {
      return {
        'message': errorMessage.error.message.aprDataNotSupported,
        'code': errorMessage.error.code.notFound
      };
    }
    const { aprURL } = config.liquidStaking[liquidStakingId];
    const aprConfig = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${aprURL}sma`,
      headers: {
        'accept': 'application/json'
      }
    };

    // getting Protocol APR
    const aprData = await axios.request(aprConfig).then(res => res.data.data);
    let { aprs } = aprData;

    async function processAprs() {
      aprs = await Promise.all(aprs.map(async (element) => {
        const ele = {};
        ele.timeUnix = element.timeUnix.toString();
        ele.apr = element.apr.toString();
        ele.blockNumber = (await getBlockForTimestamp(element.timeUnix, config.liquidStaking[liquidStakingId].chainId)).toString();
        return ele;
      }));
    }

    // Call the async function
    await processAprs(aprs, liquidStakingId, config)
      .then(() => {
        console.log("Processing complete");
      })
      .catch((error) => {
        console.error("Error occurred during processing:", error);
      });

    aprData.aprs = aprs;
    aprData.smaApr = aprData.smaApr.toString();
    return aprData;
  },

  getAPRChorusOne: async (web3, options) => {
    /*
    * Function will get the APR of Lido
    */

    const filterOptions = options;
    filterOptions.function = "getAPR()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
      return (validJson);
    }

    const { chainId, liquidStakingId } = filterOptions;
    const { APRDataSource, opusPool } = config.liquidStaking[liquidStakingId];
    
    const apiConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: APRDataSource,
      headers: { 
        'Content-Type': 'application/json'
      },
      data :  {
        query: `{
        vaults(where: {id: "${opusPool.toLowerCase()}"}) {
          apy
          id
          createdAt
        }
      }`,
        variables: {}
      }};
    
    const aprData = await axios.request(apiConfig).then(res => res.data.data);
    const {apy} = aprData.vaults[0];
    const blockNumber = await web3.eth.getBlockNumber();
    const blockDetail = await getBlockEvm(web3, {chainId, blockNumber: blockNumber.toString() });

    return {
      timeUnix: blockDetail.timestamp.toString(),
      apr: Number(apy).toFixed(2),
      blockNumber: blockNumber.toString()
    };

  },
};