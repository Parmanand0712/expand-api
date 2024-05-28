/* eslint-disable new-cap */
/* 
 * All the function in this file
 * should be returning the following schema
 * 
 * 
    {
        "transactionHash": "0x61f77b95990e4facfaee10b993e9c68cc5d8a8c74ebbcbc122011c5e79afa9cc"
    }  
 */

const { Transaction, SystemProgram, Keypair, SYSVAR_RENT_PUBKEY } = require('@solana/web3.js');
const { web3, AnchorProvider, Program, BN } = require("@project-serum/anchor");
const { TOKEN_PROGRAM_ID } = require("@solana/spl-token");
const { buildWhirlpoolClient,
    PDAUtil, PriceMath, increaseLiquidityQuoteByInputTokenWithParams,
    WhirlpoolContext, ORCA_WHIRLPOOL_PROGRAM_ID } = require("@orca-so/whirlpools-sdk");
const { deriveATA, Percentage } = require("@orca-so/common-sdk");
const bs58 = require('bs58');
const {
    ASSOCIATED_PROGRAM_ID,
} = require("@project-serum/anchor/dist/cjs/utils/token");
const Decimal = require("decimal.js");
const TonWeb = require('tonweb');
const { Router, ROUTER_REVISION, ROUTER_REVISION_ADDRESS } = require('@ston-fi/sdk');
const { getHttpEndpoint } = require('@orbs-network/ton-access');
const { LiquidityPoolFeeV18, LiquidityPoolAsset, TransactionBuilder, BASE_FEE, Operation, Networks } = require("stellar-sdk");

const { getWhirpool } = require("./utils");
const idl = require("../../../assets/abis/orca.json");
const Common = require("../../../common/common");
const uniswapV3Common = require("../../../common/uniswapV3Common");
const schemaValidator = require('../../../common/configuration/schemaValidator');
const config = require('../../../common/configuration/config.json');
const balancerV2VaultAbis = require('../../../assets/abis/balancerV2Vault.json');
const abiEncoder = require("../../../common/balancerCommon");
const errorMessage = require('../../../common/configuration/errorMessage.json');
const traderJoeFactory = require('../../../assets/abis/LBFactory.json');
const traderJoePool = require('../../../assets/abis/traderJoePoolAbi.json');
const traderJoeRouter = require('../../../assets/abis/LBRouter.json');
const { getGasPrice } = require('../chain/index');
const { payloadModifier } = require("../../../common/tonHelper");
const { isValidContractAddress, isValidStellarAccount } = require('../../../common/contractCommon');
const { getPoolId, formatTokenUnit, getStellarAssets } = require('../../../common/stellarCommon');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});

module.exports = {

    addLiquidityUniswapV2: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "addLiquidityUniswapV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        filterOptions.routerAddress = config.dex[filterOptions.dexId].routerAddress;
        filterOptions.amountAMin = (filterOptions.slippage === undefined) ? filterOptions.amountAMin
            : BigInt(Math.round(filterOptions.amountAMin - ((filterOptions.slippage / 100) * filterOptions.amountAMin))).toString();
        filterOptions.amountBMin = (filterOptions.slippage === undefined) ? filterOptions.amountBMin
            : BigInt(Math.round(filterOptions.amountBMin - ((filterOptions.slippage / 100) * filterOptions.amountBMin))).toString();

        const data = await Common.encodeFunctionData(evmWeb3, {
            "functionHash": "0xe8e33700",
            "parametersType": ["address", "address", "uint256", "uint256", "uint256", "uint256", "address", "uint256"],
            "parameters": [filterOptions.tokenA, filterOptions.tokenB, filterOptions.amountADesired,
            filterOptions.amountBDesired, filterOptions.amountAMin, filterOptions.amountBMin, filterOptions.to, filterOptions.deadline]
        });


        const transactionObject = {
            "chainId": config.dex[filterOptions.dexId].chainId,
            "from": filterOptions.from,
            "to": filterOptions.routerAddress,
            "value": "0",
            "gas": filterOptions.gas,
            "data": data
        };

        if (filterOptions.gasPriority !== undefined) {
            transactionObject.gasPrice = await getGasPrice(evmWeb3, {
                gasPriority: filterOptions.gasPriority
            }).then(res => res.gasPrice);
        }

        return (transactionObject);

    },

    addLiquiditySushiswapV2: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "addLiquidityUniswapV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        filterOptions.routerAddress = config.dex[filterOptions.dexId].routerAddress;
        filterOptions.amountAMin = (filterOptions.slippage === undefined) ? filterOptions.amountAMin
            : BigInt(Math.round(filterOptions.amountAMin - ((filterOptions.slippage / 100) * filterOptions.amountAMin))).toString();
        filterOptions.amountBMin = (filterOptions.slippage === undefined) ? filterOptions.amountBMin
            : BigInt(Math.round(filterOptions.amountBMin - ((filterOptions.slippage / 100) * filterOptions.amountBMin))).toString();

        const data = await Common.encodeFunctionData(evmWeb3, {
            "functionHash": "0xe8e33700",
            "parametersType": ["address", "address", "uint256", "uint256", "uint256", "uint256", "address", "uint256"],
            "parameters": [filterOptions.tokenA, filterOptions.tokenB, filterOptions.amountADesired,
            filterOptions.amountBDesired, filterOptions.amountAMin, filterOptions.amountBMin, filterOptions.to, filterOptions.deadline]
        });

        const transactionObject = {
            "chainId": config.dex[filterOptions.dexId].chainId,
            "from": filterOptions.from,
            "to": filterOptions.routerAddress,
            "value": "0",
            "gas": filterOptions.gas,
            "data": data
        };

        if (filterOptions.gasPriority !== undefined) {
            transactionObject.gasPrice = await getGasPrice(evmWeb3, {
                gasPriority: filterOptions.gasPriority
            }).then(res => res.gasPrice);
        }

        return (transactionObject);

    },

    addLiquidityPancakeV2: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "addLiquidityUniswapV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        filterOptions.routerAddress = config.dex[filterOptions.dexId].routerAddress;
        filterOptions.amountAMin = (filterOptions.slippage === undefined) ? filterOptions.amountAMin
            : BigInt(Math.round(filterOptions.amountAMin - ((filterOptions.slippage / 100) * filterOptions.amountAMin))).toString();
        filterOptions.amountBMin = (filterOptions.slippage === undefined) ? filterOptions.amountBMin
            : BigInt(Math.round(filterOptions.amountBMin - ((filterOptions.slippage / 100) * filterOptions.amountBMin))).toString();

        const data = await Common.encodeFunctionData(evmWeb3, {
            "functionHash": "0xe8e33700",
            "parametersType": ["address", "address", "uint256", "uint256", "uint256", "uint256", "address", "uint256"],
            "parameters": [filterOptions.tokenA, filterOptions.tokenB, filterOptions.amountADesired,
            filterOptions.amountBDesired, filterOptions.amountAMin, filterOptions.amountBMin, filterOptions.to, filterOptions.deadline]
        });

        const transactionObject = {
            "chainId": config.dex[filterOptions.dexId].chainId,
            "from": filterOptions.from,
            "to": filterOptions.routerAddress,
            "value": "0",
            "gas": filterOptions.gas,
            "data": data
        };

        if (filterOptions.gasPriority !== undefined) {
            transactionObject.gasPrice = await getGasPrice(evmWeb3, {
                gasPriority: filterOptions.gasPriority
            }).then(res => res.gasPrice);
        }

        return (transactionObject);

    },

    addLiquidityUniswapV3: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "addLiquidityUniswapV3()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        filterOptions.routerAddress = config.dex[filterOptions.dexId].positionManager;

        const increaseLiquidity = [];

        const pool = await uniswapV3Common.getPool(evmWeb3, filterOptions.dexId, filterOptions.tokenA, filterOptions.tokenB, filterOptions.poolFees);
        const currentTicks = await uniswapV3Common.getMinMaxTick(evmWeb3, pool);
        filterOptions.amountAMin = (filterOptions.slippage === undefined) ? filterOptions.amountAMin
            : BigInt(Math.round(filterOptions.amountAMin - ((filterOptions.slippage / 100) * filterOptions.amountAMin))).toString();
        filterOptions.amountBMin = (filterOptions.slippage === undefined) ? filterOptions.amountBMin
            : BigInt(Math.round(filterOptions.amountBMin - ((filterOptions.slippage / 100) * filterOptions.amountBMin))).toString();

        if (filterOptions.tokenId === undefined) {

            const position = await Common.encodeFunctionData(evmWeb3, {
                "functionHash": "0x88316456",
                "parametersType": ["address", "address", "uint24",
                    "int24", "int24", "uint256", "uint256", "uint256", "uint256", "address", "uint256"],
                "parameters": [filterOptions.tokenA, filterOptions.tokenB, filterOptions.poolFees,
                currentTicks[0], currentTicks[1], filterOptions.amountADesired,
                filterOptions.amountBDesired, filterOptions.amountAMin, filterOptions.amountBMin, filterOptions.to, filterOptions.deadline]
            });
            increaseLiquidity.push(position);

        } else {

            const liquidity = await Common.encodeFunctionData(evmWeb3, {
                "functionHash": "0x219f5d17",
                "parametersType": ["uint256", "uint256", "uint256", "uint256", "uint256", "uint256"],
                "parameters": [filterOptions.tokenId, filterOptions.amountADesired, filterOptions.amountBDesired,
                filterOptions.amountAMin, filterOptions.amountBMin, filterOptions.deadline]
            });
            increaseLiquidity.push(liquidity);

        }

        const removeEth = await Common.encodeFunctionData(evmWeb3, {
            "functionHash": "0x12210e8a",
            "parametersType": [],
            "parameters": []
        });
        increaseLiquidity.push(removeEth);

        const data = await Common.encodeFunctionData(evmWeb3, {
            "functionHash": "0xac9650d8",
            "parametersType": ["bytes[]",],
            "parameters": [increaseLiquidity]
        });

        const transactionObject = {
            "chainId": config.dex[filterOptions.dexId].chainId,
            "from": filterOptions.to,
            "to": filterOptions.routerAddress,
            "value": "0",
            "gas": filterOptions.gas,
            "data": data
        };

        if (filterOptions.gasPriority !== undefined) {
            transactionObject.gasPrice = await getGasPrice(evmWeb3, {
                gasPriority: filterOptions.gasPriority
            }).then(res => res.gasPrice);
        }

        return (transactionObject);
    },


    addLiquidityBalancerV2: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "addLiquidityBalancerV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        let { path, amountOut } = filterOptions;
        const { dexId, slippage, amountIn, fromInternalBalance, from, to, gas, gasPriority } = filterOptions;

        const isValidAddress = await isValidContractAddress(evmWeb3, from);

        if (!isValidAddress) return throwErrorMessage("invalidAddress");

        if (path.length !== amountIn.length) {
            return {
                "message": errorMessage.error.message.pathAndAmountsMismatch,
                'code': errorMessage.error.code.invalidInput
            };
        }

        path = path.map((val => val.toLowerCase()));

        const pathToAmountIn = Object.fromEntries(
            path.map((key, index) => [key, amountIn[index]])
        );
        const sortedKeys = Object.keys(pathToAmountIn).sort();
        const sortedObj = {};
        sortedKeys.forEach(key => {
            sortedObj[key] = pathToAmountIn[key];
        });
        const sortedAmountIn = Object.values(sortedObj);


        const { vaultAddress } = config.dex[dexId];

        const balancerV2Vault = new evmWeb3.eth.Contract(balancerV2VaultAbis, vaultAddress);

        let poolId = '';
        let poolType = '';
        const pools = config.dex[dexId].balPools;

        for (let i = 0; i < pools.length; i += 1) {
            if (JSON.stringify(path.sort()) === JSON.stringify(pools[i].tokens.sort()).toLowerCase()) {
                poolId = pools[i].poolId;
                poolType = pools[i].poolType;
                break;
            }
        }
        if (!poolId && !poolType) return throwErrorMessage("unSupportedPool");
        amountOut = (slippage === undefined) ? amountOut :
            BigInt(Math.round(amountOut - ((slippage / 100) * amountOut))).toString();


        // encoding the data for the request
        const userabiDatafilterOptions = abiEncoder.joinExactTokensInForBPTOut(sortedAmountIn, amountOut);
        const request = {
            assets: path,
            maxAmountsIn: sortedAmountIn,
            userData: userabiDatafilterOptions,
            fromInternalBalance
        };
        const data = balancerV2Vault.methods.joinPool(
            poolId,
            from,
            to,
            request
        ).encodeABI();

        const transactionObject = {
            "chainId": config.dex[dexId].chainId,
            "from": from,
            "to": vaultAddress,
            "value": "0",
            "gas": gas,
            "data": data
        };

        if (gasPriority !== undefined) {
            transactionObject.gasPrice = await getGasPrice(evmWeb3, {
                gasPriority
            }).then(res => res.gasPrice);
        }

        return (transactionObject);

    },

    addLiquidityCurveV2: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "addLiquidityCurveV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        let { path, amountOut } = filterOptions;
        const { from, gas, slippage, dexId, gasPriority, amountIn } = filterOptions;
        const { curvePools } = config.dex[dexId];
        let curvePool = null;

        path = path.map((val => val.toLowerCase()));

        curvePools.every((pool) => {
            if (JSON.stringify(pool.tokenAddresses.sort()) === JSON.stringify(path.sort())) {
                curvePool = pool;
            }
            return true;
        });

        if (curvePool === null) return {
            'message': errorMessage.error.message.unSupportedPool,
            'code': errorMessage.error.code.invalidInput
        };

        const { tokenAddresses, poolAddress } = curvePool;
        const poolSize = tokenAddresses.length;

        let data = null;
        amountOut = (slippage === undefined) ? amountOut :
            BigInt(Math.round(amountOut - ((slippage / 100) * amountOut))).toString();

        if (poolSize === 3) {
            data = await Common.encodeFunctionData(evmWeb3, {
                "functionHash": "0x4515cef3",
                "parametersType": ["uint256[3]", "uint256"],
                "parameters": [amountIn, amountOut]
            });
        } else if (poolSize === 4) {
            data = await Common.encodeFunctionData(evmWeb3, {
                "functionHash": "0x029b2f34",
                "parametersType": ["uint256[4]", "uint256"],
                "parameters": [amountIn, amountOut]
            });
        } else if (poolSize === 2) {
            data = await Common.encodeFunctionData(evmWeb3, {
                "functionHash": "0x0b4c7e4d",
                "parametersType": ["uint256[2]", "uint256"],
                "parameters": [amountIn, amountOut]
            });
        }

        let value = "0";
        for (let tokenIndex = 0; tokenIndex <= path.length; tokenIndex += 1) {
            if (path[tokenIndex] === (config.dex[dexId].ethAddress)) {
                value = (amountIn[tokenIndex]).toString();
            }
        }

        const transactionObject = {
            chainId: config.dex[dexId].chainId,
            from,
            "to": poolAddress,
            value,
            gas,
            data
        };

        if (gasPriority !== undefined) {
            transactionObject.gasPrice = await getGasPrice(evmWeb3, {
                gasPriority
            }).then(res => res.gasPrice);
        }

        return (transactionObject);

    },

    addLiquidityTraderJoe: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "addLiquidityTraderJoe()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        filterOptions.amountAMin = (filterOptions.slippage === undefined) ? filterOptions.amountAMin
            : BigInt(Math.round(filterOptions.amountAMin - ((filterOptions.slippage / 100) * filterOptions.amountAMin))).toString();
        filterOptions.amountBMin = (filterOptions.slippage === undefined) ? filterOptions.amountBMin
            : BigInt(Math.round(filterOptions.amountBMin - ((filterOptions.slippage / 100) * filterOptions.amountBMin))).toString();
        filterOptions.routerAddress = config.dex[filterOptions.dexId].routerAddress;
        filterOptions.factoryAddress = config.dex[filterOptions.dexId].factoryAddress;
        filterOptions.idSlippage = 5;

        const factoryContract = new evmWeb3.eth.Contract(traderJoeFactory, filterOptions.factoryAddress);
        const poolData = await factoryContract.methods.getAllLBPairs(filterOptions.tokenA, filterOptions.tokenB).call();

        for (const pools of poolData) {
            if (pools.createdByOwner === true) {
                filterOptions.binStep = pools.binStep;
                filterOptions.poolAddress = pools.LBPair;
            }
        }

        const poolContract = new evmWeb3.eth.Contract(traderJoePool, filterOptions.poolAddress);
        filterOptions.activeIdDesired = await poolContract.methods.getActiveId().call();
        const router = new evmWeb3.eth.Contract(traderJoeRouter, filterOptions.routerAddress);

        const { strategy } = filterOptions;
        const { deltaIds, distributionX, distributionY } = config.dex[filterOptions.dexId].strategy[strategy];
        const tupleData = {
            tokenX: filterOptions.tokenA,
            tokenY: filterOptions.tokenB,
            binStep: filterOptions.binStep,
            amountX: filterOptions.amountA,
            amountY: filterOptions.amountB,
            amountXMin: filterOptions.amountAMin,
            amountYMin: filterOptions.amountBMin,
            activeIdDesired: filterOptions.activeIdDesired,
            idSlippage: filterOptions.idSlippage,
            deltaIds,
            distributionX,
            distributionY,
            to: filterOptions.to,
            refundTo: filterOptions.to,
            deadline: filterOptions.deadline
        };

        const data = await router.methods.addLiquidity(tupleData).encodeABI();
        const transactionObject = {
            "chainId": filterOptions.chainId,
            "from": filterOptions.from,
            "to": filterOptions.routerAddress,
            "value": "0",
            "gas": filterOptions.gas,
            "data": data
        };

        if (filterOptions.gasPriority !== undefined) {
            transactionObject.gasPrice = await getGasPrice(evmWeb3, {
                gasPriority: filterOptions.gasPriority
            }).then(res => res.gasPrice);
        }

        return (transactionObject);

    },

    addLiquidityStonFi: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "addLiquidityStonFi()";
        const validJson = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return validJson;
        }

        const transactionObject = {};
        let { amountAMin, amountBMin } = filterOptions;
        const { slippage, chainId, from, tokenA, tokenB, amountADesired, amountBDesired, queryId } = filterOptions;
        const { stonFiExtraGas } = config.chains[chainId];

        for (const prop of ['amountAMin', 'amountBMin', 'amountADesired', 'amountADesired']) {
            if (!(/^\+?\d+$/.test(filterOptions[prop]))) {
                return {
                    'message': `Error: invalid BigNumber string (argument="${filterOptions[prop]}"
                    ,value="${filterOptions[prop]}", code=INVALID_ARGUMENT, version=bignumber/5.7.0)`,
                    'code': errorMessage.error.code.invalidInput
                };
            }
        }

        amountAMin = (slippage === undefined) ? amountAMin :
            BigInt(Math.round(amountAMin - ((slippage / 100) * amountAMin))).toString();

        amountBMin = (filterOptions.slippage === undefined) ? amountBMin :
            BigInt(Math.round(amountBMin - ((slippage / 100) * amountBMin))).toString();

        const tonweb = new TonWeb.HttpProvider();
        tonweb.host = await getHttpEndpoint({ network: config.chains[chainId].network });

        const router = new Router(tonweb, {
            revision: ROUTER_REVISION.V1,
            address: ROUTER_REVISION_ADDRESS.V1,
        });

        const jetton0ProvisionTxParams =
            await router.buildProvideLiquidityJettonTxParams({
                userWalletAddress: from,
                sendTokenAddress: tokenA,
                sendAmount: amountADesired,
                otherTokenAddress: tokenB,
                minLpOut: amountBMin,
                queryId: (queryId === undefined || queryId === null) ? 0 : queryId,
            });

        transactionObject.jetton0Transaction = {
            chainId,
            to: jetton0ProvisionTxParams.to.toString(),
            value: (jetton0ProvisionTxParams.gasAmount.add(TonWeb.utils.toNano(stonFiExtraGas))).toString(),
            message: await payloadModifier(jetton0ProvisionTxParams.payload),
        };

        const jetton1ProvisionTxParams =
            await router.buildProvideLiquidityJettonTxParams({
                userWalletAddress: from,
                sendTokenAddress: tokenB,
                sendAmount: amountBDesired,
                otherTokenAddress: tokenA,
                minLpOut: amountAMin,
                queryId: (queryId === undefined || queryId === null) ? 0 : queryId,
            });

        transactionObject.jetton1Transaction = {
            chainId,
            to: jetton1ProvisionTxParams.to.toString(),
            value: (jetton1ProvisionTxParams.gasAmount.add(TonWeb.utils.toNano(stonFiExtraGas))).toString(),
            message: await payloadModifier(jetton1ProvisionTxParams.payload),
        };

        return transactionObject;
    },

    addLiquidityOrca: async (solWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "addLiquiOrca()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return validJson;
        }

        const { from, path, amountIn, dexId } = filterOptions;
        let { slippage } = filterOptions;
        slippage = new BN(Math.ceil(slippage));

        // Create Anchor provider
        const provider = new AnchorProvider(solWeb3, {}, {});

        // Initialize the Program
        const programId = new web3.PublicKey(
            config.dex[dexId].programId
        );
        const program = new Program(idl, programId, provider);

        // Create the WhirpoolContext
        const context = WhirlpoolContext.withProvider(provider, programId);
        const client = buildWhirlpoolClient(context);

        let keypair;
        let inputToken;
        let outputToken;

        try {
            keypair = new web3.PublicKey(from);
        } catch (error) {
            return throwErrorMessage("invalidPublicKey");
        }

        try {
            inputToken = {
                mint: new web3.PublicKey(path[0]),
            };
            outputToken = {
                mint: new web3.PublicKey(path[1]),
            };
        } catch (error) {
            return throwErrorMessage("invalidSPLToken");
        }

        // Calculate Input amount
        const inputAmount = new BN(amountIn[0]);

        // Set the slippage
        slippage = Percentage.fromFraction(slippage || 2, 100);

        const NEBULA_WHIRLPOOLS_CONFIG = new web3.PublicKey(
            config.dex[dexId].nebula
        );

        let tickSpacing = 128;
        let pool;

        const whirlpoolInfo = await getWhirpool(path[0], path[1]);

        if (dexId === "2500" && whirlpoolInfo.length && !(whirlpoolInfo.status)) {
            tickSpacing = whirlpoolInfo[0].tickSpacing;
            pool = new web3.PublicKey(whirlpoolInfo[0].pubkey);
            inputToken.mint = new web3.PublicKey(whirlpoolInfo[0].tokenMintA);
            outputToken.mint = new web3.PublicKey(whirlpoolInfo[0].tokenMintB);
        } else {
            pool = PDAUtil.getWhirlpool(
                programId,
                NEBULA_WHIRLPOOLS_CONFIG,
                inputToken.mint,
                outputToken.mint,
                tickSpacing
            ).publicKey;
        }

        if (dexId === "2501") {
            tickSpacing = 64;
            pool = PDAUtil.getWhirlpool(
                programId,
                NEBULA_WHIRLPOOLS_CONFIG,
                inputToken.mint,
                outputToken.mint,
                tickSpacing
            ).publicKey;
        }

        const [outputTokenATA, inputTokenATA] = await Promise.all([
            deriveATA(keypair, outputToken.mint),
            deriveATA(keypair, inputToken.mint)
        ]);

        const mainTx = new Transaction();

        try {

            // Whirpool Object for Interacion
            const whirlpool = await client.getPool(pool);

            // get the data
            const whirlpoolData = whirlpool.getData();

            const tokenA = whirlpool.getTokenAInfo();
            const tokenB = whirlpool.getTokenBInfo();

            const sqrtPricex64 = whirlpool.getData().sqrtPrice;
            const price = PriceMath.sqrtPriceX64ToPrice(
                sqrtPricex64,
                tokenA.decimals,
                tokenB.decimals
            );

            const lowerPrice = new Decimal((parseFloat(price) - 4 * parseFloat(price) / 10).toString());
            const upperPrice = new Decimal((parseFloat(price) + 4 * parseFloat(price) / 10).toString());

            const lowerTickIndex = PriceMath.priceToInitializableTickIndex(
                lowerPrice,
                tokenA.decimals,
                tokenB.decimals,
                whirlpoolData.tickSpacing
            );

            const upperTickIndex = PriceMath.priceToInitializableTickIndex(
                upperPrice,
                tokenA.decimals,
                tokenB.decimals,
                whirlpoolData.tickSpacing
            );

            // Obtain deposit estimation
            const quote = increaseLiquidityQuoteByInputTokenWithParams({
                tokenMintA: inputToken.mint,
                tokenMintB: outputToken.mint,
                sqrtPrice: whirlpoolData.sqrtPrice,
                tickCurrentIndex: whirlpoolData.tickCurrentIndex,
                tickLowerIndex: lowerTickIndex,
                tickUpperIndex: upperTickIndex,
                inputTokenMint: inputToken.mint,
                inputTokenAmount: inputAmount,
                slippageTolerance: slippage,
            });


            // Adding Liquidity
            const positionMint = Keypair.generate();
            const pda = PDAUtil.getPosition(
                ORCA_WHIRLPOOL_PROGRAM_ID,
                positionMint.publicKey
            );
            const position = pda.publicKey;
            const {bump} = pda;
            const positionTokenAccount = await deriveATA(
                keypair,
                positionMint.publicKey, true, true
            );

            // Create the transaction
            const openPositionTx = await program.methods
                .openPosition({ positionBump: bump }, lowerTickIndex, upperTickIndex)
                .accounts({
                    funder: keypair,
                    owner: keypair,
                    position,
                    positionMint: positionMint.publicKey,
                    positionTokenAccount,
                    whirlpool: whirlpool.getAddress(),
                    tokenProgram: TOKEN_PROGRAM_ID,
                    SystemProgram: SystemProgram.programId,
                    rent: SYSVAR_RENT_PUBKEY,
                    associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
                })
                .transaction();

            const tickArrayLowerPubkey = PDAUtil.getTickArrayFromTickIndex(
                lowerTickIndex, tickSpacing, pool, context.program.programId)
                .publicKey;
            const tickArrayUpperPubkey = PDAUtil.getTickArrayFromTickIndex(
                upperTickIndex, tickSpacing, pool, context.program.programId)
                .publicKey;

            // Increment the liquidity
            const increaseLiquidity = await program.methods
                .increaseLiquidity(quote.liquidityAmount, quote.tokenMaxA, quote.tokenMaxB)
                .accounts({
                    whirlpool: whirlpool.getAddress(),
                    tokenProgram: TOKEN_PROGRAM_ID,
                    positionAuthority: keypair,
                    position,
                    positionTokenAccount,
                    tokenOwnerAccountA: inputTokenATA,
                    tokenOwnerAccountB: outputTokenATA,
                    tokenVaultA: whirlpool.getData().tokenVaultA,
                    tokenVaultB: whirlpool.getData().tokenVaultB,
                    tickArrayLower: tickArrayLowerPubkey,
                    tickArrayUpper: tickArrayUpperPubkey,
                })
                .transaction();

            mainTx.add(openPositionTx)
                .add(increaseLiquidity);

            const { blockhash } = await solWeb3.getLatestBlockhash('finalized');
            mainTx.recentBlockhash = blockhash;
            mainTx.feePayer = keypair;

            const transactionBuffer = mainTx.serialize({
                requireAllSignatures: false,
                verifySignatures: false
            });

            const response = {
                chainId: config.dex[dexId].chainId,
                from: keypair.toBase58(),
                to: programId.toBase58(),
                positionNFT: position,
                data: Buffer.from(transactionBuffer).toString("base64"),
                additionalSigners: bs58.encode(positionMint._keypair.secretKey)
            };

            // Return the response
            return response;

        } catch (error) {
            return throwErrorMessage("poolNotFound");
        }
    },

    addLiquiditySDEX: async (stllrWeb3, options) => {
        /*
         * Function will return the payload for adding the liquidity to the specified pool
        */

        const filterOptions = options;
        filterOptions.function = "addLiquiditySDEX()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const { chainId, dexId, path, amountIn, from, slippage } = filterOptions;
        const { decimals } = config.chains[chainId];

        if (!(/^[1-9][0-9]*$/.test(amountIn[0])) || !(/^[1-9][0-9]*$/.test(amountIn[1]))) return {
            'message': `Amount should be numeric and greater than 0`,
            'code': errorMessage.error.code.invalidInput
        }; 

        let parsedTokens;
        // Fetching tokens detail
        try {
        parsedTokens = await getStellarAssets(stllrWeb3, path);
        } catch (error) {
          return error;
        }

        // Initializing the account
        const account = await isValidStellarAccount(stllrWeb3, from);
        if (!account) return throwErrorMessage("invalidUserAddress");

        const slippageValue = 1 - (Number(slippage || 0) / 100);
        const exactPrice = formatTokenUnit(amountIn[0]) / formatTokenUnit(amountIn[1]);
        const minPrice = slippage ? (exactPrice - (exactPrice * slippageValue)) : exactPrice;
        const maxPrice = slippage ? (exactPrice + (exactPrice * slippageValue)) : exactPrice;

        const { tokenA, tokenB } = parsedTokens;
        const poolShareAsset = new LiquidityPoolAsset(
            tokenA,
            tokenB,
            LiquidityPoolFeeV18,
        );

        const poolId = getPoolId(poolShareAsset);

        const { TESTNET, PUBLIC } = Networks;

        // Building transaction for addliquidity
        let transaction = new TransactionBuilder(account, {
            fee: BASE_FEE,
            networkPassphrase: dexId === "2401" ? TESTNET : PUBLIC
        });

        // Checking if the user has trustline set for the liquidity token
        const lpTrustline = account.balances.find(({ liquidity_pool_id: lPoolId }) => (lPoolId === poolId));
        const tokenATrustline = account.balances.find(({ asset_code: assetCode, asset_issuer: assetIssuer }) => (
            assetCode === tokenA.code && assetIssuer === tokenA.issuer
            ));
        const tokenBTrustline = account.balances.find(({ asset_code: assetCode, asset_issuer: assetIssuer }) => (
            assetCode === tokenB.code && assetIssuer === tokenB.issuer
            ));

        if (!lpTrustline || (Number(lpTrustline?.limit || 0) * decimals) < (Number(maxPrice * decimals) + Number(lpTrustline?.balance || 0))) {
            transaction = transaction.addOperation(Operation.changeTrust({
                asset: poolShareAsset,
                limit: ((Number(maxPrice)?.toFixed(0) || Number(maxPrice)) + 1 + Number(lpTrustline?.balance || 0)).toString(),
            }));
        }

        if (tokenA.code !== "XLM" && (!tokenATrustline || (Number(tokenATrustline?.limit || 0) * decimals) < Number(amountIn[0]))) {
            transaction = transaction.addOperation(Operation.changeTrust({
                asset: tokenA,
                limit: formatTokenUnit(amountIn[0]),
            }));
        }

        if (tokenB.code !== "XLM" && (!tokenBTrustline || (Number(tokenBTrustline?.limit || 0) * decimals) < Number(amountIn[1]))) {
            transaction = transaction.addOperation(Operation.changeTrust({
                asset: tokenB,
                limit: formatTokenUnit(amountIn[1]),
            }));
        }

        transaction = transaction.addOperation(
                Operation.liquidityPoolDeposit({
                    liquidityPoolId: poolId,
                    maxAmountA: formatTokenUnit(amountIn[0]),
                    maxAmountB: formatTokenUnit(amountIn[1]),
                    minPrice: minPrice?.toFixed(7),
                    maxPrice: maxPrice?.toFixed(7),
                }),
            )
            .setTimeout(100)
            .build();

        return { chainId, from, gas: BASE_FEE, data: transaction.toEnvelope().toXDR('base64') };
    },
};
