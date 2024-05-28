/* 
 * All the function in this file
 * should be returning the following schema
 * 
 * 
    {
        "liquidity": "123123231"
    }  
 */

const { beginCell, Address, JettonMaster } = require('@ton/ton');
const { LiquidityPoolFeeV18, LiquidityPoolAsset } = require('stellar-sdk');
const { PublicKey } = require("@solana/web3.js");
const { AnchorProvider, web3: web } = require("@project-serum/anchor");
const { WhirlpoolContext, buildWhirlpoolClient, PriceMath, PoolUtil } = require("@orca-so/whirlpools-sdk");

const { isValidAddressTonAddress, isValidContractAddress, isValidStellarAccount } = require('../../../common/contractCommon');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const config = require('../../../common/configuration/config.json');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const uniswapV2FactoryAbi = require('../../../assets/abis/uniswapV2FactoryAbi.json');
const uniswapV2PoolAbi = require('../../../assets/abis/uniswapV2PoolAbi.json');
const sushiswapV2FactoryAbi = require('../../../assets/abis/sushiswapV2FactoryAbi.json');
const sushiswapv2PoolAbi = require('../../../assets/abis/sushiswapV2PoolAbi.json');
const pancakeswapV2FactoryAbi = require('../../../assets/abis/pancakeswapFactoryAbi.json');
const pancakeswapV2PoolAbi = require('../../../assets/abis/pancakeswapPoolAbi.json');
const uniswapV3NFTAbi = require('../../../assets/abis/uniswapV3NFTAbi.json');
const balancerV2VaultAbis = require('../../../assets/abis/balancerV2Vault.json');
const balancerV2PoolAbis = require('../../../assets/abis/balancerV2Pools.json');
const traderJoeFactory = require('../../../assets/abis/LBFactory.json');
const traderJoePool = require('../../../assets/abis/traderJoePoolAbi.json');
const erc20ABI = require('../../../assets/abis/iERC20.json');
const { getABIFile } = require('../../../common/curveCommon');
const { getPoolId, getStellarAssets } = require('../../../common/stellarCommon');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});

const invalidAddress = {
    'message': errorMessage.error.message.invalidAddress,
    'code': errorMessage.error.code.invalidInput
};

module.exports = {

    getLiquidityUniswapV2: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "getLiquidityUniswapV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        filterOptions.factoryAddress = config.dex[filterOptions.dexId].factoryAddress;

        let totalTokenA = '';
        let totalTokenB = '';

        const factory = new web3.eth.Contract(
            uniswapV2FactoryAbi,
            filterOptions.factoryAddress
        );

        const getPair = await factory.methods.getPair(
            filterOptions.tokenA,
            filterOptions.tokenB
        ).call();

        if (getPair.startsWith("0x000")) return throwErrorMessage("poolDoesNotExist");

        const pairContract = new web3.eth.Contract(
            uniswapV2PoolAbi,
            getPair
        );

        const liquidity = await pairContract.methods.balanceOf(
            filterOptions.address
        ).call();

        const token0 = await pairContract.methods.token0(
        ).call();

        const token1 = await pairContract.methods.token1(
        ).call();

        const totalSupply = await pairContract.methods.totalSupply(
        ).call();

        const getReserves = await pairContract.methods.getReserves(
        ).call();

        const poolAcquired = (liquidity / totalSupply);

        if (filterOptions.tokenA === token0 && filterOptions.tokenB === token1) {

            totalTokenA = (poolAcquired * getReserves[0]).toString();

            totalTokenB = (poolAcquired * getReserves[1]).toString();
        }
        else {

            totalTokenA = (poolAcquired * getReserves[1]).toString();

            totalTokenB = (poolAcquired * getReserves[0]).toString();
        }

        return ({ "pairAddress": getPair, "liquidity": liquidity, "tokenA": totalTokenA, "tokenB": totalTokenB });

    },

    getLiquiditySushiswapV2: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "getLiquiditySushiswapV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        filterOptions.factoryAddress = config.dex[filterOptions.dexId].factoryAddress;

        let totalTokenA = '';
        let totalTokenB = '';

        const factory = new web3.eth.Contract(
            sushiswapV2FactoryAbi,
            filterOptions.factoryAddress
        );

        const getPair = await factory.methods.getPair(
            filterOptions.tokenA,
            filterOptions.tokenB
        ).call();

        if (getPair.startsWith("0x000")) return throwErrorMessage("poolDoesNotExist");

        const pairContract = new web3.eth.Contract(
            sushiswapv2PoolAbi,
            getPair
        );

        const liquidity = await pairContract.methods.balanceOf(
            filterOptions.address
        ).call();

        const token0 = await pairContract.methods.token0(
        ).call();

        const token1 = await pairContract.methods.token1(
        ).call();

        const totalSupply = await pairContract.methods.totalSupply(
        ).call();

        const getReserves = await pairContract.methods.getReserves(
        ).call();

        const poolAcquired = (liquidity / totalSupply);

        if (filterOptions.tokenA === token0 && filterOptions.tokenB === token1) {

            totalTokenA = (poolAcquired * getReserves[0]).toString();

            totalTokenB = (poolAcquired * getReserves[1]).toString();
        }
        else {

            totalTokenA = (poolAcquired * getReserves[1]).toString();

            totalTokenB = (poolAcquired * getReserves[0]).toString();
        }

        return ({ "pairAddress": getPair, "liquidity": liquidity, "tokenA": totalTokenA, "tokenB": totalTokenB });

    },

    getLiquidityPancakeV2: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "getLiquidityPancakeswapV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        filterOptions.factoryAddress = config.dex[filterOptions.dexId].factoryAddress;

        let totalTokenA = '';
        let totalTokenB = '';

        const factory = new web3.eth.Contract(
            pancakeswapV2FactoryAbi,
            filterOptions.factoryAddress
        );

        const getPair = await factory.methods.getPair(
            filterOptions.tokenA,
            filterOptions.tokenB
        ).call();

        if (getPair.startsWith("0x000")) return throwErrorMessage("poolDoesNotExist");

        const pairContract = new web3.eth.Contract(
            pancakeswapV2PoolAbi,
            getPair
        );

        const liquidity = await pairContract.methods.balanceOf(
            filterOptions.address
        ).call();

        const token0 = await pairContract.methods.token0(
        ).call();

        const token1 = await pairContract.methods.token1(
        ).call();

        const totalSupply = await pairContract.methods.totalSupply(
        ).call();

        const getReserves = await pairContract.methods.getReserves(
        ).call();

        const poolAcquired = (liquidity / totalSupply);

        if (filterOptions.tokenA === token0 && filterOptions.tokenB === token1) {

            totalTokenA = (poolAcquired * getReserves[0]).toString();

            totalTokenB = (poolAcquired * getReserves[1]).toString();
        }

        else {

            totalTokenA = (poolAcquired * getReserves[1]).toString();

            totalTokenB = (poolAcquired * getReserves[0]).toString();
        }

        return ({ "pairAddress": getPair, "liquidity": liquidity, "tokenA": totalTokenA, "tokenB": totalTokenB });

    },

    getLiquidityUniswapV3: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "getLiquidityUniswapV3()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        filterOptions.positionManager = config.dex[filterOptions.dexId].positionManager;

        const tokenIdContract = new web3.eth.Contract(
            uniswapV3NFTAbi,
            filterOptions.positionManager
        );

        const liquidity = await tokenIdContract.methods.positions(
            filterOptions.tokenId
        ).call();

        return ({ "liquidity": liquidity.liquidity, "tokenV3": liquidity.token0 });

    },

    getLiquidityBalancerV2: async (web3, options) => {
        
        const filterOptions = options;

        filterOptions.function = "getLiquidityBalancerV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const isValidAddress = await isValidContractAddress(web3, filterOptions.address);

        if (!isValidAddress) return throwErrorMessage("invalidAddress");

        const { address, tokenA, tokenB, tokenC, tokenD, dexId } = filterOptions;

        const { vaultAddress } = config.dex[dexId];


        const path = [tokenA, tokenB, tokenC, tokenD].filter(val => val).map((val => val.toLowerCase()));


        const balancerV2Vault = new web3.eth.Contract(balancerV2VaultAbis, vaultAddress);

        let poolId = '';
        const pools = config.dex[filterOptions.dexId].balPools;


        for (let i = 0; i < pools.length; i += 1) {
            if (JSON.stringify(path.sort()).toLowerCase() === JSON.stringify(pools[i].tokens.sort()).toLowerCase()) {
                poolId = pools[i].poolId;
                break;
            }
        }

        if (!poolId) return throwErrorMessage("unSupportedPool");

        const poolAddress = await balancerV2Vault.methods.getPool(
            poolId
        ).call();

        const poolContract = new web3.eth.Contract(
            balancerV2PoolAbis,
            poolAddress[0]
        );

        const getPoolTokens = await balancerV2Vault.methods.getPoolTokens(
            poolId
        ).call();

        const liquidity = await poolContract.methods.balanceOf(
            address
        ).call();

        const totalSupply = await poolContract.methods.totalSupply(
        ).call();

        const poolAcquired = (liquidity / totalSupply);

        return (
            {
                "pairAddress": poolAddress[0],
                "tokenA": Math.floor(poolAcquired * getPoolTokens[1][0]).toString(),
                "tokenB": Math.floor(poolAcquired * getPoolTokens[1][1]).toString(),
                "tokenC": (getPoolTokens[1][2]) && Math.floor(poolAcquired * getPoolTokens[1][2]).toString(),
                "tokenD": (getPoolTokens[1][3]) && Math.floor(poolAcquired * getPoolTokens[1][3]).toString(),
                "liquidity": liquidity
            }
        );
    },

    getLiquidityCurveV2: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "getLiquidityCurveV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        let curvePool = null;

        const { address, tokenA, tokenB, tokenC, tokenD, dexId } = filterOptions;
        const { curvePools } = config.dex[dexId];

        const path = [tokenA, tokenB, tokenC, tokenD].filter(val => val).map((val => val.toLowerCase()));

        curvePools.every((pool) => {
            if (JSON.stringify(pool.tokenAddresses.sort()) === JSON.stringify(path.sort())) {
                curvePool = pool;
            }
            return true;
        });

        if (curvePool === null) return throwErrorMessage("unSupportedPool");

        const { poolName, factory, poolAddress, tokenAddress } = curvePool;
        const poolABI = await getABIFile(poolName);

        const lpContract = new web3.eth.Contract(
            factory ? poolABI : erc20ABI,
            tokenAddress
        );

        const liquidity = await lpContract.methods.balanceOf(address).call();
        const totalSupply = await lpContract.methods.totalSupply().call();
        const poolShare = liquidity / totalSupply;

        const poolContract = factory ? lpContract : new web3.eth.Contract(
            poolABI,
            poolAddress
        );

        const tokenLiq = [];
        for (let i = 0; i < path.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            const tokenReserve = await poolContract.methods.balances(i).call();
            tokenLiq.push((Math.round(poolShare * tokenReserve)).toLocaleString('fullwide', { useGrouping: false }));
        }
        return (
            {
                "pairAddress": tokenAddress,
                "tokenA": tokenLiq[0],
                "tokenB": tokenLiq[1],
                "tokenC": tokenLiq[2] && tokenLiq[2],
                "tokenD": tokenLiq[3] && tokenLiq[3],
                "liquidity": liquidity
            }
        );
    },

    getLiquidityTraderJoe: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "getLiquidityTraderJoe()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        filterOptions.factoryAddress = config.dex[filterOptions.dexId].factoryAddress;

        let totalTokenA = '';
        let totalTokenB = '';

        const factory = new web3.eth.Contract(
            traderJoeFactory,
            filterOptions.factoryAddress
        );

        const getPair = await factory.methods.getAllLBPairs(
            filterOptions.tokenA,
            filterOptions.tokenB
        ).call();



        for (const pools of getPair) {
            if (pools.length !== 1) {
                if (pools.createdByOwner === true) {
                    filterOptions.poolAddress = pools.LBPair;
                }
            }
            else if (pools.createdByOwner === false) {
                filterOptions.poolAddress = pools.LBPair;
            }
        }

        if (filterOptions.poolAddress === undefined || filterOptions.poolAddress.length === 0) return throwErrorMessage("poolDoesNotExist");

        const pairContract = new web3.eth.Contract(
            traderJoePool,
            filterOptions.poolAddress
        );

        const liquidity = await pairContract.methods.balanceOf(
            filterOptions.address,
            filterOptions.id
        ).call();

        const token0 = await pairContract.methods.getTokenX(
        ).call();

        const token1 = await pairContract.methods.getTokenY(
        ).call();

        const totalSupply = await pairContract.methods.totalSupply(
            filterOptions.id
        ).call();

        const getReserves = await pairContract.methods.getReserves(
        ).call();

        const poolAcquired = (liquidity / totalSupply);

        if (filterOptions.tokenA === token0 && filterOptions.tokenB === token1) {

            totalTokenA = (poolAcquired * getReserves[0]).toString();

            totalTokenB = (poolAcquired * getReserves[1]).toString();
        }
        else {

            totalTokenA = (poolAcquired * getReserves[1]).toString();

            totalTokenB = (poolAcquired * getReserves[0]).toString();
        }

        return ({ "pairAddress": filterOptions.poolAddress, "liquidity": liquidity, "tokenA": totalTokenA, "tokenB": totalTokenB });

    },

    getLiquidityStonFi: async (web3, options) => {

        const filterOptions = options;
        filterOptions.function = "getLiquidityStonFi()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const response = {};
        const { address, dexId, tokenA, tokenB } = filterOptions;
        const { routerAddress } = config.dex[dexId];

        try {

            if (!isValidAddressTonAddress(address)) return invalidAddress;
            const [jettonAWalletAddress, jettonBWalletAddress] = ([
                await web3.runMethod(tokenA
                    , 'get_wallet_address', [{ type: "slice", cell: beginCell().storeAddress(Address.parse(routerAddress)).endCell() }]),
                await web3.runMethod(tokenB
                    , 'get_wallet_address', [{ type: "slice", cell: beginCell().storeAddress(Address.parse(routerAddress)).endCell() }])
            ]);

            const jettonA = await jettonAWalletAddress.stack.readCell().beginParse().loadAddress();
            const jettonB = await jettonBWalletAddress.stack.readCell().beginParse().loadAddress();

            const poolAddress = await web3.runMethod(routerAddress, 'get_pool_address',
                [{ type: "slice", cell: beginCell().storeAddress((jettonA)).endCell() }
                    , { type: "slice", cell: beginCell().storeAddress((jettonB)).endCell() }]);

            const pool = poolAddress.stack.readCell().beginParse().loadAddress();
            const jettonMaster = web3.open(JettonMaster.create(pool));
            const userWalletContract = await jettonMaster.getWalletAddress(Address.parse(address));
            const { stack } = await web3.runMethod(
                userWalletContract,
                'get_wallet_data'
            );

            const userLpBalance = stack.items[0].value.toString();

            const [data, jettonData] = await Promise.all([web3.runMethod(pool, 'get_pool_data'), web3.runMethod(pool, 'get_jetton_data')]);

            const percentageShare = (userLpBalance / jettonData.stack.items[0].value.toString());

            const [totalTokenA, totalTokenB] = await Promise.all([BigInt(data.stack.items[0].value).toString()
                , BigInt(data.stack.items[1].value).toString()]);

            response.tokenA = Math.round(totalTokenA * percentageShare).toString();
            response.tokenB = Math.round(totalTokenB * percentageShare).toString();

            return (response);
        }
        catch (err) {
            return throwErrorMessage("poolDoesNotExist");
        }

    },

    getLiquidityOrca: async (solWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "liquidityOrca()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return validJson;
        }

        const { dexId } = filterOptions;
        let { positionNFT } = filterOptions;

        try {
            positionNFT = new PublicKey(positionNFT);
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

            // const position = await client.getPool(poolAddress);
            const position = await client.getPosition(positionNFT);

            const data = position.getData();

            // Get the pool to which the position belongs
            const pool = await client.getPool(data.whirlpool);

            // Calculate the amount of tokens from the position
            const amounts = PoolUtil.getTokenAmountsFromLiquidity(
                data.liquidity,
                pool.getData().sqrtPrice,
                PriceMath.tickIndexToSqrtPriceX64(data.tickLowerIndex),
                PriceMath.tickIndexToSqrtPriceX64(data.tickUpperIndex),
                true
            );

            const response = {
                positionNFT: positionNFT.toBase58(),
                liquidity: data.liquidity.toString(),
                tokenA: amounts.tokenA.toString(),
                tokenB: amounts.tokenB.toString()
            };

            // Return the response
            return response;
        } catch (error) {
            return throwErrorMessage("poolNotFound");
        }
    },


    getLiquiditySDEX: async (stllrWeb3, options) => {
        /*
         * Function will return the balance of a account on a specified pool
        */

        const filterOptions = options;
        filterOptions.function = "getLiquiditySDEX()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        // Update schema for path



        const { chainId, path, address } = filterOptions;
        const { decimals } = config.chains[chainId];

        let parsedTokens;
        try {
            parsedTokens = await getStellarAssets(stllrWeb3, path);
        } catch (error) {
            return error;
        }

        // Initializing the account
        const account = await isValidStellarAccount(stllrWeb3, address);
        if (!account) return throwErrorMessage("invalidUserAddress");

        const poolShareAsset = new LiquidityPoolAsset(
            parsedTokens.tokenA,
            parsedTokens.tokenB,
            LiquidityPoolFeeV18,
        );

        const poolId = getPoolId(poolShareAsset);

        const balances = account.balances.filter(({ liquidity_pool_id: lPoolId }) => (lPoolId === poolId));
        const liquidity = balances.length ? balances[0].balance : '0';
        let totalTokenA = '0';
        let totalTokenB = '0';

        if (liquidity > 0) {
            const poolInfo = await stllrWeb3
                .liquidityPools()
                .liquidityPoolId(poolId)
                .call();

            const { total_shares: totalShares, reserves } = poolInfo;
            totalTokenA = ((liquidity / totalShares) * reserves[0].amount).toFixed(7);
            totalTokenB = ((liquidity / totalShares) * reserves[1].amount).toFixed(7);
        }

        return ({
            "pairAddress": poolId,
            "liquidity": (Number(liquidity) * decimals).toFixed(0),
            "tokenA": (Number(totalTokenA) * decimals).toFixed(0),
            "tokenB": (Number(totalTokenB) * decimals).toFixed(0)
        });
    }
};
