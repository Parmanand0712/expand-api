const Web3 = require("web3");
const async = require("async");

const priceDiscoveryConfig = require("../../expand-api/utils/config");
const config = require("../../../common/configuration/config.json");
const {
  getTransactionsToEthereum,
} = require("../../expand-api/models/streamTransaction");

module.exports = {
  streamTradesSocketEthereum: (socket, options) => {
    try {
      const web3Socket = new Web3(
        new Web3.providers.WebsocketProvider(options.socketRpc)
      );
      const web3 = new Web3(new Web3.providers.HttpProvider(options.publicRpc));
      const web3Subscription = web3Socket.eth.subscribe("newBlockHeaders");

      const dexAddresses = [];
      options.dexIds.forEach((dexId) =>
        dexAddresses.push(config.dex[dexId].routerAddress)
      );

      web3Subscription.on("data", async (data) => {
        // query db for transactions on dex
        const transactions = await getTransactionsToEthereum([
          data.number - 1,
          dexAddresses,
        ]);

        // decoding transactions
        const decodedTransactions = [];

        await async.eachLimit(transactions, 100, async (transaction) => {
          let response = {};
          let params;
          const functionHash = await transaction.input.substr(0, 10);

          if (priceDiscoveryConfig.dexFunctionHashEvm.includes(functionHash)) {
            response = {
              hash: transaction.hash,
              from: transaction.from,
              to: transaction.to,
              chainId: transaction.chain_id,
              blockNumber: transaction.block_number,
              transactionIndex: transaction.transaction_index,
              input: transaction.input,
            };

            params = await web3.eth.abi.decodeParameters(
              priceDiscoveryConfig.functionHashToParamsEvm[functionHash],
              transaction.input.substr(10, transaction.input.length)
            );

            if (
              functionHash === "0xfb3bdb41" ||
              functionHash === "0x7ff36ab5" ||
              functionHash === "0xb6f9de95"
            ) {
              response.amountOut = web3.utils.fromWei(params[0], "ether");
              response.initialToken = params["1"]["0"];
              response.finalToken = params["1"][params[1].length - 1];
            } else {
              response.amountIn = params["0"];
              response.amountOut = web3.utils.fromWei(params[1], "ether");
              response.initialToken = params["2"]["0"];
              response.finalToken = params["2"][params[2].length - 1];
            }

            decodedTransactions.push(response);
          }
        });

        socket.emit("getTrades", decodedTransactions);
      });
    } catch (error) {
      return error;
    }

    return null;
  },
};
