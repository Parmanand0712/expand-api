const { default: axios } = require('axios');
const config = require('../../../common/configuration/config.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const uniswapV3Pool = require('../../../assets/abis/uniswapV3Pool.json');
const {isValidAddressTonAddress} = require('../../../common/contractCommon');

const invalidPoolAddress = {
    'message': errorMessage.error.message.poolNotFound,
    'code': errorMessage.error.code.invalidInput
};

const notApplicable = {
    'message': errorMessage.error.message.notApplicable,
    'code': errorMessage.error.code.notApplicable
};

module.exports = {

    getTokenHolderUniswapV2: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "getTokenHolderUniswapV2()";

        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }


        try {
            const key = config.tokenHolder.covalentKey;
            const url = `${config.tokenHolder.tokenHolderEthereumUrl}/${filterOptions.poolAddress}/${config.tokenHolder.methodName}/?key=${key}`;
            const tokenHolderData = await axios.get(url).then(res => res.data.data.pagination.total_count);
            return ({ "totalTokenHolders": tokenHolderData.toString() });
        } catch (error) {
            return invalidPoolAddress;
        }


    },

    getTokenHolderSushiswapV2: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "getTokenHolderUniswapV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        try {

            const key = config.tokenHolder.covalentKey;
            const url = `${config.tokenHolder.tokenHolderEthereumUrl}/${filterOptions.poolAddress}/${config.tokenHolder.methodName}/?key=${key}`;
            const tokenHolderData = await axios.get(url).then(res => res.data.data.pagination.total_count);
            return ({ "totalTokenHolders": tokenHolderData.toString() });

        } catch (error) {
            return invalidPoolAddress;
        }


    },

    getTokenHolderPancakeV2: async (web3, options) => {


        const filterOptions = options;
        filterOptions.function = "getTokenHolderUniswapV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        try {
            const key = config.tokenHolder.covalentKey;
            const url = `${config.tokenHolder.tokenHolderBinanceUrl}/${filterOptions.poolAddress}/${config.tokenHolder.methodName}/?key=${key}`;
            const tokenHolderData = await axios.get(url).then(res => res.data.data.pagination.total_count);
            return ({ "totalTokenHolders": tokenHolderData.toString() });
        } catch (error) {
            return invalidPoolAddress;
        }
    },

    getTokenHolderUniswapV3: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "getTokenHolderUniswapV3()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }
        let count = 0;
        const step = filterOptions.dexId !== "1306" ? 2000000 : 49999;

        try {
            const poolLiquidityContract = new web3.eth.Contract(uniswapV3Pool, filterOptions.poolAddress);
            const latestBlock = await web3.eth.getBlockNumber();
            let firstEvent = null;
            let fromBlock = 0;

            if (filterOptions.dexId !== '1306') {
                while (fromBlock <= latestBlock && !firstEvent) {
                    const midBlock = Math.floor((fromBlock + latestBlock) / 2);
                    // eslint-disable-next-line no-await-in-loop
                    const events = await poolLiquidityContract.getPastEvents('Mint', {
                        fromBlock,
                        toBlock: midBlock
                    });

                    if (events.length > 0) {
                        // eslint-disable-next-line prefer-destructuring
                        firstEvent = events[0];
                        break;
                    } else {
                        fromBlock = midBlock + 1;
                    }
                }

            }

            else {
                const configuration = {};
                configuration.params = {
                    module: config.etherscan.moduleGeneric,
                    action: config.etherscan.actionContract,
                    contractaddresses: filterOptions.poolAddress,
                    apiKey: config.etherscan.keys[config.dex[filterOptions.dexId].chainId]
                };


                const data = await axios.get(config.etherscan.baseUrl[config.dex[filterOptions.dexId].chainId], configuration)
                    .then(res => (res.data.result[0].txHash));

                firstEvent = await web3.eth.getTransaction(data);
            }


            for (let startBlock = firstEvent.blockNumber; startBlock <= latestBlock; startBlock += step) {
                  const endBlock = Math.min(startBlock + step - 1, latestBlock);
                  // eslint-disable-next-line no-await-in-loop
                  const events = await poolLiquidityContract.getPastEvents('Mint', {
                        fromBlock: startBlock,
                        toBlock: endBlock
                  });

                  count += events.length;
            }

            return { totalTokenHolders: count.toString() };
        } catch (error) {
            console.log(error);
            return invalidPoolAddress;
        }


    },

    getTokenHolderBalancerV2: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "getTokenHolderUniswapV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        try {
            const key = config.tokenHolder.covalentKey;
            const url = `${config.tokenHolder.tokenHolderEthereumUrl}/${filterOptions.poolAddress}/${config.tokenHolder.methodName}/?key=${key}`;
            const tokenHolderData = await axios.get(url).then(res => res.data.data.pagination.total_count);
            return ({ "totalTokenHolders": tokenHolderData.toString() });
        }
        catch (error) {
            return invalidPoolAddress;
        }
    },

    getTokenHolderCurveV2: async (web3, options) => {


        const filterOptions = options;
        filterOptions.function = "getTokenHolderUniswapV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        try {
            const key = config.tokenHolder.covalentKey;
            const url = `${config.tokenHolder.tokenHolderEthereumUrl}/${filterOptions.poolAddress}/${config.tokenHolder.methodName}/?key=${key}`;
            const tokenHolderData = await axios.get(url).then(res => res.data.data.pagination.total_count);
            return ({ "totalTokenHolders": tokenHolderData.toString() });
        }
        catch (error) {
            return invalidPoolAddress;
        }
    },
    // eslint-disable-next-line no-unused-vars
    getTokenHolderTraderJoe: async (web3, options) => notApplicable
    ,

    getTokenHolderStonFi: async (web3, options) => {


        const filterOptions = options;
        filterOptions.function = "getTokenHolderStonFi()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const { poolAddress } = filterOptions;
        if (!isValidAddressTonAddress(poolAddress)) return invalidPoolAddress;
        const url = `${config.dex[filterOptions.dexId].tokenHoldersRpc}${poolAddress}\\holders`;
        const count = await axios.get(url).then(res => res.data.addresses.length);

        if (count === 0) return invalidPoolAddress;
        return ({ "totalTokenHolders": (count).toString() });

    },

    getTokenHolderSDEX: async (stllrWeb3, options) => {
        /*
         * Function will returns the total number of liquidity holders in the specified SDEX pool
         */
        const filterOptions = options;
        filterOptions.function = "getTokenHolderUniswapV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const { poolAddress } = filterOptions;

        try {
            const poolInfo = await stllrWeb3
                .liquidityPools()
                .liquidityPoolId(poolAddress)
                .call();

            return { "totalTokenHolders": poolInfo.total_trustlines };;
        } catch (error) {
            return invalidPoolAddress;
        }
    },
    getTokenHolderOrca: async () => notApplicable
};
