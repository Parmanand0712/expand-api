const async = require("async");
const { latestData } = require('../../../constants');
const {
  formatInsertTransactionsEthereum,
} = require("../../expand-api/models/streamTransaction");

module.exports = {
  saveTransactionsEthereum: async (options) => {
    try {
      // fetching client info
      const Web3 = require("web3");
      const web3 = new Web3(new Web3.providers.HttpProvider(options.publicRpc));
      const web3Socket = new Web3(
        new Web3.providers.WebsocketProvider(options.socketRpc)
      );
      const subscription = web3Socket.eth.subscribe("newBlockHeaders");

      // dumping transactions
      subscription.on("data", async (blockHeader) => {
        const latestBlockData = await web3.eth.getBlock(blockHeader.number);
        if (!latestBlockData) {
          return;
        }
        const tmpLatestData = {};
        if (
          latestBlockData &&
          latestBlockData.transactions &&
          latestBlockData.transactions.length > 0
        ) {
          await async.eachLimit(
            latestBlockData.transactions,
            100,
            async (transactionAddress) => {
              try {
                const transactionDetails = await web3.eth.getTransaction(
                  transactionAddress
                );
                const transactionDataToBeInserted =
                  formatInsertTransactionsEthereum(transactionDetails);
                tmpLatestData[transactionDataToBeInserted[6]] = transactionDataToBeInserted;
              } catch (error) {
                return error;
              }

              return null;
            }
          );
          if (Object.keys(latestData).length > 3) {
            delete latestData[Object.keys(latestData)[0]];
          }
          latestData[blockHeader.number] = tmpLatestData;
        }
      });
    } catch (error) {
      return error;
    }

    return null;
  },
};
