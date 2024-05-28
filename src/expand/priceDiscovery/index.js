const saveTransactions = require('./saveTransactions');
const streamTransactionsSocket = require('./streamTransactionsSocket');
const streamTradesSocket = require('./streamTradesSocket');
const config = require('../../../common/configuration/config.json');

exports.saveTransactions = (options) => {
    const { chainId } = options;
    if (chainId) {
        const { localName, publicRpc, socketRpc } = config.chains[chainId];
        saveTransactions[`saveTransactions${localName}`]({ publicRpc, socketRpc });
    } else {
        console.log("Chain ID doesn't exist.");
    }
};

exports.streamTransactionsSocket = (socket, options) => {
    const {chainId} = options;
    const chainName = config.chains[chainId].localName;
    streamTransactionsSocket[`streamTransactionsSocket${chainName}`](socket, { socketRpc: config.chains[chainId].socketRpc });
};

exports.streamTradesSocket = (socket, options) => {
    const {chainId} = options;
    const chainName = config.chains[chainId].localName;
    streamTradesSocket[`streamTradesSocket${chainName}`](
        socket,
        {
            publicRpc: config.chains[chainId].publicRpc, socketRpc: config.chains[chainId].socketRpc, dexIds: options.dexIds 
        }
    );
};