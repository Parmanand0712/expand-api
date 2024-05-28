const { default: axios } = require('axios');
const config = require('../../../common/configuration/config.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const errorMessage = require('../../../common/configuration/errorMessage.json');

const throwErrorMessage = (msg) => ({
  'message': errorMessage.error.message[msg],
  'code': errorMessage.error.code.invalidInput
});

module.exports = {
  getEventsStellar: async (_, options) => {
    /*
     * Function gets a filtered list of events from a maximum of 10 hours of recent ledgers using soroban RPC
     */

    const filterOptions = options;
    filterOptions.function = "getEventsSoroban()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
      return (validJson);
    }

    const { chainId, type, startBlock, contracts, topics1, topics2, topics3, topics4, topics5, pageToken } = filterOptions;

    // Getting latest ledger
    const ledger = await axios.request({
      method: 'post',
      maxBodyLength: Infinity,
      url: config.chains[chainId].sorobanRpc,
      headers: { 
        'Content-Type': 'application/json'
      },
      data: {
        "jsonrpc": "2.0",
        "id": 8675309,
        "method": "getLatestLedger"
      }
    });

    const currentBlock = ledger.data.result.sequence - 2;

    // Throw error if given block number is greater than current block
    if (startBlock && (currentBlock < Number(startBlock))) return throwErrorMessage("startBlockGTCurrent");

    const updateArray = (topics) => {
      if (!topics) return null;
      return topics.split(",").slice(0, 4);
     };
     
     // Converting the topics array into array of array
     const topicsArray = [topics1, topics2, topics3, topics4, topics5]
      .map(updateArray)
      .filter(Boolean);

    try {
        const data = JSON.stringify({
          "jsonrpc": "2.0",
          "id": 8675309,
          "method": "getEvents",
          "params": {
            ...(!pageToken && {"startLedger": startBlock ? Number(startBlock) : currentBlock}),
            "filters": [
              {
                ...(type !== 'all' && {type}),
                ...(contracts && {"contractIds": contracts?.split(",").slice(0,5)}),
                ...(topicsArray.length && {"topics": topicsArray})
              }
            ],
            "pagination": {
              "limit": 10000,
              ...(pageToken && {"cursor": pageToken})
            }
          }
        });
        const apiConfig = {
          method: 'post',
          maxBodyLength: Infinity,
          url: config.chains[chainId].sorobanRpc,
          headers: { 
            'Content-Type': 'application/json'
          },
          data
        };
        
        const response = await axios.request(apiConfig);
        if (response.data?.error?.message === "start is before oldest ledger") return throwErrorMessage("startBlockLT10Hr");
        if (response.data?.error) return {
          'message': response.data.error.message,
          'code': errorMessage.error.code.invalidInput
        };
        let {events} = response.data.result;
        
        // Getting the page cursor from thr response
        const nextPageToken = events.length && events.length === 10000 ? events[events.length -1].pagingToken : null;

        // Mapping the fields
        events = events.map((event) => {
          const res = {
            ...event, contract: event.contractId, transactionHash: event.txHash
          };
          delete res.txHash;
          delete res.contractId;
          delete res.pagingToken;
          return res;
        });
        return { events, ...(nextPageToken && {nextPageToken}) };
      } catch (err) {
        return throwErrorMessage("invalidInput");
      }
  },
};
