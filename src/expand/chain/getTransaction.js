/* 
 * All the function in this file
 * should be returning the following schema
 * 
 
    {
        'hash': '0xfd05b1691ebc79f6f9e50c0d700e7ae5bc76a3fc3a2b7254782214800f7faa6f',
        'transactionStatus': 'Success',
        'blockNumber': 14761060,
        'timestamp': 'May-12-2022 12:22:59 PM +UTC',
        'from': '0xcfab322f8665595dc7e0cb96a02131e8dffe80d9',
        'to': '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        'value': '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        'transactionFees': '13487426901537173',
        'gas': 21000,
        'gasPrice': '224929154671',
        'input': '0x',
        'nonce': 37,
        'network': ''
    }
 */

const { Address } = require('@ton/ton');
const TonWeb = require("tonweb");
const { TransactionBuilder } = require('stellar-sdk');
const axios = require('axios');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const { isValidAddressTonAddress } = require('../../../common/contractCommon');
const config = require('../../../common/configuration/config.json');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});

module.exports = {


    getTransactionEvm: async (evmWeb3, options) => {
        /*
         * Function will fetch the transaction metadata from ethereum based chains
         */

        const { transactionHash, chainId } = options;
        try {
            const [transaction, transactionData] = await Promise.all([evmWeb3.eth.getTransaction(transactionHash)
                , evmWeb3.eth.getTransactionReceipt(transactionHash)]);

                const response = {};
                // mapping all the fields
                response.chainId = chainId;
                response.hash = transaction.hash;
                response.transactionStatus = transactionData.status;
                response.blockNumber = transaction?.blockNumber.toString();
                response.timestamp = null;
                response.from = transaction?.from || null;
                response.to = transaction?.to || null;
                response.value = transaction.value;
                response.transactionFees = (transactionData.gasUsed * transactionData.effectiveGasPrice).toString();
                response.gas = transaction?.gas.toString();
                response.gasPrice = transaction.gasPrice;
                response.input = transaction.input;
                response.nonce = transaction.nonce;
                response.type = transaction?.type || null;
                response.network = null;
                response.v = transaction.v;
                response.r = transaction.r;
                response.s = transaction.s;
                response.yParity = transaction?.yParity || null;
                response.transactionIndex = transaction?.transactionIndex || null;
                response.accessList = transaction?.accessList || null;
                response.maxFeePerGas = transaction?.maxFeePerGas || null;
                response.maxPriorityFeePerGas = transaction?.maxPriorityFeePerGas || null;
                response.logs = transactionData?.logs || [];
              
                return (response);
              }
        catch (error) {
            return throwErrorMessage("invalidTransactionHash");
        }

    },


    getTransactionSolana: async (solanaWeb3, options) => {
        /*
         * Function will fetch the transaction metadata from solana
         */
        try {
            
            const { transactionHash } = options;
            const transaction = await solanaWeb3.getParsedTransaction(transactionHash);
            const accounts = transaction.transaction.message.accountKeys;
            const response = {};

            // mapping all the fields
            [response.hash] = transaction.transaction.signatures;
            response.transactionStatus = null;
            response.blockNumber = transaction.slot;
            response.timestamp = transaction.blockTime;
            response.from = accounts[0].pubkey;
            response.to = accounts[1].pubkey;
            response.value = (transaction.meta.preBalances[0] - transaction.meta.postBalances[0] - transaction.meta.fee).toString();
            response.transactionFees = transaction?.meta?.fee || null;
            response.gas = null;
            response.gasPrice = null;
            if (transaction.transaction.message.instructions) {
                let data = '';
                transaction.transaction.message.instructions.forEach(instruction => {
                    data += (instruction.data) ? `${instruction.data},` : '';
                });
                response.input = data.length > 0 ? data.substring(0, data.length - 1) : null;
            } else {
                response.input = null;
            }
            response.nonce = null;
            response.network = null;
            return (response);
        } catch (error) {
            return throwErrorMessage("invalidTransactionHash");
        }
    },

    // eslint-disable-next-line no-unused-vars
    getTransactionAVAX: async (evmWeb3, options) => {
        /*
         * Function will fetch the transaction metadata from ethereum based chains
         */

        const response = {};

        response.message = errorMessage.error.message.notApplicable;
        response.error = errorMessage.error.code.notApplicable;

        return (response);

    },



    getTransactionTerra: async (terraWeb3, options) => {
        /*
         * Function will fetch the transaction data from terra based chains
         */

        const { transactionHash } = options;
        let transaction = await terraWeb3.tx.txInfo(transactionHash);
        transaction = JSON.parse(JSON.stringify(transaction));
        const accounts = transaction.tx.auth_info.signer_infos;
        const response = {};

        // mapping all the fields
        response.hash = transaction.txhash;
        response.transactionStatus = transaction.code;
        response.blockNumber = transaction.height;
        response.timestamp = transaction.timestamp;
        [response.from] = accounts;
        response.to = accounts[accounts.length - 1];
        response.value = null;
        response.transactionFees = transaction.gas_used;
        response.gas = transaction.gas_used;
        response.gasPrice = null;
        response.input = transaction.tx.body.messages;
        response.nonce = null;
        response.network = null;

        return (response);
    },


    getTransactionTron: async (tronWeb, options) => {
        /*
         * Function will fetch the transaction metadata from Tron chain
         */

        const { transactionHash } = options;
        const transaction = await tronWeb.trx.getTransaction(transactionHash);
        const response = {};
        const from = transaction.raw_data.contract[0].parameter.value.owner_address;
        const to = transaction.raw_data.contract[0].parameter.value.to_address;

        // mapping all the fields
        response.hash = transaction.txID;
        response.transactionStatus = transaction.ret[0].contractRet;
        response.blockNumber = null;
        response.timestamp = transaction.raw_data.timestamp;
        response.from = {
            "tronAddress": tronWeb.address.fromHex(from),
            "hexAddress": from
        };
        response.to = {
            "tronAddress": tronWeb.address.fromHex(to),
            "hexAddress": to
        };
        response.value = transaction.raw_data.contract[0].parameter.value.amount;
        response.transactionFees = null;
        response.gas = null;
        response.gasPrice = null;
        response.input = transaction.raw_data_hex;
        response.nonce = null;
        response.network = null;

        return (response);

    },


    getTransactionNear: async (nearWeb, options) => {
        /*
         * Function will fetch the transaction metadata from Tron chain
         */

        const { transactionHash } = options;
        const transaction = await nearWeb.connection.provider.txStatus(transactionHash, 'expand.network');
        const response = {};

        const tokensBurntByTx = transaction.transaction_outcome
            ? transaction.transaction_outcome.outcome.tokens_burnt : 0;
        const tokensBurntByReceipts = transaction.receipts_outcome
            ? transaction.receipts_outcome
                .map((receipt) => (receipt.outcome.tokens_burnt))
                .reduce(
                    (tokenBurnt, currentFee) => Number(tokenBurnt) + Number(currentFee),
                    0
                )
            : 0;

        const transactionFees = (Number(tokensBurntByTx) + Number(tokensBurntByReceipts)).toLocaleString('fullwide', { useGrouping: false });

        // mapping all the fields
        response.hash = transaction.transaction.hash;
        response.transactionStatus = transaction.transaction_outcome.status;
        response.blockNumber = transaction.transaction_outcome.block_hash;
        response.timestamp = null;
        response.from = transaction.transaction.signer_id;
        response.to = transaction.transaction.receiver_id;
        response.value = null;
        response.transactionFees = transactionFees;
        response.gas = null;
        response.gasPrice = null;
        response.input = transaction.transaction.actions;
        response.nonce = transaction.transaction.nounce;
        response.network = null;

        return (response);

    },

    getTransactionAlgorand: async (algorandWeb, options) => {
        /*
         * Function will fetch the transaction metadata from Tron chain
         */

        const { transactionHash  , chainId} = options;

        const transaction = await axios.get(
            `${config.chains[chainId].rpc}tx/${transactionHash}?apiKey=${config.chains[chainId].key}`
          );
        const response = {};

        // mapping all the fields
        response.hash = transactionHash;
        response.transactionStatus = transaction.data.status;
        response.blockNumber = transaction.data.block_number;
        response.timestamp = transaction.data.date;
        response.from = null;
        response.to = null;
        response.value = null;
        response.transactionFees = null;
        response.gas = null;
        response.gasPrice = null;
        response.input = transaction.data.meta.note;
        response.nonce = null;
        response.network = null;

        return (response);

    },

    getTransactionSui: async (suiWeb3, options) => {

        // Function will retrun complete details of a transaction by transaction Hash

        const { transactionHash } = options;
        const transaction = await suiWeb3.getTransactionBlock({
            digest: transactionHash,
            options: {
                showEffects: true,
                showInput: true,
                showEvents: true,
                showObjectChanges: true,
                showBalanceChanges: true,
                showGasObjects: true
            }
        });
        const gasPrice = await suiWeb3.getReferenceGasPrice();
        const response = {};
        const gasUsed = {};
        gasUsed.computationFee = transaction.effects.gasUsed.computationCost;
        gasUsed.storageFee = transaction.effects.gasUsed.storageCost;
        gasUsed.storageRebate = transaction.effects.gasUsed.storageRebate;
        gasUsed.nonRefundableStorageFee = transaction.effects.gasUsed.nonRefundableStorageFee;

        response.hash = transaction.digest;
        response.transactionStatus = transaction.effects.status;
        response.gas_used = transaction.gasUsed;
        response.transactionStatus = transaction.effects.status.status;
        response.blockNumber = transaction.checkpoint;
        response.timestamp = transaction.timestampMs;
        response.from = transaction.transaction.data.sender;
        response.to = null;
        response.value = null;
        response.transactionFees = gasUsed;
        response.gas = transaction.transaction.data.gasData;
        response.gasPrice = Number(gasPrice);
        response.input = transaction.transaction.data.transaction.inputs;
        response.nonce = null;
        response.network = null;

        return (response);



    },

    getTransactionAptos: async (aptosweb3, options) => {
        /*
         * Function will fetch the transaction metadata from Aptos chain
         */

        const { transactionHash } = options;
        const transaction = await aptosweb3.getTransactionByHash(transactionHash);
        const response = {};

        // mapping all the fields
        response.hash = transactionHash;
        response.transactionStatus = transaction.success;
        response.blockNumber = transaction['current-round'];
        response.timestamp = transaction.timestamp;
        response.from = transaction.sender;
        response.to = null;
        response.value = null;
        response.transactionFees = transaction.gas_used;
        response.gas = transaction.max_gas_amount;
        response.gasPrice = transaction.gas_unit_price;;
        response.input = null;
        response.nonce = null;
        response.network = null;

        return (response);

    },

    getTransactionStarkNet: async (starknetweb3, options) => {
        /*
         * Function will fetch the transaction metadata from StarkNet chain
         */

        const { transactionHash } = options;
        const [transactionData, transactionRawData] = await Promise.all([
            await starknetweb3.getTransactionByHash(transactionHash),
            await starknetweb3.getTransactionReceipt(transactionHash),
        ]);

        const response = {};

        // mapping all the fields
        response.hash = transactionHash;
        response.transactionStatus = transactionRawData.status;
        response.blockNumber = transactionRawData.block_number;
        response.timestamp = null;
        response.from = transactionData.sender_address;
        response.to = null;
        response.value = null;
        response.transactionFees = (BigInt(transactionRawData.actual_fee)).toString();
        response.gas = transactionData.max_fee ? (BigInt(transactionData.max_fee)).toString() : null;
        response.gasPrice = null;
        response.input = transactionData.calldata;
        response.nonce = (BigInt(transactionData.nonce)).toString();
        response.network = null;

        return (response);

    },

    getTransactionTon: async (_, options) => {
        /*
         * Function will fetch the transaction metadata from StarkNet chain
         */
        const { address, transactionHash, chainId } = options;
        const txBase64 = Buffer.from(transactionHash, 'hex').toString('base64');
        if (!isValidAddressTonAddress(address)) return throwErrorMessage("invalidUserAddress");

        const tonweb = new TonWeb(
            new TonWeb.HttpProvider(config.chains[chainId].publicRpc, { apiKey: process.env.tonRPCApiKey })
        );

        try {
            const tx = await tonweb.getTransactions(Address.parse(address), 1, undefined, txBase64, undefined, true);
            if (tx.length === 0) return throwErrorMessage("invalidTransactionHash");
            return tx[0];
        } catch (err) {
            throw Error(err);
        }
    },

    getTransactionStellar: async (stllrWeb3, options) => {
        /*
         * Function will fetch the transaction metadata from ethereum based chains
         */

        // transaction details to be checked
        const { transactionHash, chainId } = options;
        try {
            const transaction = await stllrWeb3.transactions().transaction(transactionHash).call();
            // Decoding the envolve_xdr
            const decodedTx = TransactionBuilder.fromXDR(transaction.envelope_xdr, config.chains[chainId].networkPassphrase);

            const response = {};
            response.hash = transaction.hash;
            response.transactionStatus = transaction?.successful;
            response.blockNumber = transaction?.ledger_attr?.toString();
            response.timestamp = transaction?.created_at;
            response.from = transaction.source_account;
            response.to = transaction?.to || null;
            response.value = transaction?.value || null;
            response.transactionFees = null;
            response.gas = transaction.max_fee;
            response.gasPrice = transaction.fee_charged;
            response.input = null;
            response.nonce = Number(transaction.source_account_sequence);
            response.network = null;
            response.envelopeXDR = transaction.envelope_xdr;
            response.resultXDR = transaction.result_xdr;
            response.signatures = transaction.signatures;
            response.operations = decodedTx._operations;

            return (response);
        }
        catch (error) {
            return throwErrorMessage("invalidTransactionHash");
        }
    },
};
