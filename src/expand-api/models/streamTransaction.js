const { query, transaction } = require("../../../common/db");

module.exports = {
  // get queries

  getClientInfoByClientId: async (clientId) => {
    const result = await query(
      `SELECT array_agg(address) as addresses from public."client_info" WHERE client_id = $1`,
      clientId
    );
    return result && result.rows.length > 0 ? result.rows : [{}];
  },

  getTransactionsToAndFromEthereum: async (subscribedAddresses) => {
    const result = await query(
      `
            SELECT *
            FROM public."transactions_ethereum"
            WHERE block_number = $1 AND ("from" = ANY ($2) OR "to" = ANY ($2))`,
      subscribedAddresses
    );
    return result && result.rows.length > 0 ? result.rows : [{}];
  },

  getTransactionsToEthereum: async (addresses) => {
    const result = await query(
      `
            SELECT *
            FROM public."transactions_ethereum"
            WHERE block_number = $1 AND "to" = ANY ($2)
      `,
      addresses
    );
    return result && result.rows.length > 0 ? result.rows : [];
  },

  // write queries

  insertTransactionsEthereum: async (transactionDetails) => {
    await transaction(
      `
            insert into public."transactions_ethereum" (
                "block_hash",
                "block_number",
                "chain_id",
                "from",
                "gas",
                "gas_price",
                "hash",
                "input",
                "nonce",
                "r",
                "s",
                "to",
                "transaction_index",
                "type",
                "v",
                "value"
            ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        `,
      transactionDetails
    );
    return true;
  },

  // formatting response from db

  formatInsertTransactionsEthereum: (transactionDetails) => {
    const formatedTransactionDetails = [
      transactionDetails.blockHash || "",
      transactionDetails.blockNumber || 0,
      transactionDetails.chainId || "",
      transactionDetails.from || "",
      transactionDetails.gas || 0,
      transactionDetails.gasPrice || 0,
      transactionDetails.hash || "",
      transactionDetails.input || "",
      transactionDetails.nonce || 0,
      transactionDetails.r || "",
      transactionDetails.s || "",
      transactionDetails.to || "",
      transactionDetails.transactionIndex || 0,
      transactionDetails.type || 0,
      transactionDetails.v || "",
      transactionDetails.value || "",
    ];
    return formatedTransactionDetails;
  },

  formatStreamTransactionsEthereum: (transactionDetails) => {
    const ret = [];
    if (!transactionDetails) return ret;
    Object.keys(transactionDetails).forEach((transactionDetail) => {
      ret.push({
        blockHash: transactionDetails[transactionDetail][0],
        blockNumber: transactionDetails[transactionDetail][1],
        chainId: transactionDetails[transactionDetail][2],
        from: transactionDetails[transactionDetail][3],
        gas: transactionDetails[transactionDetail][4],
        gasPrice: transactionDetails[transactionDetail][5],
        hash: transactionDetails[transactionDetail][6],
        input: transactionDetails[transactionDetail][7],
        nonce: transactionDetails[transactionDetail][8],
        r: transactionDetails[transactionDetail][9],
        s: transactionDetails[transactionDetail][10],
        to: transactionDetails[transactionDetail][11],
        transactionIndex: transactionDetails[transactionDetail][12],
        type: transactionDetails[transactionDetail][13],
        v: transactionDetails[transactionDetail][14],
        value: transactionDetails[transactionDetail][15],
      });
    });
    return ret;
  },
};
