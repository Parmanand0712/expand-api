/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a erc20 transfer response
    {
      transactionObject: {
        from: '0x5700030aB87534DF5D2E37842357E2E6B4bB6D0f',
        to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        value: '0',
        gas: 2307200,
        data: '0x095ea7b30000000000000000000000007efa42ee9de5a478ee8753744ba7e4197bbf791f0000000000000000000000000000000000000000000000004563918244f40000'
      }
    }
*/

const web3 = require('@solana/web3.js');
const token = require('@solana/spl-token');
const Common = require("../../../common/common");
const schemaValidator = require('../../../common/configuration/schemaValidator');
const { getGasPrice } = require('../chain/index');

module.exports = {

    transferEvm: async (evmWeb3, options) => {
        /*
            * Function will prepare transferEvm of erc20
        */

        const filterOptions = options;
        filterOptions.function = "transferEvm()";
        const validJson = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return (validJson);
        }

        const erc20Data = await Common.encodeFunctionData(evmWeb3, {
            "functionHash": "0xa9059cbb",
            "parametersType": ["address", "uint256"],
            "parameters": [
                filterOptions.to,
                evmWeb3.utils.toHex(filterOptions.amount)
            ]
        });

        const erc20TransactionObject = {
            "chainId": filterOptions.chainId,
            "from": filterOptions.from,
            "to": filterOptions.tokenAddress,
            "value": '0',
            "gas": filterOptions.gas,
            "data": erc20Data
        };

        if (filterOptions.gasPriority !== undefined) {
            erc20TransactionObject.gasPrice = await getGasPrice(evmWeb3, {
                gasPriority: filterOptions.gasPriority
            }).then(res => res.gasPrice);
        }

        return (erc20TransactionObject);
    },

    transferSolana: async (Connection, options) => {
        /*
            Function will prepare transfer for Solana
        */


        const filterOptions = options;
        filterOptions.function = "transferSolana()";
        const validJson = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return (validJson);
        }


        const feePayer = new web3.PublicKey(options.feePayer);
        const mintPubkey = new web3.PublicKey(options.token);
        const sender = new web3.PublicKey(options.sender);
        const destination = new web3.PublicKey(options.destination);
        // mint token
        const tx = new web3.Transaction();
        tx.add(
            token.createTransferCheckedInstruction(
                sender, // from
                mintPubkey, // mint
                destination, // to
                feePayer, // from's owner
                options.amount, // amount
                options.decimals // decimals
            )
        );
        return tx;


    }


};
