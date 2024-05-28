/*
 * All the function in this file
 * should be returning the following schema
 *

    {
        "balance": "1000000"
    }
 */


const axios = require('axios');
const solana = require('@solana/web3.js');
const starknet = require('starknet');
const { JettonMaster, Address } = require('@ton/ton');
const nearApi = require('near-api-js');
const ierc20Abis = require('../../../assets/abis/iERC20.json');
const config = require('../../../common/configuration/config.json');
const starknetNativeEthAbi = require('../../../assets/abis/starknetNativeEth.json');
const { isValidAddressTonAddress, isErc20Contract, isSmartContract } = require('../../../common/contractCommon');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const { getStellarAssetsByIssuer } = require("../../../common/stellarCommon");

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});

module.exports = {

    getBalanceEvm: async (evmWeb3, options) => {
        /*
         * Function will fetch the balance for given wallet from ethereum
         */
        const { address, tokenAddress } = options;

        const [isErc20token, isNotUserAddress] = await Promise.all([
            isErc20Contract(evmWeb3, tokenAddress),
            isSmartContract(evmWeb3, address),
        ]);

        if (isNotUserAddress) return throwErrorMessage("invalidAddress");
        if (tokenAddress && !isErc20token) return throwErrorMessage("invalidErc20Contract");

        if (tokenAddress) {
            const tokenContract = new evmWeb3.eth.Contract(
                ierc20Abis,
                tokenAddress,
            );
            const balance = await tokenContract.methods.balanceOf(address).call();
            return { balance };
        } else {
           const balance = await evmWeb3.eth.getBalance(address);
           return { balance };
        }
    },


    getBalanceSolana: async (solanaWeb3, options) => {
        /*
         * Function will fetch the balance for given wallet from solana
         */

        const { address, tokenAddress } = options;
        let solanaAddress;
        try{
            solanaAddress = new solana.PublicKey(address);
        } catch(error){
            return throwErrorMessage("invalidUserAddress");
        }
        
        const response = {};
        let balance = null;

        if (tokenAddress == null) {

            balance = await solanaWeb3.getBalance(solanaAddress);

        } else {

            const tokenAccount = await solanaWeb3.getTokenAccountsByOwner(new solana.PublicKey(solanaAddress), 
                                                                            { mint: new solana.PublicKey(tokenAddress)});
            // console.log(tokenAccount);
            balance = 0;
            for await (const account of tokenAccount.value) {
                try {
                    const data = await solanaWeb3.getTokenAccountBalance(account.pubkey);
                    balance += parseInt((data) ? data.value.amount : 0);
                } catch(error){
                    balance += 0;
                }
            }
        }
        response.balance = balance.toString();
        return (response);
    },


    getBalanceTerra: async (terraWeb3, options) => {
        /*
         * Function will fetch the balance for given wallet from Terra
         */

        const { address, tokenAddress } = options;
        let balance = null;
        const response = {};

        if (tokenAddress == null) {

            balance = await terraWeb3.bank.balance(address);
            [balance] = balance;

        } else {

            // Yet to implement this use case for Terra chain

        }

        response.balance = balance.toString();
        return (response);
    },


    getBalanceTron: async (tronWeb3, options) => {
        /*
         * Function will fetch the balance for given wallet from Tron
         */

        const { address, tokenAddress } = options;
        let balance = null;
        const response = {};

        if (tokenAddress == null) {

            balance = await tronWeb3.trx.getBalance(address);

        } else {

            const contract = await tronWeb3.contract().at(tokenAddress);
            balance = await contract.balanceOf(address).call();

        }

        response.balance = balance.toString();
        return (response);
    },


    getBalanceNear: async (nearWeb3, options) => {
        /*
         * Function will fetch the balance for given wallet from Near
         */

        const { address, tokenAddress } = options;
        let balance = null;
        const response = {};

        if (tokenAddress == null) {

            balance = await nearWeb3.account(address);
            balance = await balance.getAccountBalance();
            console.log(balance);
            balance = balance.available;

        } else {
            const account = await nearWeb3.account(address);
            const contract = new nearApi.Contract(account, tokenAddress, {
                viewMethods: ["ft_balance_of"],
              });
              balance = await contract.ft_balance_of({ account_id: address });
        }

        response.balance = balance.toString();
        return (response);
    },


    getBalanceAlgorand: async (algorandWeb3, options) => {
        /*
         * Function will fetch the balance for given wallet from Algorand
         */

        const { address, tokenAddress } = options;
        let balance = null;
        const response = {};
        if (tokenAddress == null) {
            balance = await axios.get(
                `${config.chains[algorandWeb3.chainId].rpc}account/${address}?apiKey=${config.chains[algorandWeb3.chainId].key}`
                );
            balance = balance.data[0].confirmed_balance;

        } else {

            // Yet to implement this use case for Algorand chain

        }

        response.balance = balance.toString();
        return (response);
    },

    getBalanceAptos: async (aptosweb3, options) => {
        /*
         * Function will fetch the balance for given wallet from Aptos
         */

        const { address, tokenAddress } = options;
        let balance = null;
        const response = {};

        if (tokenAddress == null) {

            const data = await aptosweb3.getAccountResources(address);
            for (const item of data) {

                if (item.type.includes('AptosCoin')) {
                    balance = item.data.coin.value;
                }
            }

        } else {

            try{
                const data = await aptosweb3.getAccountResource(address , `0x1::coin::CoinStore<${tokenAddress}>`);
                balance = data.data.coin.value;
            }
            catch(err){
                balance = 'not Available';
            }
        }

        response.balance = balance.toString();
        return (response);
    },

    getBalanceStarkNet: async (starknetweb3, options) => {
        /*
         * Function will fetch the balance for given wallet from Starknet
         */

        const { address, tokenAddress } = options;
        let balance = null;
        const response = {};

        if (tokenAddress == null) {
            const nativeEthContract = new starknet.Contract(starknetNativeEthAbi, config.StarkNetTokens.native, starknetweb3);
            const data = await nativeEthContract.balanceOf(address);
            balance = data.balance.low.toString();

        } else {

            const tokenContract = new starknet.Contract(starknetNativeEthAbi, tokenAddress, starknetweb3);
            const data = await tokenContract.balanceOf(address);
            balance = data.balance.low.toString();

        }

        response.balance = balance;
        return (response);
    },

    getBalanceSui: async (suiWeb3, options) => {

        // Function will fetch the latest balance of sui tokens/token specified for an address in Sui Blockchain

        const { address, tokenAddress } = options;
        let balance = null;
        const response = {};

        if (tokenAddress === null) {
            balance = await suiWeb3.getBalance({
                owner: address,
                coinType: config.SuiTokens.native
            });
            balance = balance.totalBalance;
        } else {
            balance = await suiWeb3.getBalance({
                owner: address,
                coinType: tokenAddress
            });
            balance = balance.totalBalance;
        }
        response.balance = balance;
        return (response);
    },

    getBalanceTon: async (tonClient, options) => {
        // Function will fetch the latest balance of ton tokens/token specified for an address in ton Blockchain
        
        const { address, tokenAddress } = options;
        if (!isValidAddressTonAddress(address)) return throwErrorMessage("invalidUserAddress");
        if (tokenAddress && !isValidAddressTonAddress(tokenAddress)) return throwErrorMessage("invalidJetton");

        if (tokenAddress) {
            try {
                const jettonMasterAddress = Address.parse(tokenAddress);
                const userAddress = Address.parse(address);

                const jettonMaster = tonClient.open(JettonMaster.create(jettonMasterAddress));
                const userWalletContract = await jettonMaster.getWalletAddress(userAddress);
                const { stack } = await tonClient.runMethod(
                    userWalletContract,
                    'get_wallet_data'
                );
                return { balance: stack.items[0].value.toString() };
            } catch (err) {
                return { balance: '0' };
            }
        } else {
            const balance = await tonClient.getBalance(address);
            return { balance: balance.toString() };
        }
    },

    getBalanceStellar: async (stllrWeb3, options) => {
        // Function will fetch the latest balance of stellar assets/token specified for an address in Stellar Blockchain

        const { chainId, address, issuer, assetCode } = options;
        const { decimals } = config.chains[chainId];

        let account;

        // Initializing account to get its sequence
        try {
            account = await stllrWeb3.loadAccount(address);
        } catch (e) {
            return throwErrorMessage("invalidUserAddress");
        }

        // Getting all the assets user is holding
        const balances = account.balances.map(({ asset_type: type, balance, asset_code: code, asset_issuer: assetIssuer }) => ({
            type, balance: (Number(balance) * decimals).toString(), code, assetIssuer
        }));

        // Gets executed only if both issuer and assetCode are given
        if (issuer && assetCode) {
            try {
                // Checking if issuer and assetCode are correct
                const records = await getStellarAssetsByIssuer(stllrWeb3, issuer, assetCode);
                if (!records) return throwErrorMessage("invalidIssuer");
                if (!records.length) return throwErrorMessage("assetNotFound");

                const asset = balances?.filter(token => token.code === assetCode && token.assetIssuer === issuer) || [];
                const balance = asset.length ? asset[0].balance : "0";
                return { assetCode, issuer, balance };
            } catch (err) {
                return {
                    'message': err.response?.extras?.reason,
                    'code': errorMessage.error.code.invalidInput
                };
            };
        }
        const nativeBalance = balances?.filter(({ type }) => type === 'native');
        return { balance: nativeBalance[0] ? (nativeBalance[0].balance).toString() : "0" };
    },
};
