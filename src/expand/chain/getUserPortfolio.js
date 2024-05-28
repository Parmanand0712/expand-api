/* 
 * All the function in this file
 * should be returning the following schema
 * EVM chains
    {
        "native": "90909",
        "erc20": [
            {
                "symbol": "WETH",
                "address": "0x...cc2",
                "balance": "200000",
                "USDPrice": '1827.23
            },
            ...
        ]
    }
    Solana
    {
        "native": "849919880044",
        "splBalances": [
            {
                "name": "CHICKS",
                "symbol": "CHICKS",
                "assetType": "FungibleAsset",
                "balance": "2000000000",
                "address": "cxxShYRVcepDudXhe7U62QHvw8uBJoKFifmzggGKVC2",
                "decimals": "9",
                "USDPrice": "0.00009026586"
            },
            ...
        ]
    }    
 */
const { default: axios } = require('axios');
const config = require('../../../common/configuration/config.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const { getBalanceEvm, getBalanceNear, getBalanceTon } = require('./getBalance');
require("dotenv").config({ path: '../../../.env' });
const tokenConfig = require('../../../common/configuration/portfolioTokenConfig.json');
const {
    isErc20Contract,
    isSmartContract,
    isValidAddressLengthEvm,
    isValidAddressTonAddress,
    isValidNearUser,
    isValidContractAddress
} = require('../../../common/contractCommon');
const { getSolMetadata, getBalanceSolana, processSPL, } = require('../../../common/solPortfoliohelper');
const { getTokenDetailsEvm, getTokenDetailsNear } = require('../fungibleTokens/getTokenDetails');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});

const getUSDQuote = async (symbol) => {
    const apiConfig = {
        method: 'get',
        url: config.coinMarketCap.priceConversionUrl,
        headers: {
            'X-CMC_PRO_API_KEY': process.env.coinMarketCap
        },
        params: { 'amount': "1", symbol, convert: 'usd' }
    };
    const price = 'NA';
    try {
        const val = await axios.request(apiConfig).then(result => result.data.data[0].quote.USD.price);
        return val ? val.toString() : price;
    } catch (err) {
        return price;
    }
};

module.exports = {

    getUserPortfolioEvm: async (evmWeb3, options) => {
        /*
         * Function will fetch the token balances of the given wallet in ethereum based chains
         */

        const filterOptions = options;
        filterOptions.function = "getUserPortfolio()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const { chainId, address: userAddress, assetType, tokens, availableOnly, pageToken } = filterOptions;
        const { chains, baseUrl, apiKeys } = config.moralisAPI;
        if (!chains?.[chainId]) return throwErrorMessage("notApplicable");

        const [isValidAddress, isContract] = await Promise.all([
            isValidContractAddress(evmWeb3, userAddress),
            isSmartContract(evmWeb3, userAddress),
          ]);

        if (!isValidAddress || isContract) return throwErrorMessage("invalidUserAddress");

        let validTokens = [];
        let extraTokens = tokens;

        // To get the payload for the extra tokens passed
        if (extraTokens) {
            extraTokens = tokens.split(',');
            extraTokens = extraTokens.slice(0, 10);
            validTokens = await Promise.all(extraTokens && extraTokens.map(async (token) => {
                const isValid = isValidAddressLengthEvm(token) ? await isErc20Contract(evmWeb3, token) : false;
                let USDPrice = "NA";
                const address = token;
                if (isValid) {
                    const [metadata, { balance }] = await Promise.all([
                        getTokenDetailsEvm(evmWeb3, { tokenAddress: address }),
                        getBalanceEvm(evmWeb3, { address: userAddress, tokenAddress: address })
                    ]);
                    const { name, symbol, decimals } = metadata;
                    if (symbol !== 'NA') {
                        USDPrice = await getUSDQuote(symbol);
                    }
                    return { name, symbol, decimals, balance, USDPrice, assetType: "ERC20", address };
                } else
                    return {
                        name: 'NA',
                        symbol: 'NA',
                        decimals: 'NA',
                        assetType: "NA",
                        address,
                        USDPrice,
                        "msg": errorMessage.error.message.invalidErc20Contract
                    };
            }));
        }

        const nativeBalance = await getBalanceEvm(evmWeb3, {address: userAddress});
        let apiKey = apiKeys[0];

        // Internal function to get the API config
        const getAPIConfig = (url) => ({
            method: 'get',
            maxBodyLength: Infinity,
            url: `${baseUrl}${url}`,
            headers: {
                'Content-Type': 'application/json',
                'x-API-Key': apiKey
            }
        });

        let evmTokens = [];
        let erc20Tokens = [];
        let nfts = [];
        let nextPage;
        let erc20Cursor = null;
        let nftCursor = null;

        // Internal function to get all the erc20 tokens
        const getAllERC20Tokens = async (cursor = null) => {
            try{
                const erc20Response = await axios.request(
                getAPIConfig(`wallets/${userAddress}/tokens/?chain=${chains[chainId]}&exclude_native=true&cursor=${cursor}`)
            );
            if (erc20Response?.data?.result) {
                erc20Tokens.push(erc20Response?.data?.result.map(token => ({
                    "name": token?.name,
                    "symbol": token?.symbol || null,
                    "decimals": token?.decimals?.toString() || '0',
                    "address": token?.token_address,
                    "balance": token?.balance,
                    "assetType": 'ERC20',
                    "USDPrice": token?.usd_price?.toFixed(10) || null
                })));
            } 
            
            // Recursively calling to get all erc20 tokens
            let res;
            if (erc20Response?.data?.cursor) {
                erc20Cursor = erc20Response.data.cursor;
                res = await getAllERC20Tokens(erc20Cursor);
            }
            erc20Tokens = erc20Tokens.flat();
            return { "status": res?.status === 401 ? 401 : 200}; 
        } catch (err) {
                console.log(apiKey);
                const keyIndex = apiKeys.indexOf(apiKey);
                if ((keyIndex+2) > apiKeys.length) return {status: err.response.status};
                if (err.response.status === 401) {
                    apiKey = apiKeys[keyIndex + 1];
                    const res = await getAllERC20Tokens(erc20Cursor);
                    return { "status": res?.status === 401 ? 401 : 200}; 
                } 
                return {status: err.response.status};
            }
        };

        // Internal function to get all the nfts
        const getAllNFTs = async (cursor = null) => {
            try {
                const nftResponse = await axios.request(getAPIConfig(`${userAddress}/nft/?chain=${chains[chainId]}&cursor=${cursor}`));
                if (nftResponse?.data?.result) {
                    nfts.push(nftResponse?.data?.result.map(nft => ({
                        "name": nft?.name,
                        "symbol": nft?.symbol || null,
                        "decimals": '0',
                        "address": nft?.token_address,
                        "balance": nft?.amount,
                        "assetType": nft?.contract_type,
                        "tokenId": nft?.token_id
                    })));
                }
                // Recursively calling to get all nfts
                let res;
                if (nftResponse?.data?.cursor) {
                    nftCursor = nftResponse.data.cursor;
                    res = await getAllNFTs(nftCursor);
                }
                nfts = nfts.flat();
                return { "status": res?.status === 401 ? 401 : 200}; 
            } catch (err) {
                console.log(apiKey);
                const keyIndex = apiKeys.indexOf(apiKey);
                if ((keyIndex+2) > apiKeys.length) return {status: err.response.status};
                if (err.response.status === 401) {
                    apiKey = apiKeys[keyIndex + 1];
                    const res = await getAllNFTs(nftCursor);
                    return { "status": res?.status === 401 ? 401 : 200}; 
                }
                return {status: err.response.status};
            }
        };

        if (assetType === 'fungible') {
            const erc20Config = getAPIConfig(
                `wallets/${userAddress}/tokens/?chain=${chains[chainId]}&exclude_native=true&cursor=${pageToken}`
            );
            try {
                const erc20Response = await axios.request(erc20Config).then(res => res.data);
                nextPage = erc20Response?.cursor;
                erc20Tokens = erc20Response?.result?.map(token => ({
                    "name": token?.name,
                    "symbol": token?.symbol || null,
                    "decimals": token?.decimals?.toString() || '0',
                    "address": token?.token_address,
                    "balance": token?.balance,
                    "assetType": 'ERC20',
                    "USDPrice": token?.usd_price?.toFixed(10) || 'NA'
                }));
                evmTokens = erc20Tokens.concat(validTokens);
            } catch (err) {
                if (err.response?.status === 401) return throwErrorMessage("tooManyRequests");
                return {
                    'message': err.response?.data?.message,
                    'code': errorMessage.error.code.invalidInput
                };
            };
        } else if (assetType === 'nonFungible') {
            try {
                const nftConfig = getAPIConfig(`${userAddress}/nft/?chain=${chains[chainId]}&cursor=${pageToken}`);
                const nftResponse = await axios.request(nftConfig).then(res => res.data);
                nextPage = nftResponse?.cursor;
                nfts = nftResponse?.result?.map(nft => ({
                    "name": nft?.name,
                    "symbol": nft?.symbol || null,
                    "decimals": '0',
                    "address": nft?.token_address,
                    "balance": nft?.amount,
                    "assetType": nft?.contract_type,
                    "tokenId": nft?.token_id
                }));
                evmTokens = nfts.concat(validTokens);
            } catch (err) {
                if (err.response?.status === 401) return throwErrorMessage("tooManyRequests");
                return {
                    'message': err.response?.data?.message,
                    'code': errorMessage.error.code.invalidInput
                };
            }
        } else {
            const erc20Status = await getAllERC20Tokens();
            const nftStatus = await getAllNFTs();
            if (erc20Status.status !== 200 || nftStatus.status !== 200) return throwErrorMessage("tooManyRequests");
            evmTokens = erc20Tokens.concat(nfts).concat(validTokens);
        }

        if (availableOnly === 'true') {
            evmTokens = evmTokens.filter(token => token.balance > 0);
        };

        return {
            "native": nativeBalance.balance,
            "evmTokens": evmTokens,
            ...(nextPage && {pageToken: nextPage})
        };
    },

    getUserPortfolioSolana: async (solanaWeb3, options) => {
        /*
         *  fetches portfolio of a User wallet on  Solana
         */

        const filterOptions = options;
        filterOptions.function = "getUserPortfolio()";
        const validJson = await schemaValidator.validateInput(filterOptions);


        if (!validJson.valid) {
            return (validJson);
        }

        const { address, chainId, availableOnly, assetType, pageToken } = filterOptions;
        let { tokens } = options;

        const data = JSON.stringify({
            jsonrpc: "2.0",
            id: "degens",
            method: "searchAssets",
            params: {
                ownerAddress: address,
                tokenType: assetType,
                // compressed: true,
                page: parseInt(pageToken) || 1,
                limit: config.heliusRPC.limit,
                displayOptions: {
                    showInscription: true,
                    showUnverifiedCollections: true,
                }
            }
        });

        const heliusConfig = {
            method: "post",
            url: config.heliusRPC.rpc[chainId],
            maxBodyLength: Infinity,
            headers: {
                "Content-Type": "application/json",
                "x-api-key": config.heliusRPC.apiKey
            },
            data
        };
        const portfolio = {};
        [portfolio.native, portfolio.spl] = await Promise.all([getBalanceSolana(solanaWeb3, address),
        axios.request(heliusConfig)]);

        if (portfolio.native.code === 400) {
            return portfolio.native;
        }
        if (portfolio.spl.data.error) {
            return portfolio.spl.data.error;
        }

        portfolio.native = portfolio.native.balance;
        portfolio.spl = portfolio.spl.data.result.items;
        const splBalances = await processSPL(portfolio.spl);

        const nextPage = {};
        nextPage.token = splBalances.length === 1000 ? parseInt(pageToken) + 1 || 2 : undefined;

        const tokenList = [];

        tokens = tokens && tokens.split(',');
        let extrasplBalances = [];
        if (tokens && parseInt(pageToken) === 1) {
            tokens = await tokens.slice(0, 10);
            for (const token of tokens) {
                const resp = getSolMetadata(solanaWeb3, { token, address });
                tokenList.push(resp);
            };
            tokens = await Promise.all(tokenList);
            for (const token of tokens) {
                extrasplBalances.push(getBalanceSolana(solanaWeb3, address, token));
            }
            extrasplBalances = await Promise.all(extrasplBalances);
            for (const element of extrasplBalances) {
                splBalances.push(element);
            }
        }


        const filteredSplBalances = availableOnly === 'true'
            ? splBalances.filter(token => token?.balance > 0 || token.balance === undefined)
            : splBalances;

        return {
            native: portfolio.native,
            splBalances: filteredSplBalances,
            pageToken: nextPage?.token,
        };
    },

    getUserPortfolioTerra: async () => throwErrorMessage("notApplicable"),
    getUserPortfolioAVAX: async () => throwErrorMessage("notApplicable"),
    getUserPortfolioTron: async () => throwErrorMessage("notApplicable"),

    getUserPortfolioNear: async (nearWeb3, options) => {
        /*
         * Function will fetch the token balances of the given wallet in near chains
         */

        const filterOptions = options;

        filterOptions.function = "getUserPortfolio()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const { chainId, address: userAddress, tokens, availableOnly } = filterOptions;
        const tokensByChainId = tokenConfig[chainId];

        if (!tokensByChainId) return throwErrorMessage("notApplicable");
        const isValidUser = await isValidNearUser(nearWeb3, userAddress);
        if (!isValidUser) return throwErrorMessage("invalidUserAddress");

        let validTokens = [];
        let extraTokens = tokens;

        if (extraTokens) {
            extraTokens = tokens.split(',');
            extraTokens = extraTokens.slice(0, 10);
            validTokens = await Promise.all(extraTokens && extraTokens.map(async (token) => {
                const address = token;
                const { name, symbol } = await getTokenDetailsNear(nearWeb3, { chainId, tokenAddress: address });
                if (name) {
                    return { name, symbol, address };
                } else {
                    return { name: 'NA', symbol: 'NA', address, "msg": errorMessage.error.message.invalidToken };
                }
            }));
        }

        const nativeBalance = await getBalanceNear(nearWeb3, { address: userAddress });
        const nep141Balances = await Promise.all(
            tokensByChainId.concat(validTokens).map(async ({ address, name, symbol, msg }) => {
                let balance = 'NA';
                let USDPrice = 'NA';

                if (!msg) {
                    try {
                        balance = await getBalanceNear(nearWeb3, { address: userAddress, tokenAddress: address });
                    } catch (err) {
                        // console.log(err);
                    }
                    USDPrice = symbol ? await getUSDQuote(symbol) : 'NA';
                }
                return { name, symbol, address, 'balance': balance ? balance.balance : 'NA', USDPrice, msg };
            })
        );
        return {
            "native": nativeBalance.balance,
            "nep141": availableOnly === 'true' ? nep141Balances.filter(token => token.balance > 0) : nep141Balances
        };
    },

    getUserPortfolioAlgorand: async () => throwErrorMessage("notApplicable"),
    getUserPortfolioSui: async () => throwErrorMessage("notApplicable"),
    getUserPortfolioAptos: async () => throwErrorMessage("notApplicable"),
    getUserPortfolioStarkNet: async () => throwErrorMessage("notApplicable"),

    getUserPortfolioTon: async (tonClient, options) => {
        /*
        * Function will fetch the token balances of the given wallet in ethereum based chains
        */

        const filterOptions = options;

        filterOptions.function = "getUserPortfolio()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const { chainId, address: userAddress, availableOnly } = filterOptions;
        let { tokens } = filterOptions;
        if (!isValidAddressTonAddress(userAddress)) return throwErrorMessage("invalidUserAddress");

        const tokensByChainId = tokenConfig[chainId];
        if (!tokensByChainId) return throwErrorMessage("notApplicable");

        tokens = tokens && tokens.split(',').slice(0, 10);
        let assets = [];

        const stonfiConfig = {
            method: 'get',
            maxBodyLength: Infinity,
            url: config.stonfi.baseUrl,
            headers: {
                'accept': 'application/json'
            }
        };

        try {
            const res = await axios.request(stonfiConfig);
            assets = res.data.asset_list;
        } catch (err) {
            assets = [];
        }


        const filteredJettons = tokens ? tokens.map(jetton => {
            const filteredJetton = assets && assets.find(stonfiAsset => stonfiAsset.contract_address === jetton) || {};
            const { display_name: name = 'NA', symbol = 'NA' } = filteredJetton;
            return { name, symbol, address: jetton, ...(!name && !symbol && {msg: errorMessage.error.message.invalidJetton}) };
        }) : [];

        const nativeBalance = await getBalanceTon(tonClient, { address: userAddress });

        const jettonBalances = await Promise.all(
            tokensByChainId.concat(filteredJettons).filter(({address}) => address).map(async ({ address, name, symbol, msg }) => {
                const { balance } = await getBalanceTon(tonClient, { address: userAddress, tokenAddress: address });
                return { name, symbol, address, balance, msg };
            })
        );

        const jettons = jettonBalances.map(jetton => {
            const filteredJetton = assets.find(stonfiAsset => stonfiAsset.contract_address === jetton.address);
            return {
                ...jetton,
                USDPrice: filteredJetton && filteredJetton.dex_price_usd || 'NA'
            };
        });

        return {
            "native": nativeBalance.balance,
            "jettons": availableOnly === 'true' ? jettons.filter(token => token.balance > 0) : jettons
        };
    },

    getUserPortfolioStellar: async (stllrWeb3, options) => {
        /*
        * Function will fetch the token balances of the given wallet in ethereum based chains
        */

        // assetType filter to be added
        const filterOptions = options;

        filterOptions.function = "getUserPortfolio()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const { chainId, address, availableOnly } = filterOptions;
        const { decimals } = config.chains[chainId];

        try {
            const account = await stllrWeb3.loadAccount(address);
            // Getting all the assets user is holding
            const balances = account.balances.map(({ asset_type: assetType, balance, asset_code: assetCode, asset_issuer: issuer }) => ({
                assetType, balance: (Number(balance) * decimals).toString(), assetCode, issuer
            }));
            const nativeBalance = balances?.filter(({ assetType }) => assetType === 'native');
            const assets = balances.filter(({assetType}) => assetType !== 'native');

            return {
                native: nativeBalance[0]?.balance || "0",
                assets: availableOnly === 'true' ? assets.filter(token => token.balance > 0) : assets
            };
            
          } catch (e) {
            return throwErrorMessage("invalidUserAddress");
          }
    }
};
