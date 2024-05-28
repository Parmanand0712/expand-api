/* eslint-disable guard-for-in */
/* eslint-disable no-await-in-loop */
/* 
 * All the function in this file
 * should be returning the following schema
 * 
 * 
    {
        "tokenName1": "123123231",
        "tokenName2": "23123231",
    }  
 */

const { PublicKey } = require("@solana/web3.js");
const { AnchorProvider, web3: web } = require("@project-serum/anchor");
const { WhirlpoolContext, buildWhirlpoolClient } = require("@orca-so/whirlpools-sdk");
const { getSymbolSolana } = require("../fungibleTokens/getSymbol");
const schemaValidator = require('../../../common/configuration/schemaValidator');
const config = require('../../../common/configuration/config.json');
const uniswapV2PoolAbi = require('../../../assets/abis/uniswapV2PoolAbi.json');
const sushiswapv2PoolAbi = require('../../../assets/abis/sushiswapV2PoolAbi.json');
const pancakeswapV2PoolAbi = require('../../../assets/abis/pancakeswapPoolAbi.json');
const balancerV2VaultAbis = require('../../../assets/abis/balancerV2Vault.json');
const balancerV2PoolAbis = require('../../../assets/abis/balancerV2Pools.json');
const uniswapV3Pool = require('../../../assets/abis/uniswapV3Pool.json');
const traderJoePool = require('../../../assets/abis/traderJoePoolAbi.json');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const { getSymbolEvm } = require('../fungibleTokens/getSymbol');
const { getBalanceEvm } = require('../chain/getBalance');
const { getABIFile } = require('../../../common/curveCommon');
const { isValidAddressTonAddress } = require('../../../common/contractCommon');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});

const invalidPoolAddress = {
    'message': errorMessage.error.message.poolNotFound,
    'code': errorMessage.error.code.invalidInput
};


module.exports = {

    getTokenLiquidityUniswapV2: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "getTokenLiquidityUniswapV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        filterOptions.factoryAddress = config.dex[filterOptions.dexId].factoryAddress;

        try {
            let totalTokenA = '';
            let totalTokenB = '';
            const response = {};

            const pairContract = new web3.eth.Contract(
                uniswapV2PoolAbi,
                filterOptions.poolAddress
            );

            const token0 = await pairContract.methods.token0(
            ).call();

            const token1 = await pairContract.methods.token1(
            ).call();

            const token1Name = await getSymbolEvm(web3, { tokenAddress: token0 });

            const token2Name = await getSymbolEvm(web3, { tokenAddress: token1 });


            const getReserves = await pairContract.methods.getReserves(
            ).call();

            totalTokenA = (getReserves[0]).toString();

            totalTokenB = (getReserves[1]).toString();

            response[token1Name.symbol] = totalTokenA;
            response[token2Name.symbol] = totalTokenB;

            return (response);
        }
        catch (error) {
            return invalidPoolAddress;
        }

    },

    getTokenLiquiditySushiswapV2: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "getTokenLiquidityUniswapV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        filterOptions.factoryAddress = config.dex[filterOptions.dexId].factoryAddress;

        let totalTokenA = '';
        let totalTokenB = '';
        const response = {};

        try {
            const pairContract = new web3.eth.Contract(
                sushiswapv2PoolAbi,
                filterOptions.poolAddress
            );

            const token0 = await pairContract.methods.token0(
            ).call();

            const token1 = await pairContract.methods.token1(
            ).call();

            const token1Name = await getSymbolEvm(web3, { tokenAddress: token0 });

            const token2Name = await getSymbolEvm(web3, { tokenAddress: token1 });

            const getReserves = await pairContract.methods.getReserves(
            ).call();

            totalTokenA = (getReserves[0]).toString();

            totalTokenB = (getReserves[1]).toString();

            response[token1Name.symbol] = totalTokenA;
            response[token2Name.symbol] = totalTokenB;

            return (response);
        }
        catch (error) {
            return invalidPoolAddress;
        }

    },

    getTokenLiquidityPancakeV2: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "getTokenLiquidityUniswapV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        filterOptions.factoryAddress = config.dex[filterOptions.dexId].factoryAddress;

        let totalTokenA = '';
        let totalTokenB = '';
        const response = {};

        try {
            const pairContract = new web3.eth.Contract(
                pancakeswapV2PoolAbi,
                filterOptions.poolAddress
            );

            const token0 = await pairContract.methods.token0(
            ).call();

            const token1 = await pairContract.methods.token1(
            ).call();

            const token1Name = await getSymbolEvm(web3, { tokenAddress: token0 });

            const token2Name = await getSymbolEvm(web3, { tokenAddress: token1 });

            const getReserves = await pairContract.methods.getReserves(
            ).call();

            totalTokenA = (getReserves[0]).toString();

            totalTokenB = (getReserves[1]).toString();

            response[token1Name.symbol] = totalTokenA;
            response[token2Name.symbol] = totalTokenB;

            return (response);
        }
        catch (error) {
            return invalidPoolAddress;
        }

    },

    getTokenLiquidityUniswapV3: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "getTokenLiquidityUniswapV3()";
        const validJson = await schemaValidator.validateInput(filterOptions);
        let response = {};

        if (!validJson.valid) {
            return (validJson);
        }

        try {
            const poolLiquidityContract = new web3.eth.Contract(uniswapV3Pool, filterOptions.poolAddress);

            // Use Promise.all to perform asynchronous calls in parallel
            const [token0, token1] = await Promise.all([
                poolLiquidityContract.methods.token0().call(),
                poolLiquidityContract.methods.token1().call()
            ]);

            const [token1Name, token2Name] = await Promise.all([
                getSymbolEvm(web3, { tokenAddress: token0 }),
                getSymbolEvm(web3, { tokenAddress: token1 })
            ]);

            const [totalTokenA, totalTokenB] = await Promise.all([
                getBalanceEvm(web3, {address:filterOptions.poolAddress, tokenAddress:token0}),
                getBalanceEvm(web3, {address:filterOptions.poolAddress, tokenAddress:token1})
            ]);

            response = {
                [token1Name.symbol]: totalTokenA.balance,
                [token2Name.symbol]: totalTokenB.balance
            };

            return response;
        }
        catch (error) {
            return invalidPoolAddress;
        }


    },

    getTokenLiquidityBalancerV2: async (web3, options) => {
        const filterOptions = options;

        filterOptions.function = "getTokenLiquidityUniswapV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        filterOptions.vaultAddress = config.dex[filterOptions.dexId].vaultAddress;

        const response = {};

        try {
            const balancerV2Vault = new web3.eth.Contract(balancerV2VaultAbis, filterOptions.vaultAddress);

            const poolContract = new web3.eth.Contract(
                balancerV2PoolAbis,
                filterOptions.poolAddress
            );

            const poolId = await poolContract.methods.getPoolId().call();

            const getPoolTokens = await balancerV2Vault.methods.getPoolTokens(
                poolId
            ).call();

            for (let index = 0; index < getPoolTokens[0].length; index += 1) {
                const address = getPoolTokens[0][index];
                const tokenName = await getSymbolEvm(web3, { tokenAddress: address });
                const totalToken = getPoolTokens[1][index].toString();
                response[tokenName.symbol] = totalToken;
            }

            return (response);
        }
        catch (error) {
            return invalidPoolAddress;
        }

    },

    getTokenLiquidityCurveV2: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "getTokenLiquidityUniswapV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        let tokenName = {};
        const response = {};
        const { poolAddress, dexId } = filterOptions;
        const { curvePools } = config.dex[dexId];

        const pool = curvePools.filter((cPool) => cPool.poolAddress === poolAddress.toLowerCase());
        if (pool.length === 0) return {
            'message': errorMessage.error.message.unSupportedPool,
            'code': errorMessage.error.code.invalidInput
        };

        const { poolName, tokenAddresses } = pool[0];

        try {
            const poolABI = await getABIFile(poolName);
            const poolContract = new web3.eth.Contract(poolABI, poolAddress);
            const promises = tokenAddresses.map((_, i) => poolContract.methods.balances(i).call());
            const tokenLiquidity = await Promise.all(promises);

            for (let i = 0; i < tokenAddresses.length; i += 1) {
                const address = tokenAddresses[i];
                if (address.toLowerCase().includes('0xeeeeeeeeeeee')) {
                    tokenName = 'ETH';
                }
                else {
                    tokenName = await getSymbolEvm(web3, { tokenAddress: address }).then(res => (res.symbol));
                };

                const totalToken = tokenLiquidity[i];
                response[tokenName] = totalToken;
            }
            return (response);
        }
        catch (error) {
            return {
                'message': errorMessage.error.message.unSupportedPool,
                'code': errorMessage.error.code.invalidInput
            };
        }
    },

    getTokenLiquidityTraderJoe: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "getTokenLiquidityTraderJoe()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        try {
            let totalTokenA = '';
            let totalTokenB = '';
            const response = {};

            const pairContract = new web3.eth.Contract(
                traderJoePool,
                filterOptions.poolAddress
            );

            const token0 = await pairContract.methods.getTokenX(
            ).call();

            const token1 = await pairContract.methods.getTokenY(
            ).call();

            const token1Name = await getSymbolEvm(web3, { tokenAddress: token0 });

            const token2Name = await getSymbolEvm(web3, { tokenAddress: token1 });

            const getReserves = await pairContract.methods.getReserves(
            ).call();

            totalTokenA = (getReserves[0]).toString();

            totalTokenB = (getReserves[1]).toString();

            response[token1Name.symbol] = totalTokenA;
            response[token2Name.symbol] = totalTokenB;

            return (response);
        }
        catch (error) {
            return invalidPoolAddress;
        }

    },
    getTokenLiquidityStonFi: async (web3, options) => {
        const filterOptions = options;
        filterOptions.function = "getTokenLiquidityStonFi()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        try {
            const { poolAddress } = filterOptions;
            if (!isValidAddressTonAddress(poolAddress)) return invalidPoolAddress;
            let totalTokenA = '';
            let totalTokenB = '';
            const response = {};

            const data = await web3.runMethod((poolAddress).toString(), 'get_pool_data');

            totalTokenA = BigInt(data.stack.items[0].value).toString();

            totalTokenB = BigInt(data.stack.items[1].value).toString();

            response.tokenA = totalTokenA;
            response.tokenB = totalTokenB;

            return (response);
        }
        catch (error) {
            return invalidPoolAddress;
        }

    },

    getTokenLiquiditySDEX: async (stllrWeb3, options) => {
        /*
         * Function will returns the individual token liquidity within the specified SDEX liquidity pool
        */
        const filterOptions = options;
        filterOptions.function = "getTokenLiquidityUniswapV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const { chainId, poolAddress } = filterOptions;
        const { decimals } = config.chains[chainId];

        try {
            const { reserves } = await stllrWeb3
                .liquidityPools()
                .liquidityPoolId(poolAddress)
                .call();

            const formattedValue = reserves.reduce((acc, { asset, amount }) => {
                acc[asset] = (amount * decimals).toString();
                return acc;
            }, {});

            return formattedValue;
        }
        catch (error) {
            return invalidPoolAddress;
        }
    },
 
    getTokenLiquidityOrca: async (solWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "poolOrca()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return validJson;
        }

        const { dexId } = filterOptions;
        let { poolAddress } = filterOptions;

        try {
            poolAddress = new PublicKey(poolAddress);
        } catch (error) {
            return throwErrorMessage("invalidPublicKey");
        }

        // Create Anchor provider
        const provider = new AnchorProvider(solWeb3, {}, {});

        // Initialize the Program
        const programId = new web.PublicKey(
            config.dex[dexId].programId
        );

        try {

            // Create the WhirpoolContext
            const context = WhirlpoolContext.withProvider(provider, programId);
            const client = buildWhirlpoolClient(context);

            const position = await client.getPool(poolAddress);

            const [tokenBalanceA, tokenBalanceB] = await Promise.all([solWeb3.getTokenAccountBalance(
                new PublicKey(position.data.tokenVaultA)), solWeb3.getTokenAccountBalance(
                    new PublicKey(position.data.tokenVaultB))]);

            const [tokenSymbolA, tokenSymbolB] = await Promise.all([
                getSymbolSolana(solWeb3,
                    {
                        token: position.tokenAInfo.mint.toBase58()
                    }),
                getSymbolSolana(solWeb3,
                    {
                        token: position.tokenBInfo.mint.toBase58()
                    })
            ]);

            const response = {};

            response[tokenSymbolA] = tokenBalanceA.value.amount.toString();
            response[tokenSymbolB] = tokenBalanceB.value.amount.toString();

            // Return the response
            return response;
        } catch (error) {
            return throwErrorMessage("poolNotFound");
        }
    }

};
