/* 
 * All the function in this file
 * should be returning the following schema
 * 
 * 
    {
        "transactionHash": "0x61f77b95990e4facfaee10b993e9c68cc5d8a8c74ebbcbc122011c5e79afa9cc"
    }  
 */

const { AnchorProvider, BN, web3, Program } = require("@project-serum/anchor");
const {
    WhirlpoolContext, buildWhirlpoolClient,
    decreaseLiquidityQuoteByLiquidityWithParams, PDAUtil
} = require("@orca-so/whirlpools-sdk");
const { Percentage, deriveATA } = require("@orca-so/common-sdk");
const { TOKEN_PROGRAM_ID } = require("@solana/spl-token");
const TonWeb = require('tonweb');
const { Router, ROUTER_REVISION, ROUTER_REVISION_ADDRESS } = require('@ston-fi/sdk');
const { getHttpEndpoint } = require('@orbs-network/ton-access');
const { LiquidityPoolFeeV18, LiquidityPoolAsset, Networks, BASE_FEE, Operation, TransactionBuilder } = require('stellar-sdk');

const idl = require("../../../assets/abis/orca.json");
const { payloadModifier } = require('../../../common/tonHelper');
const Common = require("../../../common/common");
const schemaValidator = require('../../../common/configuration/schemaValidator');
const config = require('../../../common/configuration/config.json');
const balancerV2VaultAbis = require('../../../assets/abis/balancerV2Vault.json');
const abiEncoder = require('../../../common/balancerCommon');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const { getGasPrice } = require('../chain/index');
const { isValidContractAddress, isValidStellarAccount } = require('../../../common/contractCommon');
const { getPoolId, formatTokenUnit, getStellarAssets } = require('../../../common/stellarCommon');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});

const poolDoesNotExist = {
    'message': errorMessage.error.message.poolDoesNotExist,
    'code': errorMessage.error.code.invalidInput
};

module.exports = {

    removeLiquidityUniswapV2: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "removeLiquidityUniswapV2()";
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
            "functionHash": "0xbaa2abde",
            "parametersType": ["address", "address", "uint256", "uint256", "uint256", "address", "uint256"],
            "parameters": [filterOptions.tokenA, filterOptions.tokenB, filterOptions.liquidity,
            filterOptions.amountAMin, filterOptions.amountBMin, filterOptions.to, filterOptions.deadline]
        });

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

    removeLiquiditySushiswapV2: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "removeLiquidityUniswapV2()";
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
            "functionHash": "0xbaa2abde",
            "parametersType": ["address", "address", "uint256", "uint256", "uint256", "address", "uint256"],
            "parameters": [filterOptions.tokenA, filterOptions.tokenB, filterOptions.liquidity,
            filterOptions.amountAMin, filterOptions.amountBMin, filterOptions.to, filterOptions.deadline]
        });


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

    removeLiquidityPancakeV2: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "removeLiquidityUniswapV2()";
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
            "functionHash": "0xbaa2abde",
            "parametersType": ["address", "address", "uint256", "uint256", "uint256", "address", "uint256"],
            "parameters": [filterOptions.tokenA, filterOptions.tokenB, filterOptions.liquidity,
            filterOptions.amountAMin, filterOptions.amountBMin, filterOptions.to, filterOptions.deadline]
        });

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

    removeLiquidityUniswapV3: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "removeLiquidityUniswapV3()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        let { amountAMin, amountBMin } = filterOptions;

        filterOptions.routerAddress = config.dex[filterOptions.dexId].positionManager;

        await Promise.all([Common.checkAmountsForProperFormat(amountAMin), Common.checkAmountsForProperFormat(amountAMin)]);

        amountAMin = (filterOptions.slippage === undefined) ? amountAMin
            : BigInt(Math.round(amountAMin - ((filterOptions.slippage / 100) * amountAMin))).toString();
        amountBMin = (filterOptions.slippage === undefined) ? filterOptions.amountBMin
            : BigInt(Math.round(amountBMin - ((filterOptions.slippage / 100) * amountBMin))).toString();
        const removeLiquidity = [];

        const decreaseLiquidity = await Common.encodeFunctionData(evmWeb3, {
            "functionHash": "0x0c49ccbe",
            "parametersType": ["uint256", "uint128", "uint256", "uint256", "uint256"],
            "parameters": [filterOptions.tokenId, filterOptions.liquidity, amountAMin,
                amountBMin, filterOptions.deadline]
        });
        removeLiquidity.push(decreaseLiquidity);

        const collect = await Common.encodeFunctionData(evmWeb3, {
            "functionHash": "0xfc6f7865",
            "parametersType": ["uint256", "address", "uint128", "uint128"],
            "parameters": [filterOptions.tokenId, filterOptions.recipient, filterOptions.amountAMax, filterOptions.amountBMax]
        });
        removeLiquidity.push(collect);

        const unwrapWeth9 = await Common.encodeFunctionData(evmWeb3, {
            "functionHash": "0x49404b7c",
            "parametersType": ["uint256", "address"],
            "parameters": [amountAMin, filterOptions.from]
        });
        removeLiquidity.push(unwrapWeth9);

        const sweepToken = await Common.encodeFunctionData(evmWeb3, {
            "functionHash": "0xdf2ab5bb",
            "parametersType": ["address", "uint256", "address"],
            "parameters": [filterOptions.tokenA, amountAMin, filterOptions.from]
        });
        removeLiquidity.push(sweepToken);

        const data = await Common.encodeFunctionData(evmWeb3, {
            "functionHash": "0xac9650d8",
            "parametersType": ["bytes[]",],
            "parameters": [removeLiquidity]
        });

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

    removeLiquidityBalancerV2: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "removeLiquidityBalancerV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        let { path, amountOut } = filterOptions;
        const { dexId, slippage, amountIn, toInternalBalance, from, to, gas, gasPriority } = filterOptions;

        if (path.length !== amountOut.length) {
            return {
                "message": errorMessage.error.message.pathAndAmountsMismatch,
                'code': errorMessage.error.code.invalidInput
            };
        }

        const isValidAddress = await isValidContractAddress(evmWeb3, from);

        if (!isValidAddress) return throwErrorMessage("invalidAddress");

        const { vaultAddress } = config.dex[dexId];

        const balancerV2Vault = new evmWeb3.eth.Contract(balancerV2VaultAbis, vaultAddress);

        let poolId = '';
        let poolType = '';
        const pools = config.dex[dexId].balPools;

        path = path.map((val => val.toLowerCase()));
        const pathToAmountIn = Object.fromEntries(
            path.map((key, index) => [key, amountOut[index]])
        );
        const sortedKeys = Object.keys(pathToAmountIn).sort();
        const sortedObj = {};
        sortedKeys.forEach(key => {
            sortedObj[key] = pathToAmountIn[key];
        });
        const sortedAmountOut = Object.values(sortedObj);

        const exitKind = "exitBPTInForExactTokensOut";
        let userabiDataEncoded = '';
        amountOut = (slippage === undefined) ? amountOut :
            amountOut.map(amount => BigInt(Math.round(amount - ((slippage / 100) * amount))).toString());
        for (let i = 0; i < pools.length; i += 1) {
            if (JSON.stringify(path.sort()) === JSON.stringify(pools[i].tokens.sort()).toLowerCase()) {
                poolId = pools[i].poolId;
                poolType = pools[i].poolType;
                break;
            }
        }
        if (!poolId && !poolType) return throwErrorMessage("unSupportedPool");


        userabiDataEncoded = abiEncoder[`${exitKind}`](sortedAmountOut, amountIn);

        const request = {
            assets: path,
            minAmountsOut: sortedAmountOut,
            userData: userabiDataEncoded,
            toInternalBalance
        };

        const data = balancerV2Vault.methods.exitPool(
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

    removeLiquidityCurveV2: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "removeLiquidityCurveV2()";
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
            amountOut.map(amount => BigInt(Math.round(amount - ((slippage / 100) * amount))).toString());

        if (poolSize === 3) {
            data = await Common.encodeFunctionData(evmWeb3, {
                "functionHash": "0xecb586a5",
                "parametersType": ["uint256", "uint256[3]"],
                "parameters": [amountIn, amountOut]
            });
        } else if (poolSize === 4) {
            data = await Common.encodeFunctionData(evmWeb3, {
                "functionHash": "0x7d49d875",
                "parametersType": ["uint256", "uint256[4]"],
                "parameters": [amountIn, amountOut]
            });
        } else if (poolSize === 2) {
            data = await Common.encodeFunctionData(evmWeb3, {
                "functionHash": "0x5b36389c",
                "parametersType": ["uint256", "uint256[2]"],
                "parameters": [amountIn, amountOut]
            });
        }

        const transactionObject = {
            chainId: config.dex[filterOptions.dexId].chainId,
            from,
            "to": poolAddress,
            "value": "0",
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

    removeLiquidityTraderJoe: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "removeLiquidityTraderJoe()";
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
            "functionHash": "0xc22159b6",
            "parametersType": ["address", "address", "uint16", "uint256", "uint256", "uint256[]", "uint256[]", "address", "uint256"],
            "parameters": [filterOptions.tokenA, filterOptions.tokenB, filterOptions.binStep,
            filterOptions.amountAMin, filterOptions.amountBMin, filterOptions.ids, filterOptions.amounts, filterOptions.to, filterOptions.deadline]
        });

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

    removeLiquidityStonFi: async (evmWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "removeLiquidityStonFi()";
        const validJson = await schemaValidator.validateInput(options);

        if (!validJson.valid) {
            return validJson;
        }

        const { chainId, liquidity, tokenA, tokenB, from, queryId } = filterOptions;
        const { stonFiExtraGas } = config.chains[chainId];
        const tonweb = new TonWeb.HttpProvider();
        tonweb.host = await getHttpEndpoint({ network: config.chains[chainId].network });

        if (!(/^\+?\d+$/.test(liquidity))) return {
            'message': `Error: invalid BigNumber string (argument="${"value"}",value="${liquidity}", code=INVALID_ARGUMENT, version=bignumber/5.7.0)`,
            'code': errorMessage.error.code.invalidInput
        };


        const router = new Router(tonweb, {
            revision: ROUTER_REVISION.V1,
            address: ROUTER_REVISION_ADDRESS.V1,
        });

        const pool = await router.getPool({
            jettonAddresses: [tokenA, tokenB],
        });

        if (!pool) {
            return poolDoesNotExist;
        }

        const burnTxParams = await pool.buildBurnTxParams({
            amount: liquidity,
            responseAddress: from,
            queryId: (queryId === undefined || queryId === null) ? 0 : queryId,
        });

        return ({
            chainId,
            to: burnTxParams.to.toString(),
            value: (burnTxParams.gasAmount.add(TonWeb.utils.toNano(stonFiExtraGas))).toString(),
            message: await payloadModifier(burnTxParams.payload)
        });

    },

    removeLiquiditySDEX: async (stllrWeb3, options) => {
        /*
         * Function will return the payload for removing the liquidity from the specified pool
        */

        const filterOptions = options;
        filterOptions.function = "removeLiquiditySDEX()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

    // Todo: Update schema for path
        const { chainId, dexId, path, from, liquidity, amountOutMin, slippage } = filterOptions;

        if (!(/^[1-9][0-9]*$/.test(amountOutMin[0])) || !(/^[1-9][0-9]*$/.test(amountOutMin[1]))) return {
            'message': `Amount should be numeric and greater than 0`,
            'code': errorMessage.error.code.invalidInput
        }; 

        let parsedTokens;
        // Fetching tokens detail
        try {
          parsedTokens = await getStellarAssets(stllrWeb3, path);
        } catch (err) {
          return err;
        }

        // Applying slippage on amount outs
        const amountAMin = slippage ? BigInt(Math.round(amountOutMin[0] - ((slippage / 100) * amountOutMin[0]))).toString() : amountOutMin[0];
        const amountBMin = slippage ? BigInt(Math.round(amountOutMin[1] - ((slippage / 100) * amountOutMin[1]))).toString() : amountOutMin[1];

        // Initializing the account
        const account = await isValidStellarAccount(stllrWeb3, from);
        if (!account) return throwErrorMessage("invalidUserAddress");

        const poolShareAsset = new LiquidityPoolAsset(
            parsedTokens.tokenA,
            parsedTokens.tokenB,
            LiquidityPoolFeeV18,
        );

        const poolId = getPoolId(poolShareAsset);
        const { TESTNET, PUBLIC } = Networks;

        // Building transaction for withdrawing liquidity
        const transaction = new TransactionBuilder(account, {
            fee: BASE_FEE,
            networkPassphrase: dexId === "2401" ? TESTNET : PUBLIC
        })
            .addOperation(
                Operation.liquidityPoolWithdraw({
                    liquidityPoolId: poolId,
                    amount: formatTokenUnit(liquidity),
                    minAmountA: formatTokenUnit(amountAMin),
                    minAmountB: formatTokenUnit(amountBMin)
                  }),
            )
            .setTimeout(100)
            .build();

        return { chainId, from, gas: BASE_FEE, data: transaction.toEnvelope().toXDR('base64') };
    },
    
    removeLiquidityOrca: async (solWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "removeOrca()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return validJson;
        }

        const { from, path, liquidity, dexId } = filterOptions;
        let { slippage, positionAddress } = filterOptions;
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
            positionAddress = new web3.PublicKey(positionAddress);
        } catch (error) {
            return throwErrorMessage("invalidSPLToken");
        }

        // Set the slippage
        slippage = Percentage.fromFraction(slippage || 2, 100);

        try {

            const position = await client.getPosition(positionAddress);

            const whirlpool = await client.getPool(position.getData().whirlpool);

            const positionTokenAccount = await deriveATA(
                keypair,
                position.getData().positionMint
            );

            const deltaLiquidity = new BN(liquidity);

            const [outputTokenATA, inputTokenATA] = await Promise.all([
                deriveATA(keypair, outputToken.mint),
                deriveATA(keypair, inputToken.mint)
            ]);

            // get the data
            const whirlpoolData = whirlpool.getData();

            // Obtain remove estimation
            const quote = decreaseLiquidityQuoteByLiquidityWithParams({
                sqrtPrice: whirlpoolData.sqrtPrice,
                tickCurrentIndex: whirlpoolData.tickCurrentIndex,
                tickLowerIndex: position.getData().tickLowerIndex,
                tickUpperIndex: position.getData().tickUpperIndex,
                // Liquidity to be withdrawn
                liquidity: deltaLiquidity,
                // Acceptable slippage
                slippageTolerance: slippage,
            });

            // get the lower tick pubkey
            const tickArrayLowerPubkey = PDAUtil.getTickArrayFromTickIndex(
                position.getData().tickLowerIndex, whirlpool.data.tickSpacing,
                position.getData().whirlpool, context.program.programId)
                .publicKey;

            // get the upper tick pubkey
            const tickArrayUpperPubkey = PDAUtil.getTickArrayFromTickIndex(
                position.getData().tickUpperIndex, whirlpool.data.tickSpacing,
                position.getData().whirlpool, context.program.programId)
                .publicKey;

            // Craft the transaction
            const decreaseTx = await program.methods.decreaseLiquidity(
                quote.liquidityAmount, quote.tokenMinA, quote.tokenMinB)
                .accounts({
                    whirlpool: whirlpool.getAddress(),
                    tokenProgram: TOKEN_PROGRAM_ID,
                    positionAuthority: keypair,
                    position: position.getAddress(),
                    positionTokenAccount,
                    tokenOwnerAccountA: inputTokenATA,
                    tokenOwnerAccountB: outputTokenATA,
                    tokenVaultA: whirlpool.getData().tokenVaultA,
                    tokenVaultB: whirlpool.getData().tokenVaultB,
                    tickArrayLower: tickArrayLowerPubkey,
                    tickArrayUpper: tickArrayUpperPubkey
                })
                .transaction();

            const { blockhash } = await solWeb3.getLatestBlockhash('finalized');
            decreaseTx.recentBlockhash = blockhash;
            decreaseTx.feePayer = keypair;

            const transactionBuffer = decreaseTx.serialize({
                requireAllSignatures: false,
                verifySignatures: false
            });

            const response = {
                chainId: config.dex[dexId].chainId,
                from: keypair.toBase58(),
                to: programId.toBase58(),
                data: Buffer.from(transactionBuffer).toString("base64"),
            };

            // Return the transaction
            return response;

        } catch (error) {
            return throwErrorMessage("poolNotFound");
        }
    }

};
