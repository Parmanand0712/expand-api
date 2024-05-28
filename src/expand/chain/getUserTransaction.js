/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a getUserTransactions() response
    {
        transactions: [] 
    }
*/

const { default: axios } = require('axios');
const TonWeb = require("tonweb");
const { TransactionBuilder } = require('stellar-sdk');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const config = require('../../../common/configuration/config.json');
const { isSmartContract, isValidContractAddress, isValidAddressTonAddress, isValidStellarAccount } = require('../../../common/contractCommon');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const { selectGlacierKey } = require('../../../common/selectGlacierKey');
require("dotenv").config({ path: '../../../.env' });

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});

module.exports = {
    getUserTransactionAVAX: async (web3, options) => {
        const filterOptions = options;
        filterOptions.function = "getUserTransaction()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const { startBlock, endBlock, pageToken, chainId } = filterOptions;
        let { address } = options;
        const { sortOrder } = filterOptions;
        const baseUrl = config.glacier.baseUrl[chainId];
        let startTimestamp;
        let endTimestamp;
        if (endBlock) {
            try {
                endTimestamp = await axios.request(`${baseUrl}/blocks/${endBlock}`);
                endTimestamp = endTimestamp.data.blockTimestamp;
                if (!startBlock) startTimestamp = 0;
            } catch (error) {
                return error.response.data;
            }
        }

        if (startBlock) {
            try {
                startTimestamp = await axios.request(`${baseUrl}/blocks/${startBlock}`);
                startTimestamp = startTimestamp.data.blockTimestamp;
                if (!endBlock) {
                    const date = new Date();
                    endTimestamp = Math.floor(date / 1000);
                }
            } catch (error) {
                return error.response.data;
            }
        }

        if (startTimestamp >= endTimestamp) {
            return { "msg": "Start time can not be ahead of endtime" };
        }

        const pageLength = parseInt(config.glacier.pageSize);

        let sortBy;
        if (!sortOrder) {
            sortBy = config.glacier.sortOrder;
        } else {
            sortBy = sortOrder;
        }

        let url;
        if (startTimestamp !== undefined && endTimestamp !== undefined) {
            if (pageToken) {
                url = `${baseUrl}/transactions?addresses=${address}&startTimestamp=${startTimestamp}
                      &endTimestamp=${endTimestamp}&pageSize=${pageLength}&pageToken=${pageToken}&sortOrder=${sortBy}`;
            }
            else {
                url = `${baseUrl}/transactions?addresses=${address}&startTimestamp=${startTimestamp}
                       &endTimestamp=${endTimestamp}&pageSize=${pageLength}&sortOrder=${sortBy}`;
            }

        }
        if (startTimestamp === undefined && endTimestamp === undefined) {
            if (pageToken) {
                url = `${baseUrl}/transactions?addresses=${address}&pageSize=${pageLength}&pageToken=${pageToken}&sortOrder=${sortBy}`;
            }
            else
                url = `${baseUrl}/transactions?addresses=${address}&pageSize=${pageLength}&sortOrder=${sortBy}`;
        }

        try {

            const response = {};
            const transactions = [];
            let nextPageToken;
            const fold = 5;
            const foldIter = [];
            for (let i = 0; i < fold; i += 1)
                foldIter.push(i);
            const apiKey = await selectGlacierKey().then(resp => resp.data);
            const configuration = {
                method: 'get',
                maxBodyLength: Infinity,
                url,
                headers: {
                    'accept': 'application/json',
                    'x-glacier-api-key': apiKey
                }
            };

            // while (fold > 0) {
            for await (const iter of foldIter) {
                configuration.url = url;
                let result;
                try {
                    result = await axios.request(configuration);
                } catch (error) {
                    return error.response.data;
                }
                console.log("working on iter: ", iter);
                result = result.data;
                for (const transaction of result.transactions) {
                    const updatedConsumedUtxos = [];
                    const updatedEmittedUtxos = [];
                    for (const utxo of transaction.consumedUtxos) {
                        if (!address.includes(',')) {
                            if (address.length === 45)
                                address = address.slice(2, address.length);
                            if (utxo.threshold <= 1) {
                                if (address.includes(utxo.addresses[0])) {
                                    updatedConsumedUtxos.push(utxo);
                                }
                            } else if (utxo.threshold > 1) {
                                if (utxo.addresses.includes(address)) {
                                    updatedConsumedUtxos.push(utxo);
                                }
                            }
                            // if (utxo.addresses.includes(address)) {
                            //     updatedConsumedUtxos.push(utxo);
                            // }
                        }
                        if (address.includes(',')) {
                            if (utxo.threshold <= 1) {
                                if (address.includes(utxo.addresses[0])) {
                                    updatedConsumedUtxos.push(utxo);
                                }
                            } else if (utxo.threshold > 1) {
                                const arrAddress = address;
                                if (utxo.addresses.some(addr => arrAddress.includes(addr))) {
                                    updatedConsumedUtxos.push(utxo);
                                }
                            }
                            // const arrAddress = address.split(',');
                            // if (utxo.addresses.some(addr => arrAddress.includes(addr))) {
                            //     updatedConsumedUtxos.push(utxo);
                            // }
                        }

                    }
                    for (const utxo of transaction.emittedUtxos) {
                        if (!address.includes(',')) {
                            if (address.length === 45)
                                address = address.slice(2, address.length);
                            if (utxo.threshold <= 1) {
                                if (address.includes(utxo.addresses[0])) {
                                    updatedEmittedUtxos.push(utxo);
                                }
                            } else if (utxo.threshold > 1) {
                                if (utxo.addresses.includes(address)) {
                                    updatedEmittedUtxos.push(utxo);
                                }
                            }
                            // if (utxo.addresses.includes(address)) {
                            //     updatedEmittedUtxos.push(utxo);
                            // }
                        }
                        else {
                            if (utxo.threshold <= 1) {
                                if (address.includes(utxo.addresses[0])) {
                                    updatedEmittedUtxos.push(utxo);
                                }
                            }
                            if (utxo.threshold > 1) {
                                const arrAddress = address;
                                if (utxo.addresses.some(addr => arrAddress.includes(addr))) {
                                    updatedEmittedUtxos.push(utxo);
                                }
                            }
                            // const arrAddress = address.split(',');
                            // if (utxo.addresses.some(addr => arrAddress.includes(addr))) {
                            //     updatedEmittedUtxos.push(utxo);
                            // }
                        }

                    }
                    transaction.consumedUtxos = updatedConsumedUtxos;
                    transaction.emittedUtxos = updatedEmittedUtxos;
                }
                if (options.chainId === '43116') {
                    const updatedTransactions = [];
                    for (const transaction of result.transactions) {
                        try {
                            Object.defineProperty(
                                transaction,
                                'blockNumber',
                                Object.getOwnPropertyDescriptor(transaction, 'blockHeight')
                            );
                            delete transaction.blockHeight;

                            updatedTransactions.push(transaction);
                        } catch (error) {
                            updatedTransactions.push(transaction);
                            console.log(error);
                        }
                    }
                    // updatedTransactions = await Promise.all(updatedTransactions);
                    result.transactions = updatedTransactions;
                }
                transactions.push(result.transactions);
                if (result.nextPageToken) {
                    nextPageToken = result.nextPageToken;
                    url = `${baseUrl}/transactions?addresses=${address}&pageSize=${pageLength}&pageToken=${nextPageToken}&sortOrder=${sortBy}`;
                } else {
                    nextPageToken = undefined;
                    break;
                }
                // fold -= 1;
            }
            response.transactions = transactions.flat();
            if (nextPageToken) {
                response.nextPageToken = nextPageToken;
            }
            return response;
        } catch (error) {
            console.log(error);
            if (error.response.data.statusCode === 500) {
                return [];
            }
            return error.response.data;
        }
    },


    getUserTransactionEvm: async (web3, options) => {

        if (options.chainId === "43114") {

            const filterOptions = options;
            filterOptions.function = "getUserTransaction()";
            const validJson = await schemaValidator.validateInput(filterOptions);

            if (!validJson.valid) {
                return (validJson);
            }

            const { address, sortOrder, pageToken } = options;
            let { startBlock, endBlock } = options;
            const baseUrl = config.glacier.baseUrl[options.chainId];

            if (startBlock && !(endBlock)) {
                endBlock = await web3.eth.getBlockNumber();
            }

            if (!startBlock && endBlock) {
                startBlock = 1;
            }

            const pageLength = config.glacier.pageSize;

            let sortBy;
            if (!sortOrder) {
                sortBy = config.glacier.sortOrder;
            } else {
                sortBy = sortOrder;
            }

            let url;
            if (startBlock !== undefined && endBlock !== undefined) {
                if (pageToken) {
                    url = `${baseUrl}/${address}/transactions?startBlock=${startBlock}
                                &endBlock=${endBlock}&pageSize=${pageLength}&pageToken=${pageToken}&sortOrder=${sortBy}`;
                } else {
                    url = `${baseUrl}/${address}/transactions?startBlock=${startBlock}
                                &endBlock=${endBlock}&pageSize=${pageLength}&sortOrder=${sortBy}`;
                }
            }
            if (startBlock === undefined && endBlock === undefined) {
                if (pageToken) {
                    url = `${baseUrl}/${address}/transactions?pageSize=${pageLength}&pageToken=${pageToken}&sortOrder=${sortBy}`;
                } else {
                    url = `${baseUrl}/${address}/transactions?pageSize=${pageLength}&sortOrder=${sortBy}`;
                }
            }

            try {

                const response = {};
                const transactions = [];
                let nextPageToken;
                const fold = 5;
                const foldIter = [];
                for (let i = 0; i < fold; i += 1)
                    foldIter.push(i);
                const configuration = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url,
                    headers: {
                        'accept': 'application/json',
                        'x-glacier-api-key': process.env.GLACIER
                    }
                };

                for await (const iter of foldIter) {
                    configuration.url = url;
                    let result;
                    try {
                        result = await axios.request(configuration);
                    } catch (error) {
                        return error.response.data;
                    }
                    console.log("working on iter: ", iter);
                    result = result.data;
                    transactions.push(result.transactions);
                    if (result.nextPageToken) {
                        nextPageToken = result.nextPageToken;
                        url = `${baseUrl}/${address}/transactions?pageSize=${pageLength}&pageToken=${nextPageToken}&sortOrder=${sortBy}`;
                    } else {
                        nextPageToken = undefined;
                        break;
                    }
                    // fold -= 1;
                }
                response.transactions = transactions.flat();
                if (nextPageToken) {
                    response.nextPageToken = nextPageToken;
                }
                return response;
            } catch (error) {
                if (error.response.data.statusCode === 500) {
                    return [];
                }
                return error.response.data;
            }
        }
        else {
            const filterOptions = { ...options, function: 'getEvmUserTransactions()' };
            const validInput = await schemaValidator.validateInput(filterOptions);
            if (!validInput.valid) {
                return validInput;
            }

            const { address, sortOrder, chainId, pageToken, contractAddress } = filterOptions;
            const { baseUrl, apiKeyUserTransactions } = config.covalent;

            const [isNotUserAddress, isValidAddress, isValidContract] = await Promise.all([
                isSmartContract(web3, address),
                isValidContractAddress(web3, address),
                isSmartContract(web3, contractAddress),
            ]);

            if (isNotUserAddress || !isValidAddress) return throwErrorMessage("invalidUserAddress");
            if (contractAddress && !isValidContract) return throwErrorMessage("invalidContractAddress");
            let transactions = [];

            const getAxiosConfig = (url, order = 'desc') =>
                axios({
                    "method": 'get',
                    "url": `${baseUrl}${chainId}/address/${address}/${url}`,
                    "params": { "block-signed-at-asc": order === "asc" },
                    "headers": {
                        'Authorization': `Bearer ${apiKeyUserTransactions}`
                    }
                });

            const getPageCount = (transactionCount) => {
                let totalPages = 0;
                totalPages = Math.floor(transactionCount / 1000);
                totalPages = transactionCount % 10000 > 0 && totalPages + 1;
                totalPages = totalPages === 0 ? 1 : totalPages;
                return totalPages.toString();
            };

            const summery = await getAxiosConfig('transactions_summary/');
            const transactionCount = summery?.data?.data?.items?.[0]?.total_count || 0;

            if (transactionCount === 0) return { transactions };

            const totalPages = getPageCount(transactionCount);
            const transactionPromises = [];

            for (let covalentPage = (pageToken - 1) * 10; covalentPage < (10 * (pageToken - 1) + 10); covalentPage += 1) {
                transactionPromises.push(getAxiosConfig(`transactions_v3/page/${covalentPage}/`));
            };

            try {
                const response = await Promise.all(transactionPromises);
                transactions = response.map((res) => res.data.data.items);
                transactions = (transactions.reverse()).flat();

                if (contractAddress) {
                    const contractTransactions = [];
                    for (const tx of transactions) {
                        if (tx.log_events) {
                            const contractLogs = tx.log_events.filter(
                                (event) => event.sender_address.toLowerCase() === contractAddress.toLowerCase()
                            );

                            if (contractLogs.length) contractTransactions.push(tx);
                        }
                    };
                    transactions = contractTransactions.flat();
                };
                if (transactions.length === 0) return { transactions };

                for (let j = 0; j < transactions?.length; j += 1) {
                    const { log_events: logEvents } = transactions[j];
                    for (let i = 0; i < logEvents?.length; i += 1) {
                        delete transactions[j]?.log_events[i]?.sender_logo_url;
                    }
                }

                if (sortOrder === "asc") transactions.reverse();
            } catch (error) {
                return throwErrorMessage("tooManyRequests");
            }
            if (Number(pageToken) > Number(totalPages)) return throwErrorMessage("invalidPageNumber");
            return { totalPages, currentPage: pageToken, transactions };
        };
    },

    getUserTransactionTon: async (tonClient, options) => {
        /*
         * Function will fetch the user transactions for Ton chain
         */

        const filterOptions = { ...options, function: 'getTonUserTransactions()' };
        const validInput = await schemaValidator.validateInput(filterOptions);
        if (!validInput.valid) {
            return validInput;
        }

        const { address, limit, chainId } = filterOptions;
        if (!isValidAddressTonAddress(address)) return throwErrorMessage("invalidUserAddress");

        const tonweb = new TonWeb(
            new TonWeb.HttpProvider(config.chains[chainId].publicRpc, { apiKey: process.env.tonRPCApiKey })
        );

        try {
            const txs = await tonweb.getTransactions(address, Number(limit), undefined, undefined, undefined, true);
            return { transactions: txs };
        } catch (err) {
            throw Error(err);
        }
    },

    getUserTransactionStellar: async (stllrWeb3, options) => {
        /*
         * Function will fetch the user transactions for Ton chain
         */

        const filterOptions = { ...options, function: 'getStellarUserTransactions()' };
        const validInput = await schemaValidator.validateInput(filterOptions);
        if (!validInput.valid) {
            return validInput;
        }

        const { address, sortOrder, pageToken, chainId } = filterOptions;
        const { protocol, hostname, path } = stllrWeb3.serverURL._parts;
        const baseURL = `${protocol}://${hostname}${path}`;

        const isValidUser = await isValidStellarAccount(stllrWeb3, address);
        if (!isValidUser) return throwErrorMessage("invalidAddress");
        const apiConfig = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${baseURL}accounts/${address}/transactions`,
            params: {
                limit: 100,
                order: sortOrder,
                ...(pageToken && {cursor: pageToken})
            },
            headers: {}
        };

        try {
            const response = await axios.request(apiConfig);
            let transactions = response.data?._embedded?.records || [];
            if (!transactions.length) return { transactions };

            // Getting pageTokens for pagination
            const pageTokens = response.data?._links;
            const nextPageToken = pageTokens.next.href.split("=")[1].split("&")[0];

            transactions = transactions.map((tx) => {
                const decodedTx = TransactionBuilder.fromXDR(tx.envelope_xdr, config.chains[chainId].networkPassphrase);
                return {
                    hash: tx.hash,
                    transactionStatus: tx?.successful ? "success" : "failed",
                    blockNumber: tx?.ledger_attr?.toString(),
                    timestamp: tx?.created_at,
                    from: tx?.source_account || null,
                    to: tx?.to || null,
                    value: tx?.value || null,
                    transactionFees: null,
                    gas: tx?.max_fee || null,
                    gasPrice: tx?.fee_charged || null,
                    input: null,
                    nonce: tx?.source_account_sequence || null,
                    network: null,
                    envelopeXDR: tx.envelope_xdr,
                    resultXDR: tx.result_xdr,
                    signatures: tx.signatures,
                    operations: decodedTx._operations
                };
            }
            );
            return {transactions, ...(transactions.length === 100 && {nextPageToken})};
        } catch (err) {
            return throwErrorMessage("invalidInput");
        }
    },
};
