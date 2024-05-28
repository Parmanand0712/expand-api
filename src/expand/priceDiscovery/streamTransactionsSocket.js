/* eslint-disable no-await-in-loop */
const Web3 = require("web3");
const { latestData } = require('../../../constants');
const {
  getClientInfoByClientId,
  // formatStreamTransactionsEthereum, 
} = require("../../expand-api/models/streamTransaction");

module.exports = {
  streamTransactionsSocketEthereum: (socket, options) => {
    try {
      const web3Socket = new Web3(
        new Web3.providers.WebsocketProvider(options.socketRpc)
      );
      const web3Subscription = web3Socket.eth.subscribe("newBlockHeaders");
      web3Subscription.on("data", async (data) => {
        while(!(data.number in latestData)) {
          await new Promise(resolve => 
            // eslint-disable-next-line no-promise-executor-return
            setTimeout(resolve, 500));
        }
        // query db for client addresses
        const [ subscribedAddress ] = await getClientInfoByClientId([
          socket.handshake.query.clientId,
        ]);
        const transactions = latestData[data.number];
        delete latestData[data.number];

        // query db for transactions of client addresses
        if (subscribedAddress.addresses) {
          const retVal = [];
          const addresses = {};
          for (const address of subscribedAddress.addresses) {
            addresses[address] = '';
          }
          for (const txn of Object.keys(transactions)) {
            if (transactions[txn][3] in addresses || transactions[txn][11] in addresses) {
              retVal.push(transactions[txn]);
            }
          }
          socket.emit("getTransactions", retVal);
        }
      });
    } catch (error) {
      return error;
    }

    return null;
  },
};
