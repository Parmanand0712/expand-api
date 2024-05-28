/* eslint-disable no-unused-vars */
/* 
 * All the function in this file
 * should be returning the following schema
 * 
 * 
    {
        "transactionHash": "0x61f77b95990e4facfaee10b993e9c68cc5d8a8c74ebbcbc122011c5e79afa9cc"
    }  
 */

const { web3, AnchorProvider, Program, BN } = require("@project-serum/anchor");
const { TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction, createSyncNativeInstruction,
  createCloseAccountInstruction, NATIVE_MINT }
  = require("@solana/spl-token");
const { buildWhirlpoolClient, PDAUtil, swapQuoteByInputToken, WhirlpoolContext } = require("@orca-so/whirlpools-sdk");
const { deriveATA, Percentage } = require("@orca-so/common-sdk");
const { Transaction, SystemProgram } = require('@solana/web3.js');
const { BalancerSDK } = require('@balancer-labs/sdk');
const { parseFixed } = require('@ethersproject/bignumber');
const { default: axios } = require('axios');
const TonWeb = require('tonweb');
const { Router , ROUTER_REVISION , ROUTER_REVISION_ADDRESS} = require('@ston-fi/sdk');
const {getHttpEndpoint} = require('@orbs-network/ton-access');
const { TransactionBuilder, BASE_FEE, Networks, Operation } = require('stellar-sdk');
const { getWhirpool } = require("./utils");
const idl = require("../../../assets/abis/orca.json");
const Common = require("../../../common/common");
const uniswapV3SwapAbi = require('../../../assets/abis/uniswapV3Swap.json');
const schemaValidator = require("../../../common/configuration/schemaValidator");
const uniswapXReactorAbi = require("../../../assets/abis/uniswapXReactor.json");
const { getPriceUniswapV2, getPriceSushiswapV2, getPricePancakeV2, getPriceCurveV2, getPriceUniswapV3 } = require('./getPrice');
const traderJoeQuoter = require('../../../assets/abis/traderJoeQuoter.json');
const traderJoeRouter = require('../../../assets/abis/LBRouter.json');
const { getGasPrice } = require('../chain/index');
const config = require("../../../common/configuration/config.json");
const errorMessage = require('../../../common/configuration/errorMessage.json');
const { isValidContractAddress, isValidStellarAccount } = require('../../../common/contractCommon');
const { getABIFile } = require('../../../common/curveCommon');
require("dotenv").config({ path: '../../../.env' });
const {payloadModifier} = require('../../../common/tonHelper');
const { formatTokenUnit, getStellarAssets } = require('../../../common/stellarCommon');

const throwErrorMessage = (msg) => ({
  'message': errorMessage.error.message[msg],
  'code': errorMessage.error.code.invalidInput
});

module.exports = {

  swapUniswapV2: async (evmWeb3, options) => {

    const filterOptions = options;
    filterOptions.function = "swapUniswapV2()";
    const validJson = await schemaValidator.validateInput(options);

    if (!validJson.valid) {
      return validJson;
    }

    filterOptions.routerAddress = await config.dex[filterOptions.dexId].routerAddress;
    const swapPrice = await getPriceUniswapV2(evmWeb3, {
      path: filterOptions.path, amountIn: filterOptions.amountIn
      , dexId: filterOptions.dexId
    }).then(res => res.amountsOut[1]);

    filterOptions.amountOutMin = (filterOptions.slippage === undefined) ? filterOptions.amountOutMin
      : BigInt(Math.round(swapPrice - ((filterOptions.slippage / 100) * swapPrice))).toString();

    let data = {};
    if (filterOptions.involveBaseToken === '1') {
      data = await Common.encodeFunctionData(evmWeb3, {
        functionHash: "0x7ff36ab5",
        parametersType: ["uint256", "address[]", "address", "uint256"],
        parameters: [
          filterOptions.amountOutMin,
          filterOptions.path,
          filterOptions.to,
          filterOptions.deadline,
        ],
      });
      filterOptions.value = filterOptions.amountIn;
    }
    else if (filterOptions.involveBaseToken === '2') {
      data = await Common.encodeFunctionData(evmWeb3, {
        functionHash: "0x18cbafe5",
        parametersType: ["uint256", "uint256", "address[]", "address", "uint256"],
        parameters: [
          filterOptions.amountIn,
          filterOptions.amountOutMin,
          filterOptions.path,
          filterOptions.to,
          filterOptions.deadline,
        ],
      });
      filterOptions.value = "0";
    }
    else {
      data = await Common.encodeFunctionData(evmWeb3, {
        functionHash: "0x38ed1739",
        parametersType: ["uint256", "uint256", "address[]", "address", "uint256"],
        parameters: [
          filterOptions.amountIn,
          filterOptions.amountOutMin,
          filterOptions.path,
          filterOptions.to,
          filterOptions.deadline,
        ],
      });
      filterOptions.value = "0";
    }


    const transactionObject = {
      chainId: filterOptions.chainId,
      from: filterOptions.from,
      to: filterOptions.routerAddress,
      value: filterOptions.value,
      gas: filterOptions.gas,
      data,
    };

    if (filterOptions.gasPriority !== undefined) {
      transactionObject.gasPrice = await getGasPrice(evmWeb3, {
        gasPriority: filterOptions.gasPriority
      }).then(res => res.gasPrice);
    }

    return (transactionObject);
  }
  ,

  swapSushiswapV2: async (evmWeb3, options) => {

    const filterOptions = options;
    filterOptions.function = "swapUniswapV2()";
    const validJson = await schemaValidator.validateInput(options);

    if (!validJson.valid) {
      return validJson;
    }

    filterOptions.routerAddress = await config.dex[filterOptions.dexId].routerAddress;
    const swapPrice = await getPriceSushiswapV2(evmWeb3, {
      path: filterOptions.path, amountIn: filterOptions.amountIn
      , dexId: filterOptions.dexId
    }).then(res => res.amountsOut[1]);

    filterOptions.amountOutMin = (filterOptions.slippage === undefined) ? filterOptions.amountOutMin
      : BigInt(Math.round(swapPrice - ((filterOptions.slippage / 100) * swapPrice))).toString();

    let data = {};
    if (filterOptions.involveBaseToken === '1') {
      data = await Common.encodeFunctionData(evmWeb3, {
        functionHash: "0x7ff36ab5",
        parametersType: ["uint256", "address[]", "address", "uint256"],
        parameters: [
          filterOptions.amountOutMin,
          filterOptions.path,
          filterOptions.to,
          filterOptions.deadline,
        ],
      });
      filterOptions.value = filterOptions.amountIn;
    }
    else if (filterOptions.involveBaseToken === '2') {
      data = await Common.encodeFunctionData(evmWeb3, {
        functionHash: "0x18cbafe5",
        parametersType: ["uint256", "uint256", "address[]", "address", "uint256"],
        parameters: [
          filterOptions.amountIn,
          filterOptions.amountOutMin,
          filterOptions.path,
          filterOptions.to,
          filterOptions.deadline,
        ],
      });
      filterOptions.value = "0";
    }
    else {
      data = await Common.encodeFunctionData(evmWeb3, {
        functionHash: "0x38ed1739",
        parametersType: ["uint256", "uint256", "address[]", "address", "uint256"],
        parameters: [
          filterOptions.amountIn,
          filterOptions.amountOutMin,
          filterOptions.path,
          filterOptions.to,
          filterOptions.deadline,
        ],
      });
      filterOptions.value = "0";
    }

    const transactionObject = {
      chainId: filterOptions.chainId,
      from: filterOptions.from,
      to: filterOptions.routerAddress,
      value: filterOptions.value,
      gas: filterOptions.gas,
      data,
    };

    if (filterOptions.gasPriority !== undefined) {
      transactionObject.gasPrice = await getGasPrice(evmWeb3, {
        gasPriority: filterOptions.gasPriority
      }).then(res => res.gasPrice);
    }

    return (transactionObject);
  },

  swapPancakeV2: async (evmWeb3, options) => {

    const filterOptions = options;
    filterOptions.function = "swapUniswapV2()";
    const validJson = await schemaValidator.validateInput(options);

    if (!validJson.valid) {
      return validJson;
    }

    filterOptions.routerAddress = await config.dex[filterOptions.dexId].routerAddress;
    const swapPrice = await getPricePancakeV2(evmWeb3, {
      path: filterOptions.path, amountIn: filterOptions.amountIn
      , dexId: filterOptions.dexId
    }).then(res => res.amountsOut[1]);


    filterOptions.amountOutMin = (filterOptions.slippage === undefined) ? filterOptions.amountOutMin
      : BigInt(Math.round(swapPrice - ((filterOptions.slippage / 100) * swapPrice))).toString();

    let data = {};
    if (filterOptions.involveBaseToken === '1') {
      data = await Common.encodeFunctionData(evmWeb3, {
        functionHash: "0x7ff36ab5",
        parametersType: ["uint256", "address[]", "address", "uint256"],
        parameters: [
          filterOptions.amountOutMin,
          filterOptions.path,
          filterOptions.to,
          filterOptions.deadline,
        ],
      });
      filterOptions.value = filterOptions.amountIn;
    }
    else if (filterOptions.involveBaseToken === '2') {
      data = await Common.encodeFunctionData(evmWeb3, {
        functionHash: "0x18cbafe5",
        parametersType: ["uint256", "uint256", "address[]", "address", "uint256"],
        parameters: [
          filterOptions.amountIn,
          filterOptions.amountOutMin,
          filterOptions.path,
          filterOptions.to,
          filterOptions.deadline,
        ],
      });
      filterOptions.value = "0";
    }
    else {
      data = await Common.encodeFunctionData(evmWeb3, {
        functionHash: "0x38ed1739",
        parametersType: ["uint256", "uint256", "address[]", "address", "uint256"],
        parameters: [
          filterOptions.amountIn,
          filterOptions.amountOutMin,
          filterOptions.path,
          filterOptions.to,
          filterOptions.deadline,
        ],
      });
      filterOptions.value = "0";
    }

    const transactionObject = {
      chainId: filterOptions.chainId,
      from: filterOptions.from,
      to: filterOptions.routerAddress,
      value: filterOptions.value,
      gas: filterOptions.gas,
      data,
    };

    if (filterOptions.gasPriority !== undefined) {
      transactionObject.gasPrice = await getGasPrice(evmWeb3, {
        gasPriority: filterOptions.gasPriority
      }).then(res => res.gasPrice);
    }

    return (transactionObject);
  },

  swapUniswapV3: async (evmWeb3, options) => {

    const filterOptions = options;
    filterOptions.function = "swapUniswapV3()";
    const validJson = await schemaValidator.validateInput(options);

    if (!validJson.valid) {
      return validJson;
    }


    filterOptions.routerAddress = await config.dex[filterOptions.dexId].swapAddress;
    let data = {};
    const multicall = [];
    const swapInputSupportedDex = config.tokenHoldersRpcDexes.slice(1);

    if (!(/^\+?\d+$/.test(filterOptions.amountOutMin))) return {
      'message': `Error: invalid BigNumber string (argument="${"value"}", value="${filterOptions.amountOutMin}"
      ,code=INVALID_ARGUMENT, version=bignumber/5.7.0)`,
      'code': errorMessage.error.code.invalidInput
    };

    const swapper = new evmWeb3.eth.Contract(uniswapV3SwapAbi, filterOptions.routerAddress);

    const amountOutData = await getPriceUniswapV3(evmWeb3, {
      path: filterOptions.path, amountIn: filterOptions.amountIn
      , dexId: filterOptions.dexId
    }).then(res => res.amountsOut[1]);

    filterOptions.amountOutMin = (filterOptions.slippage === undefined) ? amountOutData
      : BigInt(Math.round(amountOutData - ((filterOptions.slippage / 100) * amountOutData))).toString();

    if (filterOptions.involveBaseToken === '1' || filterOptions.involveBaseToken === '2') {
      const payload = {
        'tokenIn': filterOptions.path[0],
        'tokenOut': filterOptions.path[1],
        'fee': filterOptions.poolFees.toString(),
        'recipient': (filterOptions.involveBaseToken === '1') ? filterOptions.to : filterOptions.routerAddress,
        'amountIn': filterOptions.amountIn.toString(),
        'amountOutMinimum': filterOptions.amountOutMin,
        'sqrtPriceLimitX96': '0'
      };
      const swap = swapper.methods.exactInputSingle(payload).encodeABI();
      multicall.push(swap);
      if (filterOptions.involveBaseToken === '1') {
        const refundEth = swapper.methods.refundETH().encodeABI();
        multicall.push(refundEth);
        filterOptions.value = filterOptions.amountIn;
      } else {
        const unwrapEth = swapper.methods.unwrapWETH9(filterOptions.amountOutMin.toString(), filterOptions.to).encodeABI();
        multicall.push(unwrapEth);
        filterOptions.value = '0';
      }
      data = await Common.encodeFunctionData(evmWeb3, {
        "functionHash": "0xac9650d8",
        "parametersType": ["bytes[]",],
        "parameters": [multicall]
      });
    } else if (!(swapInputSupportedDex.includes(filterOptions.dexId))) {
      const swap = await Common.encodeFunctionData(evmWeb3, {
        functionHash: "0x472b43f3",
        parametersType: ["uint256", "uint256", "address[]", "address"],
        parameters: [
          filterOptions.amountIn,
          filterOptions.amountOutMin,
          filterOptions.path,
          filterOptions.to,
        ],
      });

      data = await Common.encodeFunctionData(evmWeb3, {
        "functionHash": "0xac9650d8",
        "parametersType": ["bytes[]",],
        "parameters": [[swap]]
      });
      filterOptions.value = '0';
    }
    else {
      // Added Exact Input Single with Valid Inputs for Binance , Polygon and Avalanche
      const payload = {
        'tokenIn': filterOptions.path[0],
        'tokenOut': filterOptions.path[1],
        'fee': filterOptions.poolFees,
        'recipient': filterOptions.to,
        'amountIn': filterOptions.amountIn,
        'amountOutMinimum': filterOptions.amountOutMin,
        'sqrtPriceLimitX96': '0'
      };

      // Encoding the data using exactInputSingle to be called from swapAddress
      data = swapper.methods.exactInputSingle(payload).encodeABI();

      // Setting the value as 0 so that no Eth get passed to the Contract
      filterOptions.value = '0';
    }



    const transactionObject = {
      chainId: filterOptions.chainId,
      from: filterOptions.from,
      to: filterOptions.routerAddress,
      value: filterOptions.value,
      gas: filterOptions.gas,
      data,
    };

    if (filterOptions.gasPriority !== undefined) {
      transactionObject.gasPrice = await getGasPrice(evmWeb3, {
        gasPriority: filterOptions.gasPriority
      }).then(res => res.gasPrice);
    }

    return (transactionObject);
  },

  swapTraderJoe: async (evmWeb3, options) => {

    const filterOptions = options;
    filterOptions.function = "swapTraderJoe()";
    const validJson = await schemaValidator.validateInput(options);

    if (!validJson.valid) {
      return validJson;
    }

    let data = {};
    const quoteData = {};
    filterOptions.routerAddress = await config.dex[filterOptions.dexId].routerAddress;
    filterOptions.quoterAddress = await config.dex[filterOptions.dexId].quoterAddress;
    const router = new evmWeb3.eth.Contract(traderJoeRouter, filterOptions.routerAddress);
    const quoter = new evmWeb3.eth.Contract(traderJoeQuoter, filterOptions.quoterAddress);

    const routeData = await quoter.methods.findBestPathFromAmountIn(filterOptions.path, filterOptions.amountIn).call();
    // eslint-disable-next-line prefer-destructuring
    quoteData.pairBinSteps = routeData.binSteps;
    quoteData.versions = routeData.versions;
    quoteData.tokenPath = routeData.route;

    filterOptions.amountOutMin = (filterOptions.slippage === undefined) ? filterOptions.amountOutMin
      : Math.round(filterOptions.amountOutMin - ((filterOptions.slippage / 100) * filterOptions.amountOutMin)).toString();

    if (filterOptions.involveBaseToken === '1') {
      data = await router.methods.swapExactNATIVEForTokens(
        filterOptions.amountOutMin,
        quoteData,
        filterOptions.to,
        filterOptions.deadline,
      ).encodeABI();
      filterOptions.value = filterOptions.amountIn;
    }
    else if (filterOptions.involveBaseToken === '2') {

      data = await router.methods.swapExactTokensForNATIVE(
        filterOptions.amountIn,
        filterOptions.amountOutMin,
        quoteData,
        filterOptions.to,
        filterOptions.deadline,
      ).encodeABI();

      filterOptions.value = "0";
    }
    else {
      data = await router.methods.swapExactTokensForTokens(
        filterOptions.amountIn,
        filterOptions.amountOutMin,
        quoteData,
        filterOptions.to,
        filterOptions.deadline
      ).encodeABI();
      filterOptions.value = "0";
    }

    const transactionObject = {
      chainId: filterOptions.chainId,
      from: filterOptions.from,
      to: filterOptions.routerAddress,
      value: filterOptions.value,
      gas: filterOptions.gas,
      data,
    };

    if (filterOptions.gasPriority !== undefined) {
      transactionObject.gasPrice = await getGasPrice(evmWeb3, {
        gasPriority: filterOptions.gasPriority
      }).then(res => res.gasPrice);
    }

    return (transactionObject);
  },

  swapBalancerV2: async (evmWeb3, options) => {

    const filterOptions = options;
    filterOptions.function = "swapBalancerV2()";
    const validJson = await schemaValidator.validateInput(options);

    if (!validJson.valid) {
      return (validJson);
    }

    const balancerConfig = config.dex[options.dexId].balConfig;
    const balancer = new BalancerSDK(balancerConfig);

    await balancer.swaps.fetchPools();

    const route = await balancer.swaps.findRouteGivenIn({
      tokenIn: filterOptions.path[0],
      tokenOut: filterOptions.path[1],
      amount: filterOptions.amountIn,
      gasPrice: parseFixed('1', 9),
      maxPools: 4,
    });

    if (route.returnAmount.isZero()) {
      return throwErrorMessage("swapNotAvailable");
    }

    const maxSlippage = (filterOptions.slippage === undefined) ? 500 : (filterOptions.slippage * 100);

    const transactionAttributes = balancer.swaps.buildSwap({
      userAddress: filterOptions.from,
      swapInfo: route,
      kind: config.dex[filterOptions.dexId].defaultSwapKind, // 0 - givenIn, 1 - givenOut
      deadline: filterOptions.deadline,
      maxSlippage,
    });

    const { to, data } = transactionAttributes;
    const value = filterOptions.involveBaseToken === '1' ? filterOptions.amountIn : '0';



    const transactionObject = {
      "chainId": filterOptions.chainId,
      "from": filterOptions.from,
      "to": to,
      "value": value,
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

  swapCurveV2: async (evmWeb3, options) => {

    const filterOptions = options;
    filterOptions.function = "swapCurveV2()";
    const validJson = await schemaValidator.validateInput(options);

    if (!validJson.valid) {
      return (validJson);
    }

    const { dexId, path, amountIn, slippage, gas, gasPriority, involveBaseToken, from, chainId } = filterOptions;
    let { amountOutMin } = filterOptions;

    let curvePool = null;
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
    const { poolAddress, poolName, tokenAddresses } = curvePool;

    const amountOut = await getPriceCurveV2(evmWeb3, { path, amountIn, dexId }).then(res => res.amountsOut[1]);

    amountOutMin = (slippage === undefined) ? amountOut
      : BigInt(Math.round(amountOut - ((slippage / 100) * amountOut))).toString();

    if (Number(amountOut) < Number(amountOutMin)) return throwErrorMessage("lowAmountOut");

    // calculate i, j

    let i = null;
    let j = null;

    const poolABI = await getABIFile(poolName);
    const curveV2PoolContract = new evmWeb3.eth.Contract(poolABI, poolAddress);

    for (let k = 0; k < tokenAddresses.length; k += 1) {
      // eslint-disable-next-line no-await-in-loop
      const poolToken = await curveV2PoolContract.methods.coins(k).call();
      if (poolToken.toLowerCase() === path[0].toLowerCase()) i = k;
      if (poolToken.toLowerCase() === path[1].toLowerCase()) j = k;
    }

    const data = await Common.encodeFunctionData(evmWeb3, {
      "functionHash": "0x3df02124",
      "parametersType": ["uint128", "uint128", "uint256", "uint256"],
      "parameters": [i, j, amountIn, amountOutMin]
    });

    const value = involveBaseToken === '1' ? amountIn : '0';

    const transactionObject = {
      chainId,
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

  swapUniswapX: async (evmWeb3, options) => {
    const filterOptions = options;
    filterOptions.function = "swapUniswapX()";
    const validJson = await schemaValidator.validateInput(options);

    if (!validJson.valid) {
      return validJson;
    }

    const { dexId, serializedOrder, signature, from, gasPriority, gas } = filterOptions;

    const { reactorAddress } = config.dex[dexId];
    const reactorContract = new evmWeb3.eth.Contract(
      uniswapXReactorAbi,
      reactorAddress
    );

    const data = reactorContract.methods.execute([serializedOrder, signature]).encodeABI();

    const transactionObject = {
      from,
      to: reactorAddress,
      gas,
      value: '0',
      data,
    };

    if (gasPriority !== undefined) {
      transactionObject.gasPrice = await getGasPrice(evmWeb3, {
        gasPriority
      }).then(res => res.gasPrice);
    }

    return transactionObject;
  },

  swap1inch: async (evmWeb3, options) => {
    const filterOptions = options;
    filterOptions.function = "swap1inch()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
      return validJson;
    }

    const { dexId, amountIn, from, slippage, path, gasPriority } = filterOptions;
    let response;

    const axiosConfig = {
      method: "get",
      url: `${config.dex[dexId].baseUrl}swap?src=${path[0]
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
    const transactionObject = response.data.tx;

    transactionObject.gas = filterOptions.gas ? filterOptions.gas : transactionObject.gas;
    if (gasPriority !== undefined) {
      transactionObject.gasPrice = await getGasPrice(evmWeb3, {
        gasPriority
      }).then(res => res.gasPrice);
    }
    return transactionObject;
  },

  swap0x: async (evmWeb3, options) => {

    let filterOptions = options;
    filterOptions.function = "swap0x()";
    const validJson = await schemaValidator.validateInput(options);

    if (!validJson.valid) {
      return validJson;
    }

    const baseUrl = config.dex[filterOptions.dexId].apiBaseUrl;
    filterOptions.slippage = (filterOptions.slippage === undefined) ? 0.01 : (parseFloat(Number(filterOptions.slippage) / 100));
    const apiConfig = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${baseUrl}quote?sellToken=${filterOptions.path[0]}&buyToken=${filterOptions.path[1]}` +
        `&sellAmount=${filterOptions.amountIn}&slippagePercentage=${filterOptions.slippage}`
      ,
      headers: {
        "0x-api-key": process.env['0x'],
      }
    };
    try {
      const res = await axios.request(apiConfig);
      const quote = res.data;
      filterOptions = { ...filterOptions, data: quote.data, to: quote.to, value: quote.value };
    } catch (err) {
      if (err.response.data) return err.response.data;
      return (err);
    }


    const transactionObject = {
      chainId: filterOptions.chainId,
      from: filterOptions.from,
      to: filterOptions.to,
      value: filterOptions.value,
      gas: filterOptions.gas,
      data: filterOptions.data,
    };

    if (filterOptions.gasPriority !== undefined) {
      transactionObject.gasPrice = await getGasPrice(evmWeb3, {
        gasPriority: filterOptions.gasPriority
      }).then(res => res.gasPrice);
    }

    return (transactionObject);
  },

  swapKyberswap: async (evmWeb3, options) => {
    const filterOptions = options;
    filterOptions.function = "swapKyberswap()";
    const validJson = await schemaValidator.validateInput(options);

    if (!validJson.valid) {
      return validJson;
    }

    const baseUrl = config.dex[filterOptions.dexId].apiBaseUrl;
    const { path, amountIn, involveBaseToken, from, to, gasPriority, gas } = filterOptions;
    let { amountOutMin, slippage } = filterOptions;

    if (!(/^\+?\d+$/.test(amountIn))) return {
      'message': `Error: invalid BigNumber string (argument="${"value"}", value="${amountIn}", code=INVALID_ARGUMENT, version=bignumber/5.7.0)`,
      'code': errorMessage.error.code.invalidInput
    };

    if (!(/^\+?\d+$/.test(amountOutMin))) return {
      'message': `Error: invalid BigNumber string (argument="${"value"}", value="${amountOutMin}", code=INVALID_ARGUMENT, version=bignumber/5.7.0)`,
      'code': errorMessage.error.code.invalidInput
    };

    const [isValidSrcToken, isValidDstToken, isValidFromAddress, isValidToAddress] = await Promise.all([
      isValidContractAddress(evmWeb3, path[0]),
      isValidContractAddress(evmWeb3, path[1]),
      isValidContractAddress(evmWeb3, from),
      isValidContractAddress(evmWeb3, to)
    ]);

    if (!isValidSrcToken) return throwErrorMessage("invalidSrcToken");
    if (!isValidDstToken) return throwErrorMessage("invalidDstToken");
    if (!isValidFromAddress || !isValidToAddress) return throwErrorMessage("invalidUserAddress");
    if (path[0] === path[1]) return throwErrorMessage("sameTokenSwap");

    const routeConfig = {
      method: 'get',
      url: `${baseUrl}routes?tokenIn=${path[0]}&tokenOut=${path[1]}&amountIn=${amountIn}`,
      headers: {
        'Accept': 'application/json',
      }
    };

    let quoteResponse;
    slippage = Math.ceil(slippage);
    try {
      quoteResponse = await axios.request(routeConfig);
      const amountOut = quoteResponse?.data?.data?.routeSummary?.amountOut || '0';
      amountOutMin = slippage ? BigInt(Math.round(amountOutMin - ((slippage / 100) * amountOutMin))).toString() : amountOutMin;

      if (Number(amountOut) < Number(amountOutMin)) return throwErrorMessage("lowAmountOut");
    } catch (err) {
      return throwErrorMessage("swapNotAvailable");
    }

    const txSummery = {
      'routeSummary': quoteResponse.data.data.routeSummary,
      'sender': from,
      'recipient': to,
      'slippageTolerance': Number(slippage)
    };

    const swapConfig = {
      method: 'post',
      url: `${baseUrl}route/build`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(txSummery)
    };

    let swapResponse;
    try {
      swapResponse = await axios.request(swapConfig);
    } catch (err) {
      if (err.response.data) {
        const errorObj = err.response.data;
        return ({
          'message': errorObj.details,
          'code': errorMessage.error.code.invalidInput
        });
      }
      return throwErrorMessage("swapNotAvailable");
    }
    const encodedData = swapResponse.data.data.data;
    const targetAddress = swapResponse.data.data.routerAddress;

    const transactionObject = {
      chainId: filterOptions.chainId,
      from,
      to: targetAddress,
      value: involveBaseToken === '1' ? amountIn : '0',
      gas,
      data: encodedData,
    };

    if (gasPriority !== undefined) {
      transactionObject.gasPrice = await getGasPrice(evmWeb3, {
        gasPriority
      }).then(res => res.gasPrice);
    }

    return (transactionObject);
  },

  swapStonFi: async (evmWeb3, options) => {

    const filterOptions = options;
    filterOptions.function = "swapStonFi()";
    const validJson = await schemaValidator.validateInput(options);

    if (!validJson.valid) {
      return validJson;
    }

    const { chainId, amountIn, slippage, from, path, queryId, referralAddress, involveBaseToken } = filterOptions;
    let { amountOutMin } = filterOptions;
    const tonweb = new TonWeb.HttpProvider();
    tonweb.host = await getHttpEndpoint({ network: config.chains[chainId].network });
    const { stonFiExtraGas } = config.chains[chainId];

    let transactionObject;
    if (!(/^\+?\d+$/.test(amountIn))) return {
      'message': `Error: invalid BigNumber string (argument="${"value"}" ,value="${amountIn}", code=INVALID_ARGUMENT, version=bignumber/5.7.0)`,
      'code': errorMessage.error.code.invalidInput
    };

    if (!(/^\+?\d+$/.test(amountOutMin))) return {
      'message': `Error: invalid BigNumber string (argument="${"value"}", value="${amountOutMin}", code=INVALID_ARGUMENT, version=bignumber/5.7.0)`,
      'code': errorMessage.error.code.invalidInput
    };

    amountOutMin = (slippage === undefined) ? amountOutMin
      : BigInt(Math.round(amountOutMin - ((slippage / 100) * amountOutMin))).toString();

    const router = new Router(tonweb, {
      revision: ROUTER_REVISION.V1,
      address: ROUTER_REVISION_ADDRESS.V1,
    });

    if (involveBaseToken === '0') {

      const swapTxParams = await router.buildSwapJettonTxParams({
        userfromAddress: from,
        offerJettonAddress: path[0],
        offerAmount: amountIn,
        askJettonAddress: path[1],
        minAskAmount: amountOutMin,
        queryId: (queryId === undefined || queryId === null) ? 0 : queryId,
        referralAddress,
      });

      transactionObject = {
        chainId,
        to: swapTxParams.to.toString(),
        value: (swapTxParams.gasAmount.add(TonWeb.utils.toNano(stonFiExtraGas))).toString(),
        message: await payloadModifier(swapTxParams.payload),
      };

    }
    else if (involveBaseToken === '1' || involveBaseToken === '2') {
      const swapTxParams = await router.buildSwapProxyTonTxParams({
        userfromAddress: from,
        proxyTonAddress: involveBaseToken === '1' ? path[0] : path[1],
        offerAmount: amountIn,
        askJettonAddress: involveBaseToken === '1' ? path[1] : path[0],
        minAskAmount: amountOutMin,
        queryId: (queryId === undefined || queryId === null) ? 0 : queryId,
        referralAddress,
      });

      transactionObject = {
        chainId,
        to: swapTxParams.to.toString(),
        value: (swapTxParams.gasAmount.add(TonWeb.utils.toNano(stonFiExtraGas))).toString(),
        message: await payloadModifier(swapTxParams.payload),
      };
    }

    return transactionObject;

  },

  swapOrca: async (solWeb3, options) => {

    const filterOptions = options;
    filterOptions.function = "swapOrca()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
      return validJson;
    }

    const { from, path, amountIn, dexId, closeWSolAccount } = filterOptions;
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
    } catch(error) {
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
    const inputAmount = new BN(amountIn);

    // Set the slippage
    slippage = Percentage.fromFraction(slippage || 2, 100);

    const NEBULA_WHIRLPOOLS_CONFIG = new web3.PublicKey(
      config.dex[dexId].nebula
    );

    // default spacing
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

    const mainTx = new Transaction();

    try {

      // Whirpool Object for Interacion
      const whirlpool = await client.getPool(pool);

      // Derive ATA of the Tokens
      const [outputTokenATA, inputTokenATA] = await Promise.all([
        deriveATA(keypair, outputToken.mint),
        deriveATA(keypair, inputToken.mint)
      ]);

      const [accInfoFirst, accInfoSecond] = await Promise.all([
        provider.connection.getAccountInfo(inputTokenATA),
        provider.connection.getAccountInfo(outputTokenATA)
      ]);

      if (!accInfoFirst) {
        mainTx.add(
          createAssociatedTokenAccountInstruction(
            keypair,
            inputTokenATA,
            keypair,
            inputToken.mint
          ),
          SystemProgram.transfer({
            fromPubkey: keypair,
            toPubkey: inputTokenATA,
            lamports: inputAmount,
          })
        );
        if (inputToken.mint.toBase58() === NATIVE_MINT.toBase58()) {
          mainTx.add(
            createSyncNativeInstruction(
              inputTokenATA
            )
          );
        }
      }

      if (!accInfoSecond) {
        mainTx.add(
          createAssociatedTokenAccountInstruction(
            keypair,
            outputTokenATA,
            keypair,
            outputToken.mint
          ),
          SystemProgram.transfer({
            fromPubkey: keypair,
            toPubkey: outputTokenATA,
            lamports: inputAmount,
          })
        );
        if (outputToken.mint.toBase58() === NATIVE_MINT.toBase58()) {
          mainTx.add(
            createSyncNativeInstruction(
              outputTokenATA
            )
          );
        }
      }

      // Fetch token Details
      // const outputTokenATAAccount = await context.fetcher.getTokenInfo(outputTokenATA);
      // const inputTokenATAAccount = await context.fetcher.getTokenInfo(inputTokenATA);

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

      // get oracle for Orca
      const oracle = PDAUtil.getOracle(programId, whirlpool.getAddress()).publicKey;

      // Build the swap_transaction
      const swapTransaction = await program.methods
        .swap(
          quote.amount,
          quote.otherAmountThreshold,
          quote.sqrtPriceLimit,
          quote.amountSpecifiedIsInput,
          quote.aToB
        )
        .accounts({
          tokenProgram: TOKEN_PROGRAM_ID,
          tokenAuthority: keypair,
          whirlpool: whirlpool.getAddress(),
          tokenVaultA: whirlpool.getData().tokenVaultA,
          tokenVaultB: whirlpool.getData().tokenVaultB,
          tokenOwnerAccountA: inputTokenATA,
          tokenOwnerAccountB: outputTokenATA,
          tickArray0: quote.tickArray0,
          tickArray1: quote.tickArray1,
          tickArray2: quote.tickArray2,
          oracle,
        })
        .instruction();

      mainTx.add(swapTransaction);

      if (inputToken.mint.toBase58() === NATIVE_MINT.toBase58() && closeWSolAccount) {
        mainTx.add(createCloseAccountInstruction(
          // TOKEN_PROGRAM_ID,
          inputTokenATA,
          keypair,
          keypair
        ));
      }

      if (outputToken.mint.toBase58() === NATIVE_MINT.toBase58() && closeWSolAccount) {
        mainTx.add(createCloseAccountInstruction(
          // TOKEN_PROGRAM_ID,
          outputTokenATA,
          keypair,
          keypair
        ));
      }


      const { blockhash } = await solWeb3.getLatestBlockhash('finalized');
      mainTx.recentBlockhash = blockhash;
      mainTx.feePayer = keypair;

      const transactionBuffer = mainTx.serialize({
        requireAllSignatures: false,
        verifySignatures: false
      });

      const txObject = {
        chainId: config.dex[dexId].chainId,
        from: keypair.toBase58(),
        to: programId.toBase58(),
        data: Buffer.from(transactionBuffer).toString("base64"),
      };

      // Return the transaction
      return txObject;

    } catch (error) {
      return throwErrorMessage("poolNotFound");
    }
  },

  swapJupiter: async (_, options) => {

    const filterOptions = options;
    filterOptions.function = "swapJupiter()";
    const validJson = await schemaValidator.validateInput(filterOptions);

    if (!validJson.valid) {
      return validJson;
    }

    const { dexId, amountIn, path } = filterOptions;
    let { from } = filterOptions;

    try {
      from = new web3.PublicKey(from);
    } catch (error) {
      return throwErrorMessage("invalidPublicKey");
    }

    let { slippage } = filterOptions;
    slippage = parseInt(slippage) || 1;

    try {
      const inputMint = new web3.PublicKey(path[0]);
      const outputMint =  new web3.PublicKey(path[1]);
      if (path[0] === path[1]) {
        return throwErrorMessage("sameTokenSwap");
      }
    } catch (error) {
      return throwErrorMessage("invalidSPLToken");
    }


    const quoteConfig = {
      method: "get",
      url: `${config.dex[dexId].jupEndpoint}quote?inputMint=${path[0]
        }&outputMint=${path[1]}&amount=${amountIn}&slippageBps=${slippage}`,
    };

    try {
      const quote = await axios(quoteConfig);

      const swapConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${config.dex[dexId].jupEndpoint}swap`,
        headers: {},
        data: JSON.stringify({
          quoteResponse: quote.data,
          userPublicKey: from,
          prioritizationFeeLamports: 'auto',
          asLegacyTransaction: true
        })
      };

      const swapTransaction = await axios(swapConfig);

      return {
        chainId: config.dex[dexId].chainId,
        from,
        to: config.dex[dexId].jupV6,
        data: swapTransaction.data.swapTransaction
      };


    } catch (error) {
      return {
        message: error.response.data.error,
        code: error.response.status
      };
    }
  },

  swapSDEX: async (stllrWeb3, options) => {

    const filterOptions = options;
    filterOptions.function = "swapSDEX()";
    const validJson = await schemaValidator.validateInput(options);

    if (!validJson.valid) {
      return validJson;
    }

    // Todo: Update schema for path
    const { chainId, dexId, amountIn, slippage, from, path } = filterOptions;
    let { amountOutMin } = filterOptions;
    // const { decimals } = config.chains[chainId];

    let parsedTokens;
    // Fetching tokens detail
    try {
      parsedTokens = await getStellarAssets(stllrWeb3, path);
    } catch (err) {
      return err;
    }

    const { tokenA, tokenB } = parsedTokens;
    amountOutMin = slippage ? BigInt(Math.round(amountOutMin - ((slippage / 100) * amountOutMin))).toString() : amountOutMin;
    
    // Initializing the account
    const account = await isValidStellarAccount(stllrWeb3, from);
    if (!account) return throwErrorMessage("invalidUserAddress");

    const { TESTNET, PUBLIC } = Networks;

    const response = await stllrWeb3.strictSendPaths(
      tokenA,
      formatTokenUnit(amountIn),
      [tokenB],
  ).call();
  const amountOut = response.records[0]?.destination_amount;
  if (!amountOut) return throwErrorMessage("poolNotFound");

    // Building transaction for swap
    let transaction = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: dexId === "2401" ? TESTNET : PUBLIC
    });

    if (tokenB.code !== "XLM") {
      const tokenBTrustline = account.balances.find(({ asset_code: assetCode, asset_issuer: assetIssuer }) => (
        assetCode === tokenB.code && assetIssuer === tokenB.issuer
        ));
        if (!tokenBTrustline || Number(tokenBTrustline?.limit) <= (Number(amountOut) + Number(tokenBTrustline?.balance))) {
          transaction = transaction.addOperation(Operation.changeTrust({
              asset: tokenB,
              limit: (Number(amountOut) + 1 + Number(tokenBTrustline?.balance || 0)).toString(),
          }));
      }
    };

    transaction = transaction.addOperation(Operation.pathPaymentStrictSend({
        sendAsset: tokenA,
        sendAmount: formatTokenUnit(amountIn),
        destination: from,
        destAsset: tokenB,
        destMin: formatTokenUnit(amountOutMin),
      }))
      .setTimeout(100)
      .build();

    return { chainId, from, gas: BASE_FEE, data: transaction.toEnvelope().toXDR('base64') };
  }
};
