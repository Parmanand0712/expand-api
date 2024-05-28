const { default: axios } = require('axios');
const config = require('../../../common/configuration/config.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const { getBlockStellar } = require('./getBlock');

module.exports = {
  getLatestLedgerStellar: async (stllrWeb3, options) => {
    /*
     * Function will get the details of latest block
     */

    const filterOptions = options;
    filterOptions.function = "getLatestLedgerStellar()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
      return (validJson);
    }

    const { chainId } = filterOptions;
    const apiConfig = {
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
    };

    const ledger = await axios.request(apiConfig);
    const ledgerDetail = await getBlockStellar(stllrWeb3, { blockNumber: (ledger.data.result.sequence - 2)?.toString(), chainId });
    return ledgerDetail;
  },
};
