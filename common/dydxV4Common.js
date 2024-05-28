const { IndexerClient, Network } = require("@dydxprotocol/v4-client-js");

module.exports = {
    indexerClientGoerli: new IndexerClient(Network.testnet().indexerConfig)
};