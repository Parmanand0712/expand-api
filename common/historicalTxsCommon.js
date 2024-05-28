const async = require("async");
const getTransaction = require("../src/expand/chain/getTransaction");
const { getMethodSignatureById } = require("./tokenTransactionsCommon");

exports.getStartAndEndBlocks = (startBlock, endBlock, currentBlock, defaultBlockRange) => {
  let fromBlock = startBlock;
  let toBlock = endBlock;

  if (!startBlock && !endBlock && startBlock !== 0 && endBlock !== 0) {
    toBlock = currentBlock.toString();
    fromBlock = (currentBlock - Number(defaultBlockRange)).toString();
  } else if (!startBlock && startBlock !== 0 && endBlock){
    fromBlock = (Number(endBlock) - 1 - Number(defaultBlockRange) < 0 ? 0 : Number(endBlock) - Number(defaultBlockRange)).toString();
  }
  else if ((startBlock === 0 || startBlock) && !endBlock) {
    toBlock = (Number(startBlock) + Number(defaultBlockRange) > currentBlock
      ? currentBlock : Number(startBlock) + Number(defaultBlockRange)).toString();
  }
  return { fromBlock, toBlock };
};

exports.getPastEvents = async (tokenContract, fromBlock, toBlock, address) => {
  let tokenLogs = await tokenContract.getPastEvents('allEvents', { fromBlock, toBlock });

  if (address) {
    tokenLogs = tokenLogs.filter((tx) => tx.returnValues && (tx.returnValues.from === address || tx.returnValues.to === address));
  };
  return tokenLogs;
};

const sortTransactionsByBlock = (a, b) => a.blockNumber - b.blockNumber;

exports.getParsedTransactions = async (web3, chainName, tokenLogs) => {
  let transactions = [];
  await async.eachLimit(
    tokenLogs,
    100,
    async (tx) => {
      const txDetail = await getTransaction[`getTransaction${chainName}`](web3, { transactionHash: tx.transactionHash });
      const methodId = (txDetail && txDetail.input) ? txDetail.input.slice(0, 10) : null;
      const methodSignature = methodId && (methodId !== '0x') ? await getMethodSignatureById(methodId) : null;
      transactions.push({ ...txDetail, methodId, methodSignature });
    });
    transactions = transactions.sort(sortTransactionsByBlock);
    return transactions;
};
