/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* 
 * All the function in this file
 * should be returning the following schema
 * 
    standard schema of a price response
    {
        'amountIn': '100000000000000000',
        'path': [
            '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            '0xdac17f958d2ee523a2206206994597c13d831ec7',
            '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9'
        ],
        'amountsOut': [
            100000000000000000,
            207185834,
            64968311947989525
        ]
    }
 */

const { web3: web, AnchorProvider, BN } = require("@project-serum/anchor");
const { buildWhirlpoolClient, PDAUtil, swapQuoteByInputToken, WhirlpoolContext } = require("@orca-so/whirlpools-sdk");
const { Percentage } = require("@orca-so/common-sdk");
const { default: axios } = require('axios');
const { BalancerSDK } = require('@balancer-labs/sdk');
const { parseFixed } = require('@ethersproject/bignumber');
const { Address, beginCell } = require('@ton/ton');
const { getWhirpool } = require("./utils");
const uniswapV2RouterAbis = require('../../../assets/abis/uniswapV2Router.json');
const uniswapV3QuoterAbis = require('../../../assets/abis/uniswapV3Router.json');
const uniswapV3QuoterAvalanche = require('../../../assets/abis/UniswapV3QuoteAvalanche.json');
const traderJoeRouter = require('../../../assets/abis/LBRouter.json');
const traderJoeFactory = require('../../../assets/abis/LBFactory.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const errorMessage = require('../../../common/configuration/errorMessage.json');

const config = require('../../../common/configuration/config.json');
const { isValidContractAddress } = require('../../../common/contractCommon');
const { getABIFile } = require('../../../common/curveCommon');
const { getStellarAssets, formatTokenUnit } = require('../../../common/stellarCommon');

require("dotenv").config({ path: '../../../.env' });

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});


module.exports = {

    getPriceUniswapV2: async (web3, options) => {
        /*
         * Function will fetch the price from uniswap V2 Like DEX's
         */

        const filterOptions = options;
        filterOptions.function = "getPriceUniswapV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const response = {};
        filterOptions.routerAddress = await config.dex[filterOptions.dexId].routerAddress;

        const router = new web3.eth.Contract(
            uniswapV2RouterAbis,
            filterOptions.routerAddress
        );

        const price = await router.methods.getAmountsOut(
            filterOptions.amountIn,
            filterOptions.path
        ).call();

        response.amountIn = filterOptions.amountIn;
        response.path = filterOptions.path;
        response.amountsOut = price;

        return (response);

    },


    getPriceSushiswapV2: async (web3, options) => {
        /*
         * Function will fetch the price from uniswap V2 Like DEX's
         */

        const filterOptions = options;
        filterOptions.function = "getPriceUniswapV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const response = {};
        filterOptions.routerAddress = await config.dex[filterOptions.dexId].routerAddress;

        const router = new web3.eth.Contract(
            uniswapV2RouterAbis,
            filterOptions.routerAddress
        );

        const price = await router.methods.getAmountsOut(
            filterOptions.amountIn,
            filterOptions.path
        ).call();

        response.amountIn = filterOptions.amountIn;
        response.path = filterOptions.path;
        response.amountsOut = price;

        return (response);

    },


    getPricePancakeV2: async (web3, options) => {
        /*
         * Function will fetch the price from uniswap V2 Like DEX's
         */

        const filterOptions = options;
        filterOptions.function = "getPriceUniswapV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const response = {};
        filterOptions.routerAddress = await config.dex[filterOptions.dexId].routerAddress;

        const router = new web3.eth.Contract(
            uniswapV2RouterAbis,
            filterOptions.routerAddress
        );

        const price = await router.methods.getAmountsOut(
            filterOptions.amountIn,
            filterOptions.path
        ).call();

        response.amountIn = filterOptions.amountIn;
        response.path = filterOptions.path;
        response.amountsOut = price;

        return (response);

    },


    getPriceUniswapV3: async (web3, options) => {
        /*
         * Function will fetch the price from uniswap V3
         */

        const filterOptions = options;
        filterOptions.function = "getPriceUniswapV3()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const response = {};

        filterOptions.routerAddress = await config.dex[filterOptions.dexId].routerAddress;

        const amountsOut = [];
        amountsOut.push(filterOptions.amountIn);

        const uniswapV3RouterAbi = (!(config.excludedDefaultV3Abi.includes(filterOptions.dexId))) ? uniswapV3QuoterAbis : uniswapV3QuoterAvalanche;

        const quoter = await new web3.eth.Contract(
            uniswapV3RouterAbi,
            filterOptions.routerAddress
        );

        if (!(config.excludedDefaultV3Abi.includes(filterOptions.dexId))) {
            for (let index = 0; index < filterOptions.path.length - 1; index += 1) {
                // Iterate throught the complete given tokens in the path
                // eslint-disable-next-line no-await-in-loop
                const price = await quoter.methods.quoteExactInputSingle(filterOptions.path[index], filterOptions.path[index + 1],
                    filterOptions.poolFees, amountsOut[index], 0).call();
                amountsOut.push(price);
            }

            response.amountIn = filterOptions.amountIn;
            response.path = [filterOptions.path[0], filterOptions.path[filterOptions.path.length - 1]];
            response.amountsOut = amountsOut;

            return (response);
        }
        else {
            for (let index = 0; index < filterOptions.path.length - 1; index += 1) {
                // Iterate throught the complete given tokens in the path
                // eslint-disable-next-line no-await-in-loop
                const price = await quoter.methods.quoteExactInputSingle({
                    tokenIn: filterOptions.path[index], tokenOut: filterOptions.path[index + 1],
                    fee: filterOptions.poolFees, amountIn: amountsOut[index], sqrtPriceLimitX96: '0'
                }).call();
                amountsOut.push(price[0]);
            }

            response.amountIn = filterOptions.amountIn;
            response.path = [filterOptions.path[0], filterOptions.path[filterOptions.path.length - 1]];
            response.amountsOut = amountsOut;

            return (response);
        }

    },

    getPriceBalancerV2: async (web3, options) => {
        /*
         * Function will fetch the price from balancer pools
         */

        const filterOptions = options;
        filterOptions.function = "getPriceBalancerV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const { amountIn, path } = filterOptions;
        if (!(/^\+?\d+$/.test(amountIn))) return {
            'message': `Error: invalid BigNumber string (argument="${"value"}", value="${amountIn}", code=INVALID_ARGUMENT, version=bignumber/5.7.0)`,
            'code': errorMessage.error.code.invalidInput
        };

        const response = {};
        const amountsOut = [amountIn];

        if (config.dex[options.dexId].localName !== config.dex[options.dexId].dexName) {
            const balancerConfig = config.dex[options.dexId].balConfig;
            const balancer = new BalancerSDK(balancerConfig);
            await balancer.swaps.fetchPools();

            // Uses SOR to find optimal route for a trading pair and amount
            const route = await balancer.swaps.findRouteGivenIn({
                tokenIn: path[0],
                tokenOut: path[1],
                amount: amountIn,
                gasPrice: parseFixed('1', 9),
                // maxPools: 4,
            });

            if (route.returnAmount.isZero()) {
                return throwErrorMessage("swapNotAvailable");
            }

            amountsOut.push(route.returnAmount.toString());
            response.amountIn = amountIn;
            response.path = path;
            response.amountsOut = amountsOut;

            return response;
        }
        else {
            const dataParams = {
                "sellToken": path[0],
                "buyToken": path[1],
                "kind": "sell",
                "from": path[0],
                "receiver": path[0],
                "sellAmountAfterFee": amountIn,
                "partiallyFillable": false
            };

            const apiURL = config.dex[options.dexId].balConfigUrl;

            const params = {
                method: "post",
                url: apiURL,
                data: dataParams,
            };
            const quote = await axios(params);

            amountsOut.push(quote.data.quote.buyAmount.toString());
            response.amountIn = amountIn;
            response.path = path;
            response.amountsOut = amountsOut;

            return response;
        }
    },

    getPriceCurveV2: async (evmWeb3, options) => {
        /*
         * Function will fetch the price from balancer pools
         */

        const filterOptions = options;
        filterOptions.function = "getPriceCurveV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        const { dexId, amountIn, path } = filterOptions;
        const amountsOut = [amountIn];

        if (!validJson.valid) {
            return (validJson);
        }

        const response = {};
        let curvePool = null;

        // finding poolAddress
        const { curvePools } = config.dex[dexId];

        curvePools.every((pool) => {
            if (pool.tokenAddresses.includes(path[0].toLowerCase())
                && pool.tokenAddresses.includes(path[1].toLowerCase())) {
                curvePool = pool;
                return false;
            }
            return true;
        });

        if (curvePool === null) return throwErrorMessage("unSupportedPool");

        const poolABI = await getABIFile(curvePool.poolName);
        const curveV2PoolContract = new evmWeb3.eth.Contract(poolABI, curvePool.poolAddress);

        // calculate i, j
        const poolLength = curvePool.tokenAddresses.length;
        let i = null;
        let j = null;

        for (let k = 0; k < poolLength; k += 1) {
            // eslint-disable-next-line no-await-in-loop
            const poolToken = await curveV2PoolContract.methods.coins(k).call();
            if (poolToken.toLowerCase() === path[0].toLowerCase()) i = k;
            if (poolToken.toLowerCase() === path[1].toLowerCase()) j = k;
        }

        const expectedPrice = await curveV2PoolContract.methods.get_dy(i, j, amountIn).call();
        amountsOut.push(expectedPrice.toString());

        response.amountIn = amountIn;
        response.path = path;
        response.amountsOut = amountsOut;

        return response;
    },

    getPrice1inch: async (evmWeb3, options) => {
        /*
         * Function will fetch the price from 1inch
         */

        const filterOptions = options;
        filterOptions.function = "getPrice1inch()";
        const validJson = await schemaValidator.validateInput(filterOptions);
        const { amountIn, dexId, path, from, slippage } = filterOptions;
        const amountsOut = [amountIn];

        if (!validJson.valid) {
            return validJson;
        }

        let response;
        const axiosConfig = {
            method: "get",
            url: `${config.dex[dexId].baseUrl}quote?src=${path[0]
                }&dst=${path[1]}&amount=${amountIn}&from=${from}&slippage=${slippage}`,
            headers: {
                Authorization: `Bearer ${process.env['1inch']}`,
            },
        };
        try {
            response = await axios(axiosConfig);
        } catch (error) {
            return {
                message: error.response.data.description,
            };
        }
        amountsOut.push(response.data.toAmount.toString());
        return {
            amountIn,
            path,
            amountsOut
        };
    },



    getPrice0x: async (web3, options) => {
        /*
         * Function will fetch the price from 0x
         */

        const filterOptions = options;
        filterOptions.function = "getPrice0x()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const response = {};
        const baseUrl = config.dex[filterOptions.dexId].apiBaseUrl;
        const amountOut = [filterOptions.amountIn];
        const apiConfig = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${baseUrl}price?sellToken=${filterOptions.path[0]}&buyToken=${filterOptions.path[1]}&sellAmount=${filterOptions.amountIn}`,
            headers: {
                "0x-api-key": process.env['0x'],
            }
        };
        try {
            const res = await axios.request(apiConfig);
            response.amountIn = filterOptions.amountIn;
            response.path = filterOptions.path;
            amountOut.push(res.data.buyAmount);
            response.amountsOut = amountOut;
        } catch (err) {
            if (err.response.data) return err.response.data;
            return (err);
        }

        return (response);
    },

    getPriceKyberswap: async (web3, options) => {
        /*
         * Function will fetch the price from Kyberswap
         */

        const filterOptions = options;
        filterOptions.function = "getPriceKyberswap()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const response = {};
        const { amountIn, dexId, path } = filterOptions;
        const baseUrl = config.dex[dexId].apiBaseUrl;

        if (!(/^\+?\d+$/.test(amountIn))) return {
            'message': `Error: invalid BigNumber string (argument="${"value"}", value="${amountIn}", code=INVALID_ARGUMENT, version=bignumber/5.7.0)`,
            'code': errorMessage.error.code.invalidInput
        };
        const [isValidSrcToken, isValidDstToken] = await Promise.all([
            isValidContractAddress(web3, path[0]),
            isValidContractAddress(web3, path[1])
        ]);

        if (!isValidSrcToken) return throwErrorMessage("invalidSrcToken");
        if (!isValidDstToken) return throwErrorMessage("invalidDstToken");
        if (path[0] === path[1]) return throwErrorMessage("sameTokenSwap");

        const amountOut = [amountIn];
        const apiConfig = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${baseUrl}routes?tokenIn=${path[0]}&tokenOut=${path[1]}&amountIn=${amountIn}`,
            headers: {}
        };
        try {
            const res = await axios.request(apiConfig);
            response.amountIn = amountIn;
            response.path = path;
            amountOut.push(res.data.data.routeSummary.amountOut);
            response.amountsOut = amountOut;
        } catch (err) {
            return throwErrorMessage("swapNotAvailable");
        }

        return (response);
    },

    getPriceTraderJoe: async (web3, options) => {
        /*
         * Function will fetch the price from uniswap V2 Like DEX's
         */

        const filterOptions = options;
        filterOptions.function = "getPriceTraderJoe()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const response = {};
        filterOptions.routerAddress = await config.dex[filterOptions.dexId].routerAddress;
        filterOptions.factoryAddress = await config.dex[filterOptions.dexId].factoryAddress;
        const factory = new web3.eth.Contract(traderJoeFactory, filterOptions.factoryAddress);

        const poolData = await factory.methods.getAllLBPairs(filterOptions.path[0], filterOptions.path[1]).call();

        for (const pools of poolData) {
            if (poolData.length !== 1) {
                if (pools.createdByOwner === true) {
                    filterOptions.poolAddress = pools.LBPair;
                }
            }
            else if (pools.createdByOwner === false) {
                filterOptions.poolAddress = pools.LBPair;
            }
        }

        if (!filterOptions.poolAddress) return throwErrorMessage("swapNotAvailable");

        const router = new web3.eth.Contract(
            traderJoeRouter,
            filterOptions.routerAddress
        );

        const price = await router.methods.getSwapOut(
            filterOptions.poolAddress,
            filterOptions.amountIn,
            true
        ).call();

        if (price.amountInLeft !== '0') return throwErrorMessage("swapNotAvailable");

        response.amountIn = filterOptions.amountIn;
        response.path = filterOptions.path;
        response.amountsOut = price.amountOut;

        return (response);

    },
    getPriceStonFi: async (web3, options) => {
        /*
         * Function will fetch the price from uniswap V2 Like DEX's
         */

        const filterOptions = options;
        filterOptions.function = "getPriceStonFi()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const response = {};
        const { dexId, path, amountIn } = filterOptions;
        const { routerAddress } = await config.dex[dexId];

        if (!(/^\+?\d+$/.test(amountIn))) return {
            'message': `Error: invalid BigNumber string (argument="${"value"}" ,value="${amountIn}", code=INVALID_ARGUMENT, version=bignumber/5.7.0)`,
            'code': errorMessage.error.code.invalidInput
        };

        try {
            const [jettonAWalletAddress, jettonBWalletAddress] = ([
                await web3.runMethod(path[0]
                    , 'get_wallet_address', [{ type: "slice", cell: beginCell().storeAddress(Address.parse(routerAddress)).endCell() }]),
                await web3.runMethod(path[1]
                    , 'get_wallet_address', [{ type: "slice", cell: beginCell().storeAddress(Address.parse(routerAddress)).endCell() }])
            ]);

            const jettonA = await jettonAWalletAddress.stack.readCell().beginParse().loadAddress();
            const jettonB = await jettonBWalletAddress.stack.readCell().beginParse().loadAddress();

            const poolAddress = await web3.runMethod(routerAddress, 'get_pool_address',
                [{ type: "slice", cell: beginCell().storeAddress((jettonA)).endCell() }
                    , { type: "slice", cell: beginCell().storeAddress((jettonB)).endCell() }]);

            const pool = poolAddress.stack.readCell().beginParse().loadAddress();

            const price = await web3.runMethod(pool, 'get_expected_outputs', [
                { type: "int", value: parseInt(amountIn).toString() },
                { type: "slice", cell: beginCell().storeAddress(jettonA).endCell() }
            ]);

            response.amountIn = amountIn;
            response.path = path;
            response.amountsOut = [amountIn, BigInt(price.stack.items[0].value).toString()];

            return (response);
        }
        catch (err) {
            return throwErrorMessage("poolDoesNotExist");
        }

    },

    getPriceSDEX: async (stllrWeb3, options) => {
        /*
         * Function will fetch the price from Stellar DEX for given token pairs
         */

        const filterOptions = options;
        filterOptions.function = "getPriceKyberswap()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const { chainId, path, amountIn } = filterOptions;
        const { decimals } = config.chains[chainId];

        let parsedTokens;
        // Fetching tokens detail
        try {
            parsedTokens = await getStellarAssets(stllrWeb3, path);
        } catch (error) {
            return error;
        }

        try {
            const response = await stllrWeb3.strictSendPaths(
                parsedTokens.tokenA,
                formatTokenUnit(amountIn),
                [parsedTokens.tokenB],
            ).call();

            return {
                amountIn,
                path,
                amountsOut: [amountIn, (Number(response.records[0].destination_amount) * decimals).toFixed(0)]
            };

        } catch (err) {
            return throwErrorMessage("poolNotFound");
        }
    },
    
    getPriceOrca: async (solWeb3, options) => {

        const filterOptions = options;
        filterOptions.function = "priceOrca()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return validJson;
        }

        const { path, amountIn, dexId } = filterOptions;

        // Create Anchor provider
        const provider = new AnchorProvider(solWeb3, {}, {});

        // Initialize the Program
        const programId = new web.PublicKey(
            config.dex[dexId].programId
        );

        // Create the WhirpoolContext
        const context = WhirlpoolContext.withProvider(provider, programId);
        const client = buildWhirlpoolClient(context);

        let inputToken;
        let outputToken;

        try {
            inputToken = {
                mint: new web.PublicKey(path[0]),
            };
            outputToken = {
                mint: new web.PublicKey(path[1]),
            };
        } catch (error) {
            return throwErrorMessage("invalidSPLToken");
        }

        // Calculate Input amount
        const inputAmount = new BN(amountIn);

        const slippage = Percentage.fromFraction(1, 1000);

        const NEBULA_WHIRLPOOLS_CONFIG = new web.PublicKey(
            config.dex[dexId].nebula
        );

        let tickSpacing = 128;
        let pool;

        const whirlpoolInfo = await getWhirpool(path[0], path[1]);

        if (dexId === "2500" && whirlpoolInfo.length && !(whirlpoolInfo.status)) {
            tickSpacing = whirlpoolInfo[0].tickSpacing;
            pool = new web.PublicKey(whirlpoolInfo[0].pubkey);
            inputToken.mint = new web.PublicKey(whirlpoolInfo[0].tokenMintA);
            outputToken.mint = new web.PublicKey(whirlpoolInfo[0].tokenMintB);
        } else {
            tickSpacing = 128;
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


        try {
            // WHirpool Object for Interacion
            const whirlpool = await client.getPool(pool);

            // get swap quote
            const quote = await swapQuoteByInputToken(
                whirlpool,
                inputToken.mint,
                inputAmount,
                slippage,
                context.program.programId,
                context.fetcher,
                true
            );

            const response = {};

            response.amountIn = amountIn;
            response.path = path;
            response.amountsOut = [amountIn, quote.estimatedAmountOut.toString()];

            // Return the quote
            return response;
        } catch (error) {
            return throwErrorMessage("poolNotFound");
        }
    },
    getPriceJupiter: async (_, options) => {
        /*
         * Function will fetch the price from 1inch
         */

        const filterOptions = options;
        filterOptions.function = "getPriceJUP()";
        const validJson = await schemaValidator.validateInput(filterOptions);
        const { dexId, path, amountIn } = filterOptions;
        const slippage = 1;
        const amountsOut = [amountIn];

        if (!validJson.valid) {
            return validJson;
        }

        try {
            const inputMint = new web.PublicKey(path[0]);
            const outputMint = new web.PublicKey(path[1]);
            if (path[0] === path[1]) {
                return throwErrorMessage("sameTokenSwap");
            }
        } catch (error) {
            return throwErrorMessage("invalidSPLToken");
        }

        let response;
        const axiosConfig = {
            method: "get",
            url: `${config.dex[dexId].jupEndpoint}quote?inputMint=${path[0]
                }&outputMint=${path[1]}&amount=${amountIn}&slippageBps=${slippage}`,
        };
        try {
            response = await axios(axiosConfig);
        } catch (error) {
            return {
                message: error.response.data.error,
                code: error.response.status
            };
        }
        amountsOut.push(response.data.outAmount);
        return {
            amountIn,
            path,
            amountsOut
        };
    },
};
