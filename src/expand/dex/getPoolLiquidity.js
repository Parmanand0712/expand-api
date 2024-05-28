/* 
 * All the function in this file
 * should be returning the following schema
 * 
 * 
    {
        "totaLiquidity": "123123231"
    }  
 */

const { PublicKey } = require("@solana/web3.js");
const { AnchorProvider, web3: web } = require("@project-serum/anchor");
const { WhirlpoolContext, buildWhirlpoolClient } = require("@orca-so/whirlpools-sdk");
const { Address } = require('@ton/ton');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const config = require('../../../common/configuration/config.json');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const uniswapV2PoolAbi = require('../../../assets/abis/uniswapV2PoolAbi.json');
const balancerV2PoolAbis = require('../../../assets/abis/balancerV2Pools.json');
const sushiswapV2PoolAbi = require('../../../assets/abis/sushiswapV2PoolAbi.json');
const pancakeswapV2PoolAbi = require('../../../assets/abis/pancakeswapPoolAbi.json');
const uniswapV3Pool = require('../../../assets/abis/uniswapV3Pool.json');
const erc20ABI = require('../../../assets/abis/iERC20.json');
const traderJoePool = require('../../../assets/abis/traderJoePoolAbi.json');
const { getABIFile } = require('../../../common/curveCommon');


const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});

const invalidPoolAddress = {
    'message': errorMessage.error.message.poolNotFound,
    'code': errorMessage.error.code.invalidInput
};


module.exports = {

    getPoolLiquidityUniswapV2: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "getPoolLiquidityUniswapV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        try {
            const pairContract = new web3.eth.Contract(
                uniswapV2PoolAbi,
                filterOptions.poolAddress
            );

            const totalSupply = await pairContract.methods.totalSupply(
            ).call();

            return ({ "totalLiquidity": totalSupply });
        }
        catch (error) {
            return invalidPoolAddress;
        }

    },

    getPoolLiquiditySushiswapV2: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "getPoolLiquidityUniswapV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        try {
            const pairContract = new web3.eth.Contract(
                sushiswapV2PoolAbi,
                filterOptions.poolAddress
            );

            const totalSupply = await pairContract.methods.totalSupply(
            ).call();

            return ({ "totalLiquidity": totalSupply });
        }
        catch (error) {
            return invalidPoolAddress;
        }

    },

    getPoolLiquidityPancakeV2: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "getPoolLiquidityUniswapV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        try {
            const pairContract = new web3.eth.Contract(
                pancakeswapV2PoolAbi,
                filterOptions.poolAddress
            );

            const totalSupply = await pairContract.methods.totalSupply(
            ).call();

            return ({ "totalLiquidity": totalSupply });
        }
        catch (error) {
            return invalidPoolAddress;
        }

    },

    getPoolLiquidityUniswapV3: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "getPoolLiquidityUniswapV3()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        try {
            const poolLiquidityContract = new web3.eth.Contract(uniswapV3Pool, filterOptions.poolAddress);

            const totalSupply = await poolLiquidityContract.methods.liquidity().call();

            return ({ "totalLiquidity": totalSupply });
        }
        catch (error) {
            return invalidPoolAddress;
        }

    },

    getPoolLiquidityBalancerV2: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "getPoolLiquidityUniswapV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        try {
            const poolContract = new web3.eth.Contract(
                balancerV2PoolAbis,
                filterOptions.poolAddress
            );

            const totalSupply = await poolContract.methods.totalSupply(
            ).call();

            return ({ "totalLiquidity": totalSupply });
        }
        catch (error) {
            return invalidPoolAddress;
        }

    },

    getPoolLiquidityCurveV2: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "getPoolLiquidityUniswapV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const { dexId, poolAddress } = filterOptions;
        const { curvePools } = config.dex[dexId];

        const pool = curvePools.filter((cPool) => cPool.poolAddress === poolAddress.toLowerCase());
        if (pool.length === 0) return {
            'message': errorMessage.error.message.unSupportedPool,
            'code': errorMessage.error.code.invalidInput
        };;

        const { poolName, tokenAddress, factory } = pool[0];

        try {
            const poolABI = await getABIFile(poolName);
            const lpContract = new web3.eth.Contract(
                factory ? poolABI : erc20ABI,
                tokenAddress
            );

            const totalSupply = await lpContract.methods.totalSupply(
            ).call();

            return ({ "totalLiquidity": totalSupply });
        }
        catch (error) {
            return invalidPoolAddress;
        }

    },

    getPoolLiquidityTraderJoe: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "getPoolLiquidityTraderJoe()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        try {
            const pairContract = new web3.eth.Contract(
                traderJoePool,
                filterOptions.poolAddress
            );

            const totalSupply = await pairContract.methods.totalSupply(
                filterOptions.id
            ).call();

            return ({ "totalLiquidity": totalSupply });
        }
        catch (error) {
            return invalidPoolAddress;
        }

    },
    getPoolLiquidityStonFi: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "getPoolLiquidityStonFi()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        try {

            const totalSupply = await web3.runMethod(
                Address.parse(filterOptions.poolAddress),
                'get_jetton_data'
            );

            return ({ "totalLiquidity": BigInt(totalSupply.stack.readNumber()).toString() });
        }
        catch (error) {
            return invalidPoolAddress;
        }

    },

    getPoolLiquidityOrca: async (solWeb3, options) => {

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

            const response = {
                totalLiquidity: position.data.liquidity.toString(),
            };

            // Return the response
            return response;
        } catch(error){
            return throwErrorMessage("poolNotFound");
        }
    },

    getPoolLiquiditySDEX: async (stllrWeb3, options) => {
        /*
         * Function will return returns the total liquidity for a specified SDEX pool
        */
        const filterOptions = options;
        filterOptions.function = "getPoolLiquidityUniswapV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const { chainId, poolAddress } = filterOptions;
        const {decimals} = config.chains[chainId];

        try {
            const poolInfo = await stllrWeb3
                .liquidityPools()
                .liquidityPoolId(poolAddress)
                .call();

            return { "totalLiquidity": (poolInfo.total_shares * decimals).toFixed(0) };
        }
        catch (error) {
            return invalidPoolAddress;
        }
    }
};