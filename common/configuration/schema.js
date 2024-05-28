
/*
* For the functions under chain category, 
* the validation is set on the function level
* For example, for funciton getBlock() the request will be same, regardless of the chain ID and symbol 
* Whereas for all the other category, validations are broken one level down, i.e. to the protocol level
*
*/
const gas = { type: "string", "pattern": "^(\\d+?)$", errorMessage: 'Gas should be numeric value.' };
const slippage = { type: "string", "pattern": "^(10|10(\\.0+)|\\d(\\.\\d+)?)$" };
const gasPriority = { type: "string", enum: ["low", "medium", "high"] };
const market = { type: "string", enum: ["USDC", "WETH"], default: "USDC" };

const tokenCode =  {
    type: "string",
    pattern: "^[a-zA-Z0-9]*$",
    minLength: 1,
    maxLength: 12,
    "errorMessage": "Asset Code should be alphanumeric and less than 12 characters"
};

exports.jsonSchema = {

    type: "object",

    allOf: [


        /*
         * category = chain
         *
         */


        // Field Mapping for getTransaction() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getTransaction()" },
                }
            },
            then: {
                properties: {
                    transactionHash: { type: "string" },
                    chainId: { type: "string" },
                    chainSymbol: { type: "string", maxLength: 7, minLength: 3 },
                },
                required: ["transactionHash"]
            },
        },

        // Field Mapping for getTransactionTon() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getTransactionTon()" },
                }
            },
            then: {
                properties: {
                    transactionHash: { type: "string" },
                    address: { type: "string" },
                    chainId: { type: "string" },
                    chainSymbol: { type: "string", maxLength: 7, minLength: 3 },
                },
                required: ["transactionHash", "address"]
            },
        },

        // Field Mapping for getBlock() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getBlock()" },
                }
            },
            then: {
                properties: {
                    blockNumber: { type: "string" },
                    chainId: { type: "string" },
                    chainSymbol: { type: "string", maxLength: 7, minLength: 3 },
                },
                required: ["blockNumber"],
            },
        },

        // Field Mapping for getEvmBlock() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getEvmBlock()" },
                }
            },
            then: {
                properties: {
                    blockNumber: { type: "string", pattern: '^[0-9][0-9]*$', "errorMessage": "Value should be positive integer" },
                    startBlock: { type: "string", pattern: '^[0-9][0-9]*$', "errorMessage": "Value should be positive integer" },
                    endBlock: { type: "string", pattern: '^[1-9][0-9]*$', "errorMessage": "Value should be positive greater than 0" },
                    chainId: { type: "string" },
                    chainSymbol: { type: "string", maxLength: 7, minLength: 3 },
                },
                required: [],
            },
        },

        // Field Mapping for getFlashbotBlocks() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getFlashbotBlocks()" },
                }
            },
            then: {
                properties: {
                    chainId: { type: "string" },
                    chainSymbol: { type: "string", maxLength: 7, minLength: 3 },
                },
                required: [],
            },
        },

        // Field Mapping for getFlashbotTransactions() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getFlashbotTransactions()" },
                }
            },
            then: {
                properties: {
                    chainId: { type: "string" },
                    chainSymbol: { type: "string", maxLength: 7, minLength: 3 },
                },
                required: [],
            },
        },

        // Field Mapping for getFlashbotTransactions() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getFlashbotBundle()" },
                }
            },
            then: {
                properties: {
                    chainId: { type: "string" },
                    chainSymbol: { type: "string", maxLength: 7, minLength: 3 },
                    bundleHash: { type: "string" }
                },
                required: ["bundleHash"],
            },
        },

        // Field Mapping for postGeneric() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "postGeneric()" },
                }
            },
            then: {
                properties: {
                    contractAddress: { type: "string" },
                    chainId: { type: "string" },
                    chainSymbol: { type: "string", maxLength: 7, minLength: 3 },
                    parameters: { type: "array" },
                    methodName: { type: "string" },
                    abi: { type: "array" },
                    blockNumber: { type: "string", pattern: "^0*([1-9][1-9][0-9]{6,})$" }
                },
                required: ["contractAddress", "methodName"],
            },
        },


        // Field Mapping for getPublicRpc() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getPublicRpc()" },
                }
            },
            then: {
                properties: {
                    chainId: { type: "string" },
                    chainSymbol: { type: "string", maxLength: 7, minLength: 3 },
                },
                required: [],
            },
        },


        // Field Mapping for gettokenaddress

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getTokenAddress()" },
                }
            },
            then: {
                properties: {
                    chainId: { type: "string" },
                    chainSymbol: { type: "string", maxLength: 7, minLength: 3 },
                    tokenSymbol: { type: "string" }
                },
                required: ["tokenSymbol"],
            },
        },

        // Field Mapping for getBalance() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getBalance()" },
                }
            },
            then: {
                properties: {
                    address: { type: "string" },
                    chainId: { type: "string" },
                    chainSymbol: { type: "string", maxLength: 7, minLength: 3 },
                    tokenAddress: { type: "string" }
                },
                required: ["address"]
            },
        },

        // Field Mapping for getStorage() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getStorage()" },
                }
            },
            then: {
                properties: {
                    address: { type: "string" },
                    index: { type: "string" },
                    chainId: { type: "string" },
                    chainSymbol: { type: "string", maxLength: 7, minLength: 3 },
                },
                required: ["address"]
            },
        },

        // Field Mapping for getGasPrice() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getGasPrice()" },
                }
            },
            then: {
                properties: {
                    chainId: { type: "string" },
                    chainSymbol: { type: "string", maxLength: 7, minLength: 3 },
                    gasPriority,
                },
                required: []
            }
        },

        // Field Mapping for estimateGas() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "estimateGas()" },
                }
            },
            then: {
                properties: {
                    chainId: { type: "string" },
                    chainSymbol: { type: "string", maxLength: 7, minLength: 3 },
                    from: { type: "string" },
                    to: { type: "string" },
                    value: { type: "string", default: "0", pattern: '^[0-9][0-9]*$', "errorMessage": "Value should be positive integer" },
                    data: { type: "string" },
                },
                required: ["from", "to", "data"]
            }
        },

        // Field Mapping for getGasFees() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getGasFees()" },
                }
            },
            then: {
                properties: {
                    chainId: { type: "string", default: "1" },
                    chainSymbol: { type: "string", maxLength: 7, minLength: 3 },
                    startBlock: { type: "string" },
                    endBlock: { type: "string" },
                    address: { type: "string" },
                },
                required: ["address"]
            }
        },

        // Field Mapping for sendTransaction() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "sendTransaction()" },
                }
            },
            then: {
                properties: {
                    chainId: { type: "string" },
                    chainSymbol: { type: "string", maxLength: 7, minLength: 3 },
                    rawTransaction: { type: "string" },
                    bdnTransaction: { type: "boolean", default: false },
                    mevProtection: { type: "boolean", default: false },
                    privateTransaction: { type: "boolean", default: false },
                    transactionHash: { type: "string" }
                },
                required: ["rawTransaction"]
            }
        },


        // Field Mapping for decodeTransaction() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "decodeTransaction()" },
                }
            },
            then: {
                properties: {
                    chainId: { type: "string" },
                    chainSymbol: { type: "string", maxLength: 7, minLength: 3 },
                    rawTransaction: { type: "string" }
                },
                required: ["rawTransaction"]
            }
        },


        /*
         * category = Decentralised Exchanges
         *
         */


        // Field Mapping for getLiquidityUniswapV2Like() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getLiquidityUniswapV2()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    tokenA: { type: "string" },
                    tokenB: { type: "string" },
                    address: { type: "string" }
                },
                required: ["tokenA", "tokenB", "address"]
            }
        },

        // Field Mapping for getLiquidityStonFi() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getLiquidityStonFi()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    tokenA: { type: "string" },
                    tokenB: { type: "string" },
                    address: { type: "string" }
                },
                required: ["tokenA", "tokenB", "address"]
            }
        },

        // Field Mapping for getLiquidityTraderJoe() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getLiquidityTraderJoe()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    tokenA: { type: "string" },
                    tokenB: { type: "string" },
                    address: { type: "string" },
                    id: { type: "string" }
                },
                required: ["tokenA", "tokenB", "address", "id"]
            }
        },

        // Field Mapping for poolChartData() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "poolChartData()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    poolAddress: { type: "string" },
                    interval: { type: "string", enum: ["15", "30", "60", "90"], default: "15", errorMessage: 'Allowed Values are 15 , 30 ,60 , 90' },
                    function: {},
                },
                required: ["dexId", "poolAddress"],
                additionalProperties: false,
                errorMessage: "Allowed values are dexId, poolAddress , interval"
            }
        },
        // Field Mapping for poolTradeData() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "poolTradeData()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    poolAddress: { type: "string" },
                    startBlock: { type: "string", pattern: '^[1-9][0-9]*$', errorMessage: 'Value should be greater than 0' },
                    endBlock: { type: "string", pattern: '^[1-9][0-9]*$', errorMessage: 'Value should be greater than 0' },
                    eventType: {
                        type: "string", enum: ["Transfer", "Swap", "Burn", "Mint"], default: "Mint"
                        , errorMessage: 'Allowed Values are Transfer , Swap , Burn , Mint '
                    },
                    function: {},
                },
                required: ["dexId", "poolAddress"],
                additionalProperties: false,
                errorMessage: "Allowed values are dexId, poolAddress , startBlock , endBlock , eventType"
            }
        },

        // Field Mapping for getLiquidityUniswapV3Like() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getLiquidityUniswapV3()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    tokenId: { type: "string" }
                },
                required: ["tokenId"]
            }
        },

        // Field Mapping for getLiquiditySushiswapV2Like() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getLiquiditySushiswapV2()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    tokenA: { type: "string" },
                    tokenB: { type: "string" },
                    address: { type: "string" }
                },
                required: ["tokenA", "tokenB", "address"]
            }
        },

        // Field Mapping for getLiquidityPancakeswapV2Like() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getLiquidityPancakeswapV2()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    tokenA: { type: "string" },
                    tokenB: { type: "string" },
                    address: { type: "string" }
                },
                required: ["tokenA", "tokenB", "address"]
            }
        },

        // Field Mapping for getLiquidityBalancerV2Like() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getLiquidityBalancerV2()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    tokenA: { type: "string" },
                    tokenB: { type: "string" },
                    tokenC: { type: "string" },
                    address: { type: "string" }
                },
                required: ["tokenA", "tokenB", "address"]
            }
        },

        // Field Mapping for getLiquidityCurveV2Like() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getLiquidityCurveV2()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    tokenA: { type: "string" },
                    tokenB: { type: "string" },
                    tokenC: { type: "string" },
                    tokenD: { type: "string" },
                    address: { type: "string" }
                },
                required: ["tokenA", "tokenB", "address"]
            }
        },
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getPoolDex()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "array", minItems: 1 },
                    path: { type: "array", minItems: 2, maxItems: 2 },
                    amountIn: { type: "string" },
                },
                required: ["path", "amountIn", 'dexId']
            }
        },


        // Field Mapping for getPriceUniswapV2Like() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getPriceUniswapV2()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    path: { type: "array", minItems: 2, maxItems: 2 },
                    amountIn: { type: "string" },
                },
                required: ["path", "amountIn"]
            }
        },

        // Field Mapping for getPriceStonFi() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getPriceStonFi()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    path: { type: "array", minItems: 2 },
                    amountIn: { type: "string" },
                },
                required: ["path", "amountIn"]
            }
        },

        // Field Mapping for getPriceUniswapV3() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getPriceUniswapV3()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    path: { type: "array", minItems: 2, maxItems: 2 },
                    amountIn: { type: "string" },
                    poolFees: { type: "string", default: "3000" }
                },
                required: ["path", "amountIn"]
            }
        },

        // Field Mapping for getPriceTraderJoe() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getPriceTraderJoe()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    path: { type: "array", minItems: 2, maxItems: 2 },
                    amountIn: { type: "string" },
                },
                required: ["path", "amountIn"]
            }
        },

        // Field Mapping for BalancerV2() function
        // Field Mapping for getPriceBalancer() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getPriceBalancerV2()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    path: { type: "array", minItems: 2, maxItems: 2 },
                    amountIn: { type: "string" }
                },
                required: ["path", "amountIn"]
            }
        },

        // Field Mapping for getWalletPosition() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getWalletPosition()" },
                }
            },
            then: {
                properties: {
                    address: { type: "string" },
                    pageToken: { type: "string", default: "1", pattern: '^[1-9][0-9]*$', "errorMessage": "Value should be greater than 0" }
                },
                required: ["address"]
            }
        },

        // Field Mapping for addLiquidityBalancerV2() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "addLiquidityBalancerV2()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    path: { type: "array", minItems: 2 },
                    amountIn: { type: "array", minItems: 2 },
                    amountOut: { type: "string" },
                    fromInternalBalance: { type: "boolean" },
                    from: { type: "string" },
                    to: { type: "string" },
                    gas,
                    gasPriority,
                    slippage
                },
                required: ["path", "amountIn", "amountOut", "fromInternalBalance", "gas", "from", "to"]
            }
        },

        // Field Mapping for removeLiquidityBalancerV2() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "removeLiquidityBalancerV2()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    path: { type: "array", minItems: 2 },
                    amountOut: { type: "array", minItems: 2 },
                    amountIn: { type: "string" },
                    toInternalBalance: { type: "boolean" },
                    gas,
                    gasPriority,
                    from: { type: "string" },
                    to: { type: "string" },
                    slippage
                },
                required: ["path", "amountOut", "amountIn", "toInternalBalance", "gas", "from", "to"]
            }
        },

        // Field Mapping for swapBalancerV2() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "swapBalancerV2()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    path: { type: "array", minItems: 2, maxItems: 2 },
                    amountIn: { type: "string" },
                    from: { type: "string" },
                    deadline: { type: "string" },
                    gas,
                    gasPriority,
                    slippage,
                    involveBaseToken: { type: "string", enum: ["0", "1", "2"], default: "0" },
                },
                required: ["path", "amountIn", "from", "deadline", "gas"]
            }
        },

        // Field Mapping for addLiquidityCurveV2() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "addLiquidityCurveV2()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    path: { type: "array", minItems: 2 },
                    amountIn: { type: "array", minItems: 2 },
                    amountOut: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                    slippage
                },
                required: ["path", "amountIn", "amountOut", "gas", "from", "dexId"]
            }
        },

        // Field Mapping for removeLiquidityCurveV2() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "removeLiquidityCurveV2()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    path: { type: "array", minItems: 2 },
                    amountOut: { type: "array", minItems: 2 },
                    amountIn: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                    slippage
                },
                required: ["path", "amountIn", "amountOut", "gas", "from", "dexId"]
            }
        },

        // Field Mapping for getPriceCurveV2() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getPriceCurveV2()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    path: { type: "array", minItems: 2, maxItems: 2 },
                    amountIn: { type: "string" }
                },
                required: ["path", "amountIn"]
            }
        },

        // Field Mapping for swapCurveV2() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "swapCurveV2()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    path: { type: "array", minItems: 2, maxItems: 2 },
                    involveBaseToken: { type: "string", enum: ["0", "1", "2"], default: "0" },
                    amountIn: { type: "string" },
                    from: { type: "string" },
                    amountOutMin: { type: "string" },
                    gas,
                    gasPriority,
                    slippage
                },
                required: ["path", "amountIn", "from", "amountOutMin", "gas"]
            }
        },

        // Field Mapping for swapStargate() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "swapStargate()" },
                }
            },
            then: {
                properties: {
                    bridgeId: { type: "string" },
                    srcChainId: { type: "string" },
                    srcTokenSymbol: { type: "string" },
                    dstChainId: { type: "string" },
                    amountIn: { type: "string" },
                    from: { type: "string" },
                    amountOutMin: { type: "string" },
                    gas,
                    gasPriority,
                    to: { type: "string" },
                    dstTokenSymbol: { type: "string" },
                    slippage
                },
                required: ["srcTokenSymbol", "amountIn", "from", "amountOutMin", "gas", "dstChainId"]
            }
        },


        // Field Mapping for getLiquidityStargate() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getLiquidityStargate()" },
                }
            },
            then: {
                properties: {
                    bridgeId: { type: "string" },
                    poolAddress: { type: "string" },
                    address: { type: "string" },
                    srcChainId: { type: "string" }
                },
                required: ["poolAddress"]
            }
        },

        // Field Mapping for getTransactionStargate() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getTransactionStargate()" },
                }
            },
            then: {
                properties: {
                    bridgeId: { type: "string" },
                    transactionHash: { type: "string" },
                    network: { type: "string", enum: ["mainnet", "testnet"], default: "mainnet" },
                    srcChainId: { type: "string" }
                },
                required: ["transactionHash", "network"]
            }
        },

        // Field Mapping for addLiquidityStargate() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "addLiquidityStargate()" },
                }
            },
            then: {
                properties: {
                    bridgeId: { type: "string" },
                    srcChainId: { type: "string", default: '1' },
                    srcTokenSymbol: { type: "string" },
                    from: { type: "string" },
                    amountIn: { type: "string" },
                    gas,
                    gasPriority
                },
                required: ["srcTokenSymbol", "amountIn", "from", "gas"]
            }
        },

        // Field Mapping for addLiquidityStonFi() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "addLiquidityStonFi()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    tokenA: { type: "string" },
                    tokenB: { type: "string" },
                    amountADesired: { type: "string" },
                    amountBDesired: { type: "string" },
                    amountAMin: { type: "string" },
                    amountBMin: { type: "string" },
                    from: { type: "string" },
                    queryId: { type: "string" },
                    slippage,
                    gas: { type: "string" }
                },
                required: ["tokenA", "tokenB", "amountADesired", "amountBMin", "amountAMin", "amountBDesired", "from"]
            }
        },

        // Field Mapping for removeLiquidityStonFi() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "removeLiquidityStonFi()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    tokenA: { type: "string" },
                    tokenB: { type: "string" },
                    liquidity: { type: "string" },
                    from: { type: "string" },
                    queryId: { type: "string" },
                    gas: { type: "string" }
                },
                required: ["tokenA", "tokenB", "liquidity", "from"]
            }
        },
        // Field Mapping for refundLiquidityStonFi() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "refundLiquidityStonFi()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    tokenA: { type: "string" },
                    tokenB: { type: "string" },
                    from: { type: "string" },
                    queryId: { type: "string" },
                    gas: { type: "string" }
                },
                required: ["tokenA", "tokenB", "from"]
            }
        },

        // Field Mapping for swapStonFi() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "swapStonFi()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    path: { type: "array", minItems: 2 },
                    amountIn: { type: "string" },
                    amountOutMin: { type: "string" },
                    from: { type: "string" },
                    referralAddress: { type: "string" },
                    queryId: { type: "string" },
                    slippage,
                    involveBaseToken: { type: "string", enum: ["0", "1", "2"], default: "0" },
                    gas: { type: "string" }
                },
                required: ["path", "amountIn", "amountOutMin", "from"]
            }
        },

        // Field mapping for removeLiquidityStargate() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "removeLiquidityStargate()" },
                }
            },
            then: {
                properties: {
                    bridgeId: { type: "string" },
                    srcChainId: { type: "string", default: '1' },
                    srcTokenSymbol: { type: "string" },
                    from: { type: "string" },
                    amountOut: { type: "string" },
                    gas,
                    gasPriority
                },
                required: ["srcTokenSymbol", "amountOut", "from", "gas"]
            }
        },

        // Field Mapping for swapUniswapV2Like() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "swapUniswapV2()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    path: { type: "array", minItems: 2, maxItems: 2 },
                    amountIn: { type: "string" },
                    amountOutMin: { type: "string" },
                    to: { type: "string" },
                    involveBaseToken: { type: "string", enum: ["0", "1", "2"], default: "0" },
                    deadline: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                    slippage
                },
                required: ["path", "amountIn", "amountOutMin", "to", "deadline", "from", "gas"]
            }
        },

        // Field Mapping for swapTraderJoe() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "swapTraderJoe()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    path: { type: "array", minItems: 2, maxItems: 2 },
                    amountIn: { type: "string" },
                    amountOutMin: { type: "string" },
                    to: { type: "string" },
                    involveBaseToken: { type: "string", enum: ["0", "1", "2"], default: "0" },
                    deadline: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                    slippage
                },
                required: ["path", "amountIn", "amountOutMin", "to", "deadline", "from", "gas"]
            }
        },

        // Field Mapping for swapUniswapV3() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "swapUniswapV3()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    path: { type: "array", minItems: 2, maxItems: 2 },
                    amountIn: { type: "string" },
                    amountOutMin: { type: "string" },
                    to: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                    poolFees: { type: "string", default: "3000" },
                    slippage,
                    involveBaseToken: { type: "string", enum: ["0", "1", "2"], default: "0" },
                },
                required: ["amountIn", "amountOutMin", "path", "to", "from", "gas"]
            }
        },

        // Field Mapping for addLiquidateUniswapV2Like() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "addLiquidityUniswapV2()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    tokenA: { type: "string" },
                    tokenB: { type: "string" },
                    amountADesired: { type: "string" },
                    amountBDesired: { type: "string" },
                    amountAMin: { type: "string" },
                    amountBMin: { type: "string" },
                    to: { type: "string" },
                    deadline: { type: "string", "pattern": "^[0-9]*$" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                    slippage
                },
                required: ["tokenA", "tokenB", "amountADesired", "amountBDesired", "amountAMin", "amountBMin", "to", "deadline", "from", "gas"]
            }
        },

        // Field Mapping for addLiquidityTraderJoe() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "addLiquidityTraderJoe()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    tokenA: { type: "string" },
                    tokenB: { type: "string" },
                    amountA: { type: "string" },
                    amountB: { type: "string" },
                    amountAMin: { type: "string" },
                    amountBMin: { type: "string" },
                    to: { type: "string" },
                    deadline: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                    privateKey: { type: "string" },
                    strategy: { type: "string", enum: ["spotUniform", "curve", "bidask"], default: "spotUniform" },
                    slippage
                },
                required: ["tokenA", "tokenB", "amountA", "amountB", "amountAMin", "amountBMin", "to", "deadline", "from", "gas"]
            }
        },

        // Field Mapping for addLiquidateUniswapV3() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "addLiquidityUniswapV3()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    tokenId: { type: "string" },
                    tokenA: { type: "string" },
                    tokenB: { type: "string" },
                    poolFees: { type: "string" },
                    amountADesired: { type: "string" },
                    amountBDesired: { type: "string" },
                    amountAMin: { type: "string" },
                    amountBMin: { type: "string" },
                    to: { type: "string" },
                    deadline: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                    slippage
                },
                required: ["tokenA", "tokenB", "poolFees",
                    "amountADesired", "amountBDesired", "amountAMin", "amountBMin", "to", "deadline", "from", "gas"]
            }
        },

        // Field Mapping for removeLiquidateUniswapV2Like() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "removeLiquidityUniswapV2()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    tokenA: { type: "string" },
                    tokenB: { type: "string" },
                    liquidity: { type: "string" },
                    amountAMin: { type: "string" },
                    amountBMin: { type: "string" },
                    to: { type: "string" },
                    deadline: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                    slippage
                },
                required: ["tokenA", "tokenB", "liquidity", "amountAMin", "amountBMin", "to", "deadline", "from", "gas"]
            }
        },

        // Field Mapping for removeLiquidityTraderJoe() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "removeLiquidityTraderJoe()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    tokenA: { type: "string" },
                    tokenB: { type: "string" },
                    binStep: { type: "string" },
                    amountAMin: { type: "string" },
                    amountBMin: { type: "string" },
                    ids: { type: "array" },
                    amounts: { type: "array" },
                    to: { type: "string" },
                    deadline: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                    privateKey: { type: "string" },
                    slippage
                },
                required: ["tokenA", "tokenB", "amountAMin", "amountBMin", "to", "deadline", "from", "gas", "binStep", "ids", "amounts"]
            }
        },

        // Field Mapping for removeLiquidateUniswapV3() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "removeLiquidityUniswapV3()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    tokenA: { type: "string" },
                    tokenB: { type: "string" },
                    liquidity: { type: "string" },
                    tokenId: { type: "string" },
                    deadline: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                    amountAMin: { type: "string", default: "0" },
                    recipient: { type: "string", default: "0x0000000000000000000000000000000000000000" },
                    amountAMax: { type: "string", default: "340282366920938463463374607431768211455" },
                    amountBMax: { type: "string", default: "340282366920938463463374607431768211455" },
                    slippage
                },
                required: ["tokenA", "liquidity", "tokenId", "deadline", "from", "gas"]
            }

        },

        // Field Mapping for getPoolLiquidityUniswapV2Like() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getPoolLiquidityUniswapV2()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    poolAddress: { type: "string" },
                },
                required: ["poolAddress"]
            }
        },

        // Field Mapping for getPoolLiquidityStonFi() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getPoolLiquidityStonFi()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    poolAddress: { type: "string" },
                },
                required: ["poolAddress"]
            }
        },

        // Field Mapping for getPoolLiquidityTraderJoe() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getPoolLiquidityTraderJoe()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    poolAddress: { type: "string" },
                    id: { type: "string" }
                },
                required: ["poolAddress", "id"]
            }
        },
        // Field Mapping for PoolHistoricalTimeSeries() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "poolHistoricalTimeSeries()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    poolAddress: { type: "string" },
                    startBlock: { type: "string", pattern: '^[1-9][0-9]*$', errorMessage: 'Value should be greater than 0' },
                    endBlock: { type: "string", pattern: '^[1-9][0-9]*$', errorMessage: 'Value should be greater than 0' },
                    function: {},
                },
                required: ["dexId", "poolAddress"],
                additionalProperties: false,
                errorMessage: "Allowed values are dexId, poolAddress , startBlock , endBlock"
            }
        },
        // Field Mapping for getHistoricalTransactions() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "poolHistoricalTransactions()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    poolAddress: { type: "string" },
                    startBlock: { type: "string", pattern: '^[1-9][0-9]*$', errorMessage: 'Value should be greater than 0' },
                    endBlock: { type: "string", pattern: '^[1-9][0-9]*$', errorMessage: 'Value should be greater than 0' },
                    function: {},
                },
                required: ["dexId", "poolAddress"],
                additionalProperties: false,
                errorMessage: "Allowed values are dexId, poolAddress , startBlock , endBlock"
            }
        },

        // Field Mapping for getPoolIndividualLiquidityUniswapV2Like() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getPoolIndividualLiquidity()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    poolAddress: { type: "string" },
                    startPage: { type: "string", pattern: '^[1-9][0-9]*$', "errorMessage": "Value should be greater than 0" },
                    endPage: { type: "string", pattern: '^[1-9][0-9]*$', "errorMessage": "Value should be greater than 0" },
                    function: {},
                },
                required: ["dexId", "poolAddress"],
                additionalProperties: false,
                errorMessage: "Allowed values are dexId, poolAddress , startPage , endPage"


            },

        },


        // Field Mapping for getPoolLiquidityUniswapV3Like() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getPoolLiquidityUniswapV3()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    poolAddress: { type: "string" }
                },
                required: ["poolAddress"]
            }
        },

        // Field Mapping for getTokenHolderUniswapV2Like() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getTokenHolderUniswapV2()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    poolAddress: { type: "string" }
                },
                required: ["poolAddress"]
            }
        },
        // Field Mapping for getTokenHolderStonFi() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getTokenHolderStonFi()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    poolAddress: { type: "string" }
                },
                required: ["poolAddress"]
            }
        },

        // Field Mapping for getTokenHolderUniswapV3Like() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getTokenHolderUniswapV3()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    poolAddress: { type: "string" }
                },
                required: ["poolAddress"]
            }
        },

        // Field Mapping for getTokenLiquidityUniswapV2Like() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getTokenLiquidityUniswapV2()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    poolAddress: { type: "string" }
                },
                required: ["poolAddress"]
            }
        },

        // Field Mapping for getTokenLiquidityStonFi() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getTokenLiquidityStonFi()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    poolAddress: { type: "string" },
                },
                required: ["poolAddress"]
            }
        },

        // Field Mapping for getTokenLiquidityTraderJoe() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getTokenLiquidityTraderJoe()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    poolAddress: { type: "string" }
                },
                required: ["poolAddress"]
            }
        },

        // Field Mapping for getTokenLiquidityUniswapV3Like() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getTokenLiquidityUniswapV3()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    poolAddress: { type: "string" }
                },
                required: ["poolAddress"]
            }
        },

        // Field Mapping for getPositionUniswapV2Like() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getPositionUniswapV2()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    address: { type: "string" },
                    poolAddresses: { type: "string" },
                    poolSize: { type: "string", default: "50", pattern: "^(?!0$)([1-9]\\d{0,3}|10000)$" }
                },
                required: ["address"]
            }
        },

        // Field Mapping for getPositionUniswapV3Like() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getPositionUniswapV3()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    address: { type: "string" },
                    poolAddresses: { type: "string" },
                    poolSize: { type: "string", default: "50", pattern: "^(?!0$)([1-9]\\d{0,3}|10000)$" }
                },
                required: ["address"]
            }
        },

        // Field Mapping for getPositionCurveV2() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getPositionCurveV2()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    address: { type: "string" },
                },
                required: ["address"]
            }
        },

        // Field Mapping for getPrice0x() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getPrice0x()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    path: { type: "array", minItems: 2, maxItems: 2 },
                    amountIn: { type: "string" }
                },
                required: ["path", "amountIn"]
            }
        },

        // Field Mapping for swap0x() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "swap0x()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    path: { type: "array", minItems: 2, maxItems: 2 },
                    amountIn: { type: "string" },
                    from: { type: "string" },
                    amountOutMin: { type: "string" },
                    gas,
                    gasPriority,
                    slippage
                },
                required: ["path", "amountIn", "from", "gas"]
            }
        },

        /*
         * category = Lend and Borrow
         *
         */

        // Field Mapping for getUserPositionsAaveV2() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getUserPositionsAaveV2()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    address: { type: "string" },
                },
                required: ["address"]
            }
        },

        // Field Mapping for getPoolAave() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getPoolAave()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    asset: { type: "string" },
                },
                required: ["asset"]
            }
        },
        // Field Mapping for getPoolsAave() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getPoolsAave()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    assets: { type: "array", minItems: 1 },
                    user: { type: "string" }
                },
                required: ["assets"]
            }
        },

        // Field Mapping for getPoolsCompound() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getPoolsCompound()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    assets: { type: "array", minItems: 1 },
                    user: { type: "string" }
                },
                required: ["assets"]
            }
        },

        // Field Mapping for bundleActionsCompV3() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "bundleActionsCompV3()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    actions: { type: "array", minItems: 1 },
                    data: { type: "array", minItems: 1 },
                    market,
                    gasPriority,
                    gas,
                    from: { type: "string" }
                },
                required: ["actions", "data", "from"]
            }
        },

        // Field Mapping for allowCompV3() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "allowCompV3()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    manager: { type: "string" },
                    isAllowed: { type: "string", enum: ["true", "false"], default: "true" },
                    market,
                    from: { type: "string" },
                    gas,
                    gasPriority
                },
                required: ["manager", "isAllowed", "from", "gas"]
            }
        },

        // Field Mapping for borrowCompV3() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "borrowCompV3()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    amount: { type: "string", pattern: '^[1-9][0-9]*$', "errorMessage": "Value should be greater than 0" },
                    market,
                    from: { type: "string" },
                    gas,
                    gasPriority
                },
                required: ["amount", "from", "gas"]
            }
        },

        // Field Mapping for claimRewardsCompV3() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "claimRewardsCompV3()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    market,
                    from: { type: "string" },
                    gas,
                    gasPriority
                },
                required: ["from", "gas"]
            }
        },

        // Field Mapping for depositCompV3() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "depositCompV3()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    market,
                    from: { type: "string" },
                    gas,
                    gasPriority,
                    asset: { type: "string" },
                    amount: { type: "string", pattern: '^[1-9][0-9]*$', "errorMessage": "Value should be greater than 0" },
                    to: { type: "string" }
                },
                required: ["from", "gas", "asset", "amount"]
            }
        },

        // Field Mapping for getAssetInfoCompV3() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getAssetInfoCompV3()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    market,
                    asset: { type: "string" }
                },
                required: ["asset"]
            }
        },

        // Field Mapping for getBorrowCompV3() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getBorrowCompV3()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    market,
                    address: { type: "string" }
                },
                required: ["address"]
            }
        },

        // Field Mapping for getClaimedRewardsCompV3() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getClaimedRewardsCompV3()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    market,
                    address: { type: "string" }
                },
                required: ["address"]
            }
        },

        // Field Mapping for getMaxAmountsCompV3() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getMaxAmountsCompV3()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    market,
                    asset: { type: "string" },
                    address: { type: "string" }
                },
                required: ["address", "asset"]
            }
        },

        // Field Mapping for getPoolCompV3() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getPoolCompV3()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    market
                },
                required: []
            }
        },

        // Field Mapping for getRepayAmountCompV3() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getRepayAmountCompV3()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    market,
                    address: { type: "string" }
                },
                required: ["address"]
            }
        },

        // Field Mapping for getAccountDataCompV3() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getAccountDataCompV3()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    market,
                    address: { type: "string" }
                },
                required: ["address"]
            }
        },

        // Field Mapping for governerDataCompV3() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "governerDataCompV3()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    market
                },
                required: []
            }
        },

        // Field Mapping for repayCompV3() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "repayCompV3()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    market,
                    amount: { type: "string", pattern: '^[1-9][0-9]*$', "errorMessage": "Value should be greater than 0" },
                    from: { type: "string" },
                    gas,
                    gasPriority
                },
                required: ["amount", "from", "gas"]
            }
        },

        // Field Mapping for transferCompV3() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "transferCompV3()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    market,
                    amount: { type: "string", pattern: '^[1-9][0-9]*$', "errorMessage": "Value should be greater than 0" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                    asset: { type: "string" },
                    to: { type: "string" }
                },
                required: ["amount", "from", "gas", "to"]
            }
        },

        // Field Mapping for withdrawCompV3() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "withdrawCompV3()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    market,
                    amount: { type: "string", pattern: '^[1-9][0-9]*$', "errorMessage": "Value should be greater than 0" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                    asset: { type: "string" },
                    to: { type: "string" }
                },
                required: ["amount", "from", "gas", "asset"]
            }
        },

        // Field Mapping for getPoolCompound() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getPoolCompound()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    asset: { type: "string" },
                },
                required: ["asset"]
            }
        },
        // Field Mapping for enterMarketStatus() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "enterMarketStatus()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    account: { type: "string" },
                },
                required: ["account"]
            }
        },

        // Field Mapping for enterMarketAave() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "enterMarketAave()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    asset: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                },
                required: ["asset", "from", "gas"]
            }
        },

        // Field Mapping for enterMarketCompound() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "enterMarketCompound()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    asset: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                },
                required: ["asset", "from", "gas"]
            }
        },

        // Field Mapping for exitMarketCompound() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "exitMarketCompound()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    asset: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                },
                required: ["asset", "from", "gas"]
            }
        },


        // Field Mapping for borrowAave() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "borrowAave()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    asset: { type: "string" },
                    amount: { type: "string" },
                    interestRateMode: { type: "string", default: "1" },
                    referralCode: { type: "string", default: "0" },
                    onBehalfOf: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,

                },
                required: ["asset", "amount", "onBehalfOf", "from", "gas"]
            }
        },

        // Field Mapping for borrowAaveV3() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "borrowAaveV3()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    asset: { type: "string" },
                    amount: { type: "string" },
                    interestRateMode: { type: "string", default: "1", enum: ["1", "2"] },
                    referralCode: { type: "string", default: "0" },
                    onBehalfOf: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,

                },
                required: ["asset", "amount", "onBehalfOf", "from", "gas"]
            }
        },

        // Field Mapping for borrowCompound() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "borrowCompound()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    asset: { type: "string" },
                    amount: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,

                },
                required: ["asset", "amount", "from", "gas"]
            }
        },

        // Field Mapping for depositAave() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "depositAave()" },
                }
            },
            then: {
                properties: {
                    involveBaseToken: { type: "string", default: "0" },
                    lendborrowId: { type: "string" },
                    asset: { type: "string" },
                    amount: { type: "string" },
                    referralCode: { type: "string", default: "0" },
                    onBehalfOf: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                    slippage
                },
                required: ["asset", "amount", "onBehalfOf", "from", "gas"]
            }
        },

        // Field Mapping for depositAaveV3() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "depositAaveV3()" },
                }
            },
            then: {
                properties: {
                    involveBaseToken: { type: "string", default: "0" },
                    lendborrowId: { type: "string" },
                    asset: { type: "string" },
                    amount: { type: "string" },
                    referralCode: { type: "string", default: "0" },
                    onBehalfOf: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                    slippage
                },
                required: ["asset", "amount", "onBehalfOf", "from", "gas"]
            }
        },

        // Field Mapping for depositCompound() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "depositCompound()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    asset: { type: "string" },
                    amount: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                    slippage
                },
                required: ["asset", "amount", "from", "gas"]
            }
        },

        // Field Mapping for liquidateAave() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "liquidateAave()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    collateralAsset: { type: "string" },
                    debtAsset: { type: "string" },
                    user: { type: "string" },
                    debtToCover: { type: "string" },
                    recieveAToken: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,

                },
                required: ["collateralAsset", "debtAsset", "user", "debtToCover", "recieveAToken", "from", "gas"]
            }
        },

        // Field Mapping for liquidateCompound() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "liquidateCompound()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    collateralAsset: { type: "string" },
                    debtAsset: { type: "string" },
                    user: { type: "string" },
                    debtToCover: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,

                },
                required: ["collateralAsset", "debtAsset", "user", "debtToCover", "from", "gas"]
            }
        },

        // Field Mapping for repayAave() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "repayAave()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    asset: { type: "string" },
                    amount: { type: "string" },
                    interestRateMode: { type: "string", default: "1" },
                    onBehalfOf: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,

                },
                required: ["asset", "amount", "onBehalfOf", "from", "gas"]
            }
        },

        // Field Mapping for repayAaveV3() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "repayAaveV3()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    asset: { type: "string" },
                    amount: { type: "string" },
                    interestRateMode: { type: "string", default: "1", enum: ["1", "2"] },
                    onBehalfOf: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,

                },
                required: ["asset", "amount", "onBehalfOf", "from", "gas"]
            }
        },

        // Field Mapping for getRepayAmountAave() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getRepayAmountAave()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    asset: { type: "string" },
                    user: { type: "string" },

                },
                required: ["asset", "user"]
            }
        },

        // Field Mapping for getRepayAmountAaveV3() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getRepayAmountAaveV3()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    asset: { type: "string" },
                    from: { type: "string" },

                },
                required: ["asset", "from"]
            }
        },

        // Field Mapping for setUserEModeAaveV3() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "setUserEModeAaveV3()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    from: { type: "string" },
                    categoryId: { type: "string", enum: ["0", "1"] },
                    gas,
                    gasPriority,

                },
                required: ["from", "categoryId", "gas"]
            }
        },

        // Field Mapping for exitIsolationModeAaveV3() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "exitIsolationModeAaveV3()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    asset: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,

                },
                required: ["asset", "from", "gas"]
            }
        },

        // Field Mapping for migrateAaveV3() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "migrateAaveV3()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    from: { type: "string" },
                    gas,
                    assets: { type: "array" },
                    gasPriority,

                },
                required: ["from", "gas"]
            }
        },

        // Field Mapping for getUserAccountDataAaveV2() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getUserAccountDataAaveV2()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    asset: { type: "string" },
                    address: { type: "string" },
                    interestRateMode: { type: "string", default: "1" }
                },
                required: ["asset", "address", "interestRateMode"]
            }
        },

        // Field Mapping for getUserAccountDataAaveV3() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getUserAccountDataAaveV3()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    asset: { type: "string" },
                    address: { type: "string" },
                    interestRateMode: { type: "string", default: "1", enum: ["1", "2"] }
                },
                required: ["asset", "address", "interestRateMode"]
            }
        },

        // Field Mapping for getUserPositionsAaveV2() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getUserPositionsAaveV2()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    address: { type: "string" },
                },
                required: ["address"]
            }
        },


        // Field Mapping for getUserAccountDataCompound() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getUserAccountDataCompound()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    asset: { type: "string" },
                    address: { type: "string" },
                },
                required: ["asset", "address"]
            }
        },

        // Field Mapping for repayCompound() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "repayCompound()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    asset: { type: "string" },
                    amount: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,

                },
                required: ["asset", "amount", "from", "gas"]
            }
        },

        // Field Mapping for withdrawAave() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "withdrawAave()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    asset: { type: "string" },
                    amount: { type: "string" },
                    to: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                    slippage
                },
                required: ["asset", "amount", "to", "from", "gas"]
            }
        },

        // Field Mapping for withdrawAaveV3() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "withdrawAaveV3()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    asset: { type: "string" },
                    amount: { type: "string" },
                    to: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                    slippage
                },
                required: ["asset", "amount", "to", "from", "gas"]
            }
        },

        // Field Mapping for withdrawCompound() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "withdrawCompound()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    asset: { type: "string" },
                    amount: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                    slippage
                },
                required: ["asset", "amount", "from", "gas"]
            }
        },

        // Field Mapping for getRepayAmountCompound() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getRepayAmountCompound()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    user: { type: "string" },
                    asset: { type: "string" },
                },
                required: ["asset", "user"]
            }
        },

        // Field Mapping for getBorrowAmountCompound() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getBorrowAmountCompound()" },
                }
            },
            then: {
                properties: {
                    lendborrowId: { type: "string" },
                    user: { type: "string" },
                    asset: { type: "string" },
                },
                required: ["asset", "user"]
            }
        },

        /*
         * category = Oracle
         *
         */

        //  Field Mapping for getPriceChainLink() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getPriceChainLink()" },
                }
            },
            then: {
                properties: {
                    oracleId: { type: "string" },
                    oracleName: { type: "string", enum: ["ChainLink", "WinkLink", "Pyth"] },
                    asset: { type: "string", maxLength: 10, minLength: 2 },
                    timestamp: { type: "string", pattern: '^[0-9][0-9]*$', "errorMessage": "Value should be positive integer" }
                },
                required: ["asset"]
            }
        },

        //  Field Mapping for getSupportedTokensOracle() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getSupportedTokensOracle()" },
                }
            },
            then: {
                properties: {
                    oracleId: { type: "string" },
                    oracleName: { type: "string", enum: ["ChainLink", "WinkLink", "Pyth"] }
                },
                required: []
            }
        },

        //  Field Mapping for getPriceWinkLink() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getPriceWinkLink()" },
                }
            },
            then: {
                properties: {
                    oracleId: { type: "string" },
                    oracleName: { type: "string", enum: ["ChainLink", "WinkLink", "Pyth"] },
                    asset: { type: "string", maxLength: 10, minLength: 2 },
                    timestamp: { type: "string", pattern: '^[0-9][0-9]*$', "errorMessage": "Value should be positive integer" }
                },
                required: ["asset"]
            }
        },

        //  Field Mapping for getPricePyth() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getPricePyth()" },
                }
            },
            then: {
                properties: {
                    oracleId: { type: "string" },
                    oracleName: { type: "string", enum: ["ChainLink", "WinkLink", "Pyth"] },
                    asset: { type: "string", maxLength: 10, minLength: 2 },
                    timestamp: { type: "string", pattern: '^[0-9][0-9]*$', "errorMessage": "Value should be positive integer" }
                },
                required: ["asset"]
            }
        },

        // Field Mapping for getBalanceYearnFinance() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getBalanceYearnFinance()" },
                }
            },
            then: {
                oneOf: [
                    {
                        properties: {
                            address: { type: "string" },
                            tokenAddress: { type: "string" },
                            vaultNumber: { type: "string" },
                            yieldAggregatorId: { type: "string" },
                        },
                        required: ["address", "yieldAggregatorId", "tokenAddress"],
                    },
                    {
                        properties: {
                            address: { type: "string" },
                            vaultAddress: { type: "string" },
                            yieldAggregatorId: { type: "string" },
                        },
                        required: ["address", "yieldAggregatorId", "vaultAddress"],
                    },
                ]
            }
        },

        // Field Mapping for getVaultsYearnFinance() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getVaultsYearnFinance()" },
                }
            },
            then: {
                properties: {
                    tokenAddress: { type: "string" },
                    yieldAggregatorId: { type: "string" },
                },
                required: ["yieldAggregatorId"]
            }
        },

        // Field Mapping for getVaultsHarvestFinance() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getVaultsHarvestFinance()" },
                }
            },
            then: {
                properties: {
                    tokenAddress: { type: "string" },
                    yieldAggregatorId: { type: "string" },
                },
                required: ["yieldAggregatorId"]
            }
        },

        // Field Mapping for depositVaultYearnFinance() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "depositVaultYearnFinance()" },
                }
            },
            then: {
                oneOf: [
                    {
                        properties: {
                            amount: { type: "string" },
                            from: { type: "string" },
                            gas,
                            gasPriority,
                            tokenAddress: { type: "string" },
                            vaultNumber: { type: "string" },
                        },
                        required: ["amount", "from", "gas", "tokenAddress"],
                    },
                    {
                        properties: {
                            amount: { type: "string" },
                            from: { type: "string" },
                            gas,
                            gasPriority,
                            vaultAddress: { type: "string" },
                        },
                        required: ["amount", "from", "gas", "vaultAddress"],
                    },
                ]
            }
        },

        // Field Mapping for withdrawVaultYearnFinance() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "withdrawVaultYearnFinance()" },
                }
            },
            then: {
                oneOf: [
                    {
                        properties: {
                            amount: { type: "string" },
                            from: { type: "string" },
                            gas,
                            gasPriority,
                            tokenAddress: { type: "string" },
                            vaultNumber: { type: "string" },
                        },
                        required: ["amount", "from", "gas", "tokenAddress"],
                    },
                    {
                        properties: {
                            amount: { type: "string" },
                            from: { type: "string" },
                            gas,
                            gasPriority,
                            vaultAddress: { type: "string" },
                        },
                        required: ["amount", "from", "gas", "vaultAddress"],
                    },
                ]
            }
        },

        // Field Mapping for withdrawVaultHarvestFinance() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "withdrawVaultHarvestFinance()" },
                }
            },
            then: {
                oneOf: [
                    {
                        properties: {
                            amount: { type: "string" },
                            from: { type: "string" },
                            gas,
                            gasPriority,
                            tokenAddress: { type: "string" },
                            yieldAggregatorId: { type: "string" },
                        },
                        required: ["amount", "from", "gas", "tokenAddress", "yieldAggregatorId"],
                    },
                    {
                        properties: {
                            amount: { type: "string" },
                            from: { type: "string" },
                            gas,
                            gasPriority,
                            vaultAddress: { type: "string" },
                            yieldAggregatorId: { type: "string" },
                        },
                        required: ["amount", "from", "gas", "vaultAddress", "yieldAggregatorId"],
                    },
                ]
            }
        },

        // Field Mapping for withdrawPoolHarvestFinance() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "withdrawPoolHarvestFinance()" },
                }
            },
            then: {
                oneOf: [
                    {
                        properties: {
                            amount: { type: "string" },
                            from: { type: "string" },
                            gas,
                            gasPriority,
                            tokenAddress: { type: "string" },
                            yieldAggregatorId: { type: "string" },
                        },
                        required: ["amount", "from", "gas", "tokenAddress", "yieldAggregatorId"],
                    },
                    {
                        properties: {
                            amount: { type: "string" },
                            from: { type: "string" },
                            gas,
                            gasPriority,
                            poolAddress: { type: "string" },
                            yieldAggregatorId: { type: "string" },
                        },
                        required: ["amount", "from", "gas", "poolAddress", "yieldAggregatorId"],
                    },
                ]
            }
        },
        // Field Mapping for getBalanceHarvestFinance() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getBalanceHarvestFinance()" },
                }
            },
            then: {
                oneOf: [
                    {
                        properties: {
                            address: { type: "string" },
                            tokenAddress: { type: "string" },
                            yieldAggregatorId: { type: "string" },
                        },
                        required: ["address", "tokenAddress", "yieldAggregatorId"],
                    },
                    {
                        properties: {
                            address: { type: "string" },
                            vaultAddress: { type: "string" },
                            poolAddress: { type: "string" },
                            yieldAggregatorId: { type: "string" },
                        },
                        required: ["address", "vaultAddress", "poolAddress", "yieldAggregatorId"],
                    },
                ]
            }
        },

        // Field Mapping for depositVaultHarvestFinance() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "depositVaultHarvestFinance()" },
                }
            },
            then: {
                oneOf: [
                    {
                        properties: {
                            amount: { type: "string" },
                            from: { type: "string" },
                            gas,
                            gasPriority,
                            tokenAddress: { type: "string" },
                            yieldAggregatorId: { type: "string" },
                        },
                        required: ["amount", "from", "gas", "tokenAddress", "yieldAggregatorId"],
                    },
                    {
                        properties: {
                            amount: { type: "string" },
                            from: { type: "string" },
                            gas,
                            gasPriority,
                            vaultAddress: { type: "string" },
                            yieldAggregatorId: { type: "string" },
                        },
                        required: ["amount", "from", "gas", "vaultAddress", "yieldAggregatorId"],
                    },
                ]
            }
        },

        // Field Mapping for depositPoolHarvestFinance() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "depositPoolHarvestFinance()" },
                }
            },
            then: {
                oneOf: [
                    {
                        properties: {
                            amount: { type: "string" },
                            from: { type: "string" },
                            gas,
                            gasPriority,
                            tokenAddress: { type: "string" },
                            yieldAggregatorId: { type: "string" },
                        },
                        required: ["amount", "from", "gas", "tokenAddress", "yieldAggregatorId"],
                    },
                    {
                        properties: {
                            amount: { type: "string" },
                            from: { type: "string" },
                            gas,
                            gasPriority,
                            poolAddress: { type: "string" },
                            yieldAggregatorId: { type: "string" },
                        },
                        required: ["amount", "from", "gas", "poolAddress", "yieldAggregatorId"],
                    },
                ]
            }
        },

        // Field Mapping for erc20 approveEvm() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "approveEvm()" },
                }
            },
            then: {
                properties: {
                    amount: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                    to: { type: "string" },
                    tokenAddress: { type: "string" },
                },
                required: ["amount", "from", "gas", "to", "tokenAddress"]
            }
        },
        // Field Mapping for erc20 transferFromEvm() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "transferFromEvm()" },
                }
            },
            then: {
                properties: {
                    amount: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                    to: { type: "string" },
                    tokenAddress: { type: "string" },
                    reciever: { type: "string" },

                },
                required: ["amount", "from", "gas", "to", "tokenAddress", "reciever"]
            }
        },
        // Field Mapping for erc20 transferEvm() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "transferEvm()" },
                }
            },
            then: {
                properties: {
                    amount: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                    to: { type: "string" },
                    tokenAddress: { type: "string" },

                },
                required: ["amount", "from", "gas", "to", "tokenAddress"]
            }
        },
        // Field Mapping for erc20 getNameEvm() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getNameEvm()" },
                }
            },
            then: {
                properties: {
                    tokenAddress: { type: "string" },
                },
                required: ["tokenAddress"]
            }
        },


        // Field Mapping for erc20 getSymbolEvm() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getSymbolEvm()" },
                }
            },
            then: {
                properties: {
                    tokenAddress: { type: "string" },
                },
                required: ["tokenAddress"]
            }
        },
        // Field Mapping for erc20 getDecimalsEvm() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getDecimalsEvm()" },
                }
            },
            then: {
                properties: {
                    tokenAddress: { type: "string" },
                },
                required: ["tokenAddress"]
            }
        },
        // Field Mapping for erc20 getTokenDetails() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "gettokendetails()" },
                }
            },
            then: {
                properties: {
                    tokenAddress: { type: "string" },
                },
                required: ["tokenAddress"]
            }
        },

        // Field Mapping for chain getTokenMarketDataEvm() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getTokenMarketDataEvm()" },
                }
            },
            then: {
                properties: {
                    chainId: { type: "string" },
                    chainSymbol: { type: "string" },
                    asset: { type: "string" },
                },
                required: ["asset"]
            }
        },

        // Field Mapping for erc20 getBalance() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getUserBalance()" },
                }
            },
            then: {
                properties: {
                    tokenAddress: { type: "string" },
                    address: { type: "string" },
                },
                required: ["tokenAddress", "address"]
            }
        },

        // Field mapping for weth getBalance() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getWethBalance()" },
                }
            },
            then: {
                properties: {
                    user: { type: "string" },
                },
                required: ["user"]
            }
        },

        // Field Mapping for erc20 getUserAllowance() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getUserAllowanceEvm()" },
                }
            },
            then: {
                properties: {
                    tokenAddress: { type: "string" },
                    owner: { type: "string" },
                    spender: { type: "string" },
                },
                required: ["tokenAddress", "owner", "spender"]
            }
        },
        // Field Mapping for erc20 convertBaseTokenToWrapTokenEvm() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "convertBaseTokenToWrapTokenEvm()" },
                }
            },
            then: {
                properties: {
                    amount: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                    tokenAddress: { type: "string" },

                },
                required: ["amount", "from", "gas", "tokenAddress"]
            }
        },
        // Field Mapping for erc20 convertWrapTokenToBaseTokenEvm() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "convertWrapTokenToBaseTokenEvm()" },
                }
            },
            then: {
                properties: {
                    amount: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                    tokenAddress: { type: "string" },

                },
                required: ["amount", "from", "gas", "tokenAddress"]
            }
        },

        //  Field mapping for getNameSolana() Function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getNameSolana()" },
                }
            },
            then: {
                properties: {
                    publickey: { type: "string" },
                    token: { type: "string" },
                    chainName: { type: "string" },
                    chainId: { type: "string" }
                },
                required: ['publickey', 'token']
            }
        },
        //  Field mapping for getSymbolSolana() Function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getSymbolSolana()" },
                }
            },
            then: {
                properties: {
                    publickey: { type: "string" },
                    token: { type: "string" },
                    chainName: { type: "string" },
                    chainId: { type: "string" }
                },
                required: ['publickey', 'token']
            }
        },
        //  Field mapping for getSymbolSolana() Function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getDecimalsSolana()" },
                }
            },
            then: {
                properties: {
                    token: { type: "string" },
                    chainName: { type: "string" },
                    chainId: { type: "string" }
                },
                required: ['token']
            }
        },

        //  Field mapping for metadataOfSolanaNFTMetaplex() Function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "metadataOfSolanaNFTMetaplex()" },
                }
            },
            then: {
                properties: {
                    nftCollection: { type: "string" },
                    chainSymbol: { type: "string" },
                    chainId: { type: "string" }
                },
                required: ['nftCollection']
            }
        },

        //  Field mapping for balanceOfSolanaNFTMetaplex() Function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "balanceOfSolanaNFTMetaplex()" },
                }
            },
            then: {
                properties: {
                    address: { type: "string" },
                    nftCollection: { type: "string" },
                    chainSymbol: { type: "string" },
                    chainId: { type: "string" }
                },
                required: ['address', 'nftCollection']
            }
        },

        // Field Mapping for approveSolana()

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "approveSolana()" },
                }
            },
            then: {
                properties: {
                    delegate: { type: "string" },
                    token: { type: "string" },
                    owner: { type: "string" },
                    chainName: { type: "string" },
                    chainId: { type: "string" },
                    amount: { type: "string" }

                },

                required: ['delegate', 'token', 'owner']
            }
        },

        // Field Mapping for transferSolana()
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "transferSolana()" },
                }
            },
            then: {
                properties: {
                    token: { type: "string" },
                    feePayer: { type: "string" },
                    destination: { type: "string" },
                    sender: { type: "string" },
                    amount: { type: "number", default: 1 },
                    chainName: { type: "string" },
                    chainId: { type: "string" },
                    decimals: { type: "string" }


                },

                required: ['token', 'feePayer', 'destination', 'sender', 'amount', 'decimals']
            }
        },


        /*
         * category = StableCoin
         *
         */

        //  Field Mapping for getPriceEvm() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getPriceEvm()" },
                }
            },
            then: {
                properties: {
                    chainId: { type: "string" },
                    asset: { type: "string", enum: ["USDC", "USDT"] }
                },
                required: ["asset"]
            }
        },



        /*
         * category = Synthetics
         *
         */

        //  Field mapping for getPriceSynthetix() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getPriceSynthetix()" },
                }
            },
            then: {
                properties: {
                    syntheticId: { type: "string", default: "6000" },
                    amount: { type: "string" },
                },
                required: ["amount"]
            }
        },

        //  Field mapping for convertBaseToPeggedToken() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "convertBaseToPeggedToken()" },
                }
            },
            then: {
                properties: {
                    syntheticId: { type: "string", default: "6000" },
                    amount: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                },
                required: ["amount", "from", "gas"]
            }
        },

        //  Field mapping for convertBaseToProtocolToken() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "convertBaseToPeggedToken()" },
                }
            },
            then: {
                properties: {
                    syntheticId: { type: "string", default: "6000" },
                    amount: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                },
                required: ["amount", "from", "gas"]
            }
        },

        //  Field mapping for convertPeggedToBaseToken() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "convertPeggedToBaseToken()" },
                }
            },
            then: {
                properties: {
                    syntheticId: { type: "string", default: "6000" },
                    amount: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                },
                required: ["amount", "from", "gas"]
            }
        },

        //  Field mapping for convertPeggedToProtocolToken() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "convertPeggedToProtocolToken()" },
                }
            },
            then: {
                properties: {
                    syntheticId: { type: "string", default: "6000" },
                    amount: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,

                },
                required: ["amount", "from", "gas"]
            }
        },

        //  Field mapping for convertProtocolToBaseToken() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "convertProtocolToBaseToken()" },
                }
            },
            then: {
                properties: {
                    syntheticId: { type: "string", default: "6000" },
                    amount: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,

                },
                required: ["amount", "from", "gas"]
            }
        },

        //  Field mapping for convertProtocolToPeggedToken() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "convertBaseToPeggedToken()" },
                }
            },
            then: {
                properties: {
                    syntheticId: { type: "string", default: "6000" },
                    amount: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,

                },
                required: ["amount", "from", "gas"]
            }
        },

        //  Field mapping for liquidate() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "convertBaseToPeggedToken()" },
                }
            },
            then: {
                properties: {
                    syntheticId: { type: "string", default: "6000" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                },
                required: ["from", "gas"]
            }
        },

        //  Field mapping for depositPeggedTokenSynthetix() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "depositPeggedTokenSynthetix()" },
                }
            },
            then: {
                properties: {
                    syntheticId: { type: "string", default: "6000" },
                    amount: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                },
                required: ["amount", "from", "gas"]
            }
        },

        //  Field mapping for withdrawPeggedTokenSynthetix() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "withdrawPeggedTokenSynthetix()" },
                }
            },
            then: {
                properties: {
                    syntheticId: { type: "string", default: "6000" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                },
                required: ["from", "gas"]
            }
        },


        /*
         Category NonFungibleTokens
        */

        //  Field mapping for getNFTNameSolana() Function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getNFTNameSolana()" },
                }
            },
            then: {
                properties: {
                    publickey: { type: "string" },
                    token: { type: "string" },
                    chainName: { type: "string" },
                    chainId: { type: "string" }
                },
                required: ['publickey', 'token']
            }
        },

        // Field Mapping for getNFTSymbolSolana()

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getNFTSymbolSolana()" },
                }
            },
            then: {
                properties: {
                    publickey: { type: "string" },
                    token: { type: "string" },
                    chainName: { type: "string" },
                    chainId: { type: "string" }

                },
                required: ['publickey', 'token']
            }
        },

        // Field Mapping for getNFTOwnerSolana()
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getNFTOwnerSolana()" },
                }
            },
            then: {
                properties: {
                    nftCollection: { type: "string" },
                    chainSymbol: { type: "string" },
                    chainId: { type: "string" }
                },
                required: ['nftCollection']
            }
        },
        //  Field mapping for mintNFTSolana() Function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "mintNFTSolana()" },
                }
            },
            then: {
                properties: {
                    publickey: { type: "string" },
                    tokenAddress: { type: "string" },
                    name: { type: "string" },
                    symbol: { type: "string" },
                    uri: { type: "string" },
                    chainName: { type: "string" },
                    chainId: { type: "string" },


                },
                required: ['publickey', 'tokenAddress', 'name', 'symbol']
            }
        },

        // Field Mapping for transferNFTSolana()
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "transferNFTSolana()" },
                }
            },
            then: {
                properties: {
                    token: { type: "string" },
                    feePayer: { type: "string" },
                    destination: { type: "string" },
                    sender: { type: "string" },
                    amount: { type: "number", default: 1 },
                    chainName: { type: "string" },
                    chainId: { type: "string" }


                },

                required: ['token', 'feePayer', 'destination', 'sender']
            }
        },

        // Field Mapping for burnNFTSolana()

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "burnNFTSolana()" },
                }
            },
            then: {
                properties: {
                    account: { type: "string" },
                    mint: { type: "string" },
                    owner: { type: "string" },
                    chainName: { type: "string" },
                    chainId: { type: "string" }


                },

                required: ['account', 'mint', 'owner']
            }
        },

        // Field Mapping for approveNFTSolana()

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "approveNFTSolana()" },
                }
            },
            then: {
                properties: {
                    delegate: { type: "string" },
                    token: { type: "string" },
                    owner: { type: "string" },
                    chainName: { type: "string" },
                    chainId: { type: "string" }


                },

                required: ['delegate', 'token', 'owner']
            }
        },

        //  Field mapping for getHistoricalTransactionsNFTEvm() Function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getHistoricalTransactionsNFTEvm()" },
                }
            },
            then: {
                properties: {
                    nftCollection: { type: "string" },
                    address: { type: "string" },
                    chainId: { type: "string" },
                    chainSymbol: { type: "string" },
                    nftProtocolId: { type: "string", enum: ["721", "1155"], default: "721" },
                    startBlock: { type: "string", pattern: '^[0-9][0-9]*$', "errorMessage": "Value should be positive integer" },
                    endBlock: { type: "string", pattern: '^[1-9][0-9]*$', "errorMessage": "Value should be greater than 0" },
                    sort: { type: "string", enum: ["asc", "desc"], default: "desc" },
                },

                required: ['nftCollection', "sort"]
            }
        },

        //  Field mapping for getHistoricalTransactionsEvm() Function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getHistoricalTransactionsEvm()" },
                }
            },
            then: {
                properties: {
                    tokenAddress: { type: "string" },
                    address: { type: "string" },
                    chainId: { type: "string" },
                    chainSymbol: { type: "string" },
                    startBlock: { type: "string", pattern: '^[0-9][0-9]*$', "errorMessage": "Value should be positive integer" },
                    endBlock: { type: "string", pattern: '^[1-9][0-9]*$', "errorMessage": "Value should be greater than 0" },
                    sort: { type: "string", enum: ["asc", "desc"], default: "desc" },
                },

                required: ['tokenAddress', 'sort']
            }
        },

        //  Field mapping for getEvmUserTransactions() Function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getEvmUserTransactions()" },
                }
            },
            then: {
                properties: {
                    address: { type: "string" },
                    chainId: { type: "string" },
                    chainSymbol: { type: "string" },
                    sortOrder: { type: "string", enum: ["asc", "desc"], default: "desc" },
                    contractAddress: { type: "string" },
                    pageToken: { type: "string", default: "1", pattern: '^[1-9][0-9]*$', "errorMessage": "Page Token should be greater than 0" },
                },
                required: ['address']
            }
        },

        //  Field mapping for balanceOfEvm1155() Function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "balanceOfEvm1155()" },
                }
            },
            then: {
                properties: {
                    nftCollection: { type: "string" },
                    address: { type: "string" },
                    chainId: { type: "string" },
                    chainSymbol: { type: "string" },
                    tokenId: { type: "string", pattern: '^[0-9][0-9]*$' },
                    nftProtocolId: { type: "string" },
                },

                required: ['nftCollection', 'address', 'tokenId']
            }
        },

        //  Field mapping for getHistoricalLogsEvm() Function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getHistoricalLogsEvm()" },
                }
            },
            then: {
                properties: {
                    tokenAddress: { type: "string" },
                    page: { type: "string", default: "1", pattern: '^[1-9][0-9]*$', "errorMessage": "Value should be greater than 0" },
                    chainId: { type: "string" },
                    chainSymbol: { type: "string" },
                    startBlock: { type: "string", pattern: '^[0-9][0-9]*$', "errorMessage": "Value should be positive integer" },
                    endBlock: { type: "string", pattern: '^[1-9][0-9]*$', "errorMessage": "Value should be greater than 0" },
                    type: { type: "string", enum: ["Transfer", "Approval"] }
                },
                required: ['tokenAddress', 'page', 'type']
            }
        },

        //  Field mapping for getHistoricalLogsWeth() Function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getHistoricalLogsWeth()" },
                }
            },
            then: {
                properties: {
                    page: { type: "string", default: "1", pattern: '^[1-9][0-9]*$', "errorMessage": "Value should be greater than 0" },
                    chainId: { type: "string" },
                    chainSymbol: { type: "string" },
                    startBlock: { type: "string", pattern: '^[0-9][0-9]*$', "errorMessage": "Value should be positive integer" },
                    endBlock: { type: "string", pattern: '^[1-9][0-9]*$', "errorMessage": "Value should be greater than 0" },
                    type: { type: "string", enum: ["Deposit", "Withdrawal"] }
                },
                required: ['page', 'type']
            }
        },

        //  Field mapping for getHistoricalLogsNFT721Evm() Function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getHistoricalLogsNFT721Evm()" },
                }
            },
            then: {
                properties: {
                    nftCollection: { type: "string" },
                    page: { type: "string", default: "1", pattern: '^[1-9][0-9]*$', "errorMessage": "Value should be greater than 0" },
                    chainId: { type: "string" },
                    chainSymbol: { type: "string" },
                    nftProtocolId: { type: "string" },
                    startBlock: { type: "string", pattern: '^[0-9][0-9]*$', "errorMessage": "Value should be positive integer" },
                    endBlock: { type: "string", pattern: '^[1-9][0-9]*$', "errorMessage": "Value should be greater than 0" },
                    type: { type: "string", enum: ["Transfer", "Approval"] }
                },
                required: ['nftCollection', 'page', 'type']
            }
        },

        //  Field mapping for getHistoricalLogsNFT1155Evm() Function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getHistoricalLogsNFT1155Evm()" },
                }
            },
            then: {
                properties: {
                    nftCollection: { type: "string" },
                    page: { type: "string", default: "1", pattern: '^[1-9][0-9]*$', "errorMessage": "Value should be greater than 0" },
                    chainId: { type: "string" },
                    chainSymbol: { type: "string" },
                    nftProtocolId: { type: "string" },
                    startBlock: { type: "string", pattern: '^[0-9][0-9]*$', "errorMessage": "Value should be positive integer" },
                    endBlock: { type: "string", pattern: '^[1-9][0-9]*$', "errorMessage": "Value should be greater than 0" },
                    type: { type: "string", enum: ["TransferSingle", "ApprovalForAll"] }
                },
                required: ['nftCollection', 'page', 'type']
            }
        },

        //  Field mapping for ownerOfEvmNFT721() Function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "ownerOfEvmNFT721()" },
                }
            },
            then: {
                properties: {
                    nftCollection: { type: "string" },
                    nftIndex: { type: "string", pattern: '^[0-9][0-9]*$' },
                    chainId: { type: "string" },
                    chainSymbol: { type: "string" },
                    nftProtocolId: { type: "string" },
                },

                required: ['nftCollection', 'nftIndex']
            }
        },

        //  Field mapping for balanceOfEvm721() Function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "balanceOfEvm721()" },
                }
            },
            then: {
                properties: {
                    nftCollection: { type: "string" },
                    address: { type: "string" },
                    chainId: { type: "string" },
                    chainSymbol: { type: "string" },
                    nftProtocolId: { type: "string" },
                },

                required: ['nftCollection', 'address']
            }
        },

        // Field Mapping for getUserOps() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getUserOps()" },
                }
            },
            then: {
                properties: {
                    chainId: { type: "string" },
                    chainSymbol: { type: "string", maxLength: 7, minLength: 3 },
                    nonce: { type: "string" },
                    sender: { type: "string" },
                    initCode: { type: "string", default: "0x" },
                    callData: { type: "string", default: "0x" },
                    callGasLimit: { type: "string", default: "260611" },
                    gasLimit: { type: "string", default: "362451" },
                    verificationGasLimit: { type: "string", default: "362451" },
                    preVerificationGas: { type: "string", default: "53576" },
                    maxFeePerGas: { type: "string", default: "29964445250" },
                    maxPriorityFeePerGas: { type: "string", default: "100000000" },
                    paymasterAndData: { type: "string", default: "0x" },
                    signature: { type: "string", default: "0x" }
                },
                required: ["sender"]
            },
        },

        // Field Mapping for sendUserOps() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "sendUserOps()" },
                }
            },
            then: {
                properties: {
                    chainId: { type: "string" },
                    chainSymbol: { type: "string", maxLength: 7, minLength: 3 },
                    userOps: {
                        type: 'array',
                        minItems: 1,
                        items: {
                            type: 'object',
                            properties: {
                                sender: { type: "string" },
                                initCode: { type: "string" },
                                callData: { type: "string" },
                                callGasLimit: { type: "string" },
                                gasLimit: { type: "string" },
                                verificationGasLimit: { type: "string" },
                                preVerificationGas: { type: "string" },
                                maxFeePerGas: { type: "string" },
                                maxPriorityFeePerGas: { type: "string" },
                                paymasterAndData: { type: "string" },
                                signature: { type: "string" }
                            },
                            required: ['sender', 'initCode', 'callData', 'callGasLimit', 'gasLimit', 'verificationGasLimit',
                                'preVerificationGas', 'maxFeePerGas', 'maxPriorityFeePerGas', 'paymasterAndData', 'signature']
                        }
                    },
                    bundler: { type: "string" },
                    gas,
                },
                required: ["userOps", "bundler", "gas"]
            },
        },

        // Field Mapping for getSignatureMessage() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getSignatureMessage()" },
                }
            },
            then: {
                properties: {
                    chainId: { type: "string" },
                    chainSymbol: { type: "string", maxLength: 7, minLength: 3 },
                    sender: { type: "string" },
                    nonce: { type: "string" },
                    initCode: { type: "string", default: "0x" },
                    callData: { type: "string", default: "0x" },
                    callGasLimit: { type: "string", default: "260611" },
                    gasLimit: { type: "string", default: "362451" },
                    verificationGasLimit: { type: "string", default: "362451" },
                    preVerificationGas: { type: "string", default: "53576" },
                    maxFeePerGas: { type: "string", default: "29964445250" },
                    maxPriorityFeePerGas: { type: "string", default: "100000000" },
                    paymasterAndData: { type: "string", default: "0x" },
                    signature: { type: "string", default: "0x" }
                },
                required: ["sender"]
            },
        },

        // Field Mapping for getPaymasterData() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getPaymasterData()" },
                }
            },
            then: {
                properties: {
                    chainId: { type: "string" },
                    chainSymbol: { type: "string", maxLength: 7, minLength: 3 },
                    paymasterContractAddress: { type: "string" },
                    mockValidUntil: { type: "string", default: '0x00000000deadbeef' },
                    mockValidAfter: { type: "string", default: '0x0' },
                    sender: { type: "string" },
                    nonce: { type: "string" },
                    initCode: { type: "string", default: "0x" },
                    callData: { type: "string", default: "0x" },
                    callGasLimit: { type: "string", default: "260611" },
                    gasLimit: { type: "string", default: "362451" },
                    verificationGasLimit: { type: "string", default: "362451" },
                    preVerificationGas: { type: "string", default: "53576" },
                    maxFeePerGas: { type: "string", default: "29964445250" },
                    maxPriorityFeePerGas: { type: "string", default: "100000000" },
                    paymasterAndData: { type: "string", default: "0x" },
                    signature: { type: "string", default: "0x" }
                },
                required: ["paymasterContractAddress", "mockValidUntil", "mockValidAfter", "sender"]
            },
        },

        // Field Mapping for createOrderUniswapX() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "createOrderUniswapX()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    from: { type: "string" },
                    deadline: { type: "string", pattern: '^[1-9][0-9]*$', errorMessage: 'Deadline should be numeric and greater than 0' },
                    decayEndTime: { type: "string", pattern: '^[1-9][0-9]*$', errorMessage: 'decayEndTime should be numeric and greater than 0' },
                    decayStartTime: { type: "string", pattern: '^[1-9][0-9]*$', errorMessage: 'decayStartTime should be numeric and greater than 0' },
                    path: { type: "array", minItems: 2, maxItems: 2 },
                    amountIn: { type: "string" },
                    amountOutMin: { type: "string" },
                    to: { type: "string" },
                    slippage
                },
                required: ["from", "deadline", "decayStartTime", "decayEndTime", "path", "amountIn", "amountOutMin", "to"]
            },
        },

        // Field Mapping for swapUniswapX() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "swapUniswapX()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    serializedOrder: { type: "string" },
                    signature: { type: "string" },
                    from: { type: "string" },
                    gas,
                    gasPriority,
                },
                required: ["serializedOrder", "signature", "from", "gas"]
            },
        },

        // Field Mapping for getOrdersUniswapX() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getOrdersUniswapX()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    status: {
                        type: "string",
                        enum: ["open", "expired", "error", "cancelled", "filled", "insufficient-funds", "all"],
                        default: "all"
                    },
                    orderHashes: { type: "string" },
                    filler: { type: "string" },
                    sort: { type: "string", enum: ["asc", "desc"], default: "desc" }
                },
                required: []
            },
        },

        // Field Mapping for swap1inch() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "swap1inch()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    path: { type: "array", minItems: 2, maxItems: 2 },
                    amountIn: { type: "string", pattern: '^[1-9][0-9]*$', errorMessage: 'amountIn should be numeric and greater than 0' },
                    slippage: { type: "string", default: "1", "pattern": "^(10|10(\\.0+)|\\d(\\.\\d+)?)$" },
                    from: { type: "string" },
                    gas: { type: "string" },
                    gasPriority
                },
                required: ["path", "amountIn", "from", "gas"]
            },
        },

        // Field Mapping for getPrice1inch() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getPrice1inch()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    path: { type: "array", minItems: 2, maxItems: 2 },
                    amountIn: { type: "string", pattern: '^[1-9][0-9]*$', errorMessage: 'amountIn should be numeric and greater than 0' },
                    slippage: { type: "string", default: "1", "pattern": "^(10|10(\\.0+)|\\d(\\.\\d+)?)$" }
                },
                required: ["path", "amountIn"]
            }
        },

        // Field Mapping for getPriceKyberswap() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getPriceKyberswap()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    path: { type: "array", minItems: 2, maxItems: 2 },
                    amountIn: { type: "string",  pattern: '^[1-9][0-9]*$', errorMessage: 'amountIn should be numeric and greater than 0' },
                },
                required: ["path", "amountIn"]
            }
        },

        // Field Mapping for swapKyberswap() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "swapKyberswap()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    path: { type: "array", minItems: 2, maxItems: 2 },
                    amountIn: { type: "string" },
                    amountOutMin: { type: "string" },
                    slippage: { type: "string", default: "1", "pattern": "^(10|\\d(\\.\\d+)?)$" },
                    involveBaseToken: { type: "string", enum: ["0", "1", "2"], default: "0" },
                    from: { type: "string" },
                    to: { type: "string" },
                    gas,
                    gasPriority
                },
                required: ["path", "amountIn", "amountOutMin", "from", "to", "gas"]
            },
        },

        // Field Mapping for swapAggregator() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "swapAggregator()" },
                }
            },
            then: {
                properties: {
                    path: { type: "array", minItems: 2, maxItems: 2 },
                    amountIn: { type: "string" },
                    from: { type: "string" },
                    to: { type: "string" },
                    chainId: { type: "string" },
                    chainSymbol: { type: "string" },
                    bestSwap: { type: "boolean", default: false },
                    excludedDexes: { type: "array" },
                    gas,
                    gasPriority,
                },
                required: ["path", "amountIn", "from", "to", "gas"]
            }
        },

        // Field Mapping for quoteAggregator() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "quoteAggregator()" },
                }
            },
            then: {
                properties: {
                    path: { type: "array", minItems: 2, maxItems: 2 },
                    amountIn: { type: "string" },
                    chainId: { type: "string" },
                    chainSymbol: { type: "string" },
                    excludedDexes: { type: "array" },
                },
                required: ["path", "amountIn"]
            }
        },

        //  Field mapping for metadataOfEvmNFT721() Function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "metadataOfEvmNFT721()" },
                }
            },
            then: {
                properties: {
                    nftCollection: { type: "string" },
                    chainId: { type: "string" },
                    chainSymbol: { type: "string" }
                },

                required: ['nftCollection'],

            }
        },

        //  Field mapping for getTransactionSquidRouter() Function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getTransactionSquidRouter()" },
                }
            },
            then: {
                properties: {
                    bridgeId: { type: "string" },
                    transactionHash: { type: "string" },
                },
                required: ['transactionHash'],
            }
        },

        //  Field mapping for swapSquidRouter() Function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "swapSquidRouter()" },
                }
            },
            then: {
                properties: {
                    bridgeId: { type: "string" },
                    srcChainId: { type: "string", default: "1" },
                    dstChainId: { type: "string" },
                    srcTokenSymbol: { type: "string" },
                    dstTokenSymbol: { type: "string" },
                    amountIn: { type: "string" },
                    from: { type: "string" },
                    gas,
                    to: { type: "string" },
                    gasPriority,
                    slippage
                },
                required: ['dstChainId', "srcTokenSymbol", "dstTokenSymbol", "amountIn", "from", "to", "gas"],
            }
        },

        //  Field mapping for getPriceSquidRouter() Function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getPriceSquidRouter()" },
                }
            },
            then: {
                properties: {
                    bridgeId: { type: "string" },
                    srcChainId: { type: "string", default: "1" },
                    dstChainId: { type: "string" },
                    srcTokenSymbol: { type: "string" },
                    dstTokenSymbol: { type: "string" },
                    amountIn: { type: "string" }
                },
                required: ['dstChainId', "srcTokenSymbol", "dstTokenSymbol", "amountIn"],
            }
        },

        //  Field mapping for getTokensSupportedSquidRouter() Function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getTokensSupportedSquidRouter()" },
                }
            },
            then: {
                properties: {
                    bridgeId: { type: "string" },
                    srcChainId: { type: "string", default: "1" },
                },
                required: [],
            }
        },

        //  Field mapping for getChainsSupportedSquidRouter() Function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getChainsSupportedSquidRouter()" },
                }
            },
            then: {
                properties: {
                    bridgeId: { type: "string" },
                },
                required: [],
            }
        },

        // Field Mapping for getUserTransaction
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getUserTransaction" },
                }
            },
            then: {
                properties: {
                    chainId: { type: "string" },
                    chainSymbol: { type: "string" },
                    address: { type: "string" },
                    startBlock: { type: "string", pattern: '^[0-9][0-9]*$', "errorMessage": "Value should be positive integer" },
                    endBlock: { type: "string", pattern: '^[1-9][0-9]*$', "errorMessage": "Value should be greater than 0" },
                    pageSize: { type: "string" },
                    sortOrder: { type: "string" },
                    pageToken: { type: "string" },
                    function: {},
                },
                required: ["address"],
                additionalProperties: false,
                errorMessage: "Allowed values are chainId/chainSymbol, address , startBlock , endBlock, pageToken, sortOrder"
            }
        },

        // Field Mapping for getHistoricalRewards
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getHistoricalRewards" },
                }
            },
            then: {
                properties: {
                    chainId: { type: "string" },
                    chainSymbol: { type: "string" },
                    address: { type: "string" },
                    pageSize: { type: "string" },
                    sortOrder: { type: "string" },
                    pageToken: { type: "string" },
                    function: {},
                },
                required: ["address"],
                additionalProperties: false,
                errorMessage: "Allowed values are chainId, address, pageToken, sortOrder"

            }
        },

        // Field Mapping for getOrdersDYDX, getHistoricalPnL, getAssets, getFills, getPerpetualPositions
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getOrdersDYDX()" },
                }
            },
            then: {
                properties: {
                    derivativeId: { type: "string" },
                    address: { type: "string" },
                    subAccountNumber: { type: "string", pattern: '^[0-9][0-9]*$', "errorMessage": "Value should be positive integer" },
                },
                required: ["address", "subAccountNumber"]
            }
        },

        // Field Mapping for getOrderDYDX
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getOrderDYDX()" },
                }
            },
            then: {
                properties: {
                    derivativeId: { type: "string" },
                    orderId: { type: "string" },
                },
                required: ["orderId"]
            }
        },

        // Field Mapping for getSubAccountsDYDX
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getSubAccountsDYDX()" },
                }
            },
            then: {
                properties: {
                    derivativeId: { type: "string" },
                    address: { type: "string" },
                },
                required: ["address"]
            }
        },

        // Field Mapping for getUserPortfolio
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getUserPortfolio" },
                }
            },
            then: {
                properties: {
                    chainId: { type: "string" },
                    chainSymbol: { type: "string" },
                    address: { type: "string" },
                    tokens: { type: "string", },
                    availableOnly: { type: "string", default: "false", enum: ["true", "false"] },
                    pageToken: { type: "string", default: "null" },
                    assetType: { type: "string", default: "all", enum: ["fungible", "nonFungible", "all"] }
                },
                required: ["address"],
            }
        },

        // Field Mapping for getTonUserTransactions
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getTonUserTransactions" },
                }
            },
            then: {
                properties: {
                    chainId: { type: "string" },
                    chainSymbol: { type: "string" },
                    address: { type: "string" },
                    limit: { type: "string", default: '5', "pattern": "^[1-5]*$", errorMessage: 'Limit should be numeric and between 1 to 5' },
                },
                required: ["address"],
            }
        },

        // Schema Mapping for real world assets category
        // Field Mapping for getXLMBalance
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getXLMBalance" },
                }
            },
            then: {
                properties: {
                    chainId: { type: "string" },
                    chainSymbol: { type: "string" },
                    address: { type: "string" },
                    assetCode: tokenCode,
                    issuer: { type: "string" },
                },
                required: ["address"],
            }
        },

        // Field Mapping for stellarIssueAsset
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "stellarIssueAsset" },
                }
            },
            then: {
                properties: {
                    chainId: { type: "string" },
                    chainSymbol: { type: "string" },
                    issuer: { type: "string" },
                    assetCode: tokenCode,
                    amount: { type: "string", pattern: '^[1-9][0-9]*$', "errorMessage": "Value should be positive greater than 0" },
                    to: { type: "string" },
                },
                required: ["issuer", "assetCode", "amount", "to"],
            }
        },

        // Field Mapping for setTrustlineAndBurnAsset
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "setTrustlineAndBurnAsset" },
                }
            },
            then: {
                properties: {
                    chainId: { type: "string" },
                    chainSymbol: { type: "string" },
                    from: { type: "string" },
                    amount: { type: "string", pattern: '^[1-9][0-9]*$', "errorMessage": "Value should be positive greater than 0" },
                    issuer: { type: "string" },
                    assetCode: tokenCode
                },
                required: ["from", "amount", "issuer", "assetCode"],
            }
        },

        // Field Mapping for stellarTransferAsset
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "stellarTransferAsset" },
                }
            },
            then: {
                properties: {
                    chainId: { type: "string" },
                    chainSymbol: { type: "string" },
                    from: { type: "string" },
                    to: { type: "string" },
                    amount: { type: "string", pattern: '^[1-9][0-9]*$', "errorMessage": "Value should be positive greater than 0" },
                    issuer: { type: "string" },
                    assetCode: tokenCode
                },
                required: ["from", "to", "amount", "issuer", "assetCode"],
            }
        },

        // Field Mapping for stellarFreezeAsset
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "stellarFreezeAsset" },
                }
            },
            then: {
                properties: {
                    chainId: { type: "string" },
                    chainSymbol: { type: "string" },
                    user: { type: "string" },
                    issuer: { type: "string" },
                    assetCode: tokenCode
                },
                required: ["user", "issuer", "assetCode"],
            }
        },

        // Field Mapping for getStellarStorage() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getStellarStorage()" },
                }
            },
            then: {
                properties: {
                    keys: { type: "string" },
                    chainId: { type: "string" },
                    chainSymbol: { type: "string", maxLength: 7, minLength: 3 },
                },
                required: ["keys"]
            },
        },

        // Field Mapping for getEventsSoroban() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getEventsSoroban()" },
                }
            },
            then: {
                properties: {
                    startBlock: { type: "string", pattern: '^[1-9][0-9]*$', "errorMessage": "Value should be positive greater than 0" },
                    pageToken: { type: "string" },
                    contracts: { type: "string" },
                    topics1: { type: "string" },
                    topics2: { type: "string" },
                    topics3: { type: "string" },
                    topics4: { type: "string" },
                    topics5: { type: "string" },
                    type: { type: "string", enum: ["system", "contract", "diagnostic", "all"], default: "all" },
                    chainId: { type: "string" },
                    chainSymbol: { type: "string", maxLength: 7, minLength: 3 },
                },
                required: []
            },
        },

        // Field Mapping for getLatestLedgerStellar() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getLatestLedgerStellar()" },
                }
            },
            then: {
                properties: {
                    chainId: { type: "string" },
                    chainSymbol: { type: "string", maxLength: 7, minLength: 3 },
                },
                required: []
            },
        },

        // Field Mapping for Lido Functions
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "stakeLido" },
                }
            },
            then: {
                properties: {
                    liquidStakingId: { type: "string" },
                    from: { type: "string" },
                    amount: { type: "string", "pattern": "^(\\d+?)$", errorMessage: 'Amount should be a numeric value.' },
                    gas,
                    gasPriority
                },
                required: ["from", "amount", "gas"],
            }
        },

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "approveLido" },
                }
            },
            then: {
                properties: {
                    liquidStakingId: { type: "string" },
                    from: { type: "string" },
                    amount: { type: "string" },
                    gas,
                    gasPriority
                },
                required: ["from", "amount", "gas"],
            }
        },

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "claimLido" },
                }
            },
            then: {
                properties: {
                    liquidStakingId: { type: "string" },
                    from: { type: "string" },
                    requestId: { type: "string" },
                    gas,
                    gasPriority
                },
                required: ["from", "requestId", "gas"],
            }
        },

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "decreaseAllowance" },
                }
            },
            then: {
                properties: {
                    liquidStakingId: { type: "string" },
                    from: { type: "string" },
                    tokenAddress: { type: "string" },
                    spender: { type: "string" },
                    subtractedAmount: { type: "string" },
                    gas,
                    gasPriority
                },
                required: ["from", "gas", "spender", "subtractedAmount", "tokenAddress"],
            }
        },

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "increaseAllowance" },
                }
            },
            then: {
                properties: {
                    liquidStakingId: { type: "string" },
                    from: { type: "string" },
                    tokenAddress: { type: "string" },
                    spender: { type: "string" },
                    addedAmount: { type: "string" },
                    gas,
                    gasPriority
                },
                required: ["from", "gas", "spender", "addedAmount", "tokenAddress"],
            }
        },

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "lidoWrap" },
                }
            },
            then: {
                properties: {
                    liquidStakingId: { type: "string" },
                    from: { type: "string" },
                    amount: { type: "string" },
                    gas,
                    gasPriority
                },
                required: ["from", "gas", "amount"],
            }
        },

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "reqWithdraw" },
                }
            },
            then: {
                properties: {
                    liquidStakingId: { type: "string" },
                    from: { type: "string" },
                    amount: { type: "string" },
                    ownerAddress: { type: "string" },
                    gas,
                    gasPriority
                },
                required: ["from", "gas", "amount", "ownerAddress"],
            }
        },

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getAPR" },
                }
            },
            then: {
                properties: {
                    liquidStakingId: { type: "string" },

                },
                required: [],
            }
        },

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getAllowance" },
                }
            },
            then: {
                properties: {
                    liquidStakingId: { type: "string" },
                    owner: { type: "string" },
                    tokenAddress: { type: "string" },
                    spender: { type: "string" }
                },
                required: ["owner", "tokenAddress", "spender"],
            }
        },

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getWithdrawalRequests" },
                }
            },
            then: {
                properties: {
                    liquidStakingId: { type: "string" },
                    address: { type: "string" }
                },
                required: ["address"],
            }
        },

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getStatusWithdrawalRequests" },
                }
            },
            then: {
                properties: {
                    liquidStakingId: { type: "string" },
                    requestId: { type: "string" }
                },
                required: ["requestId"],
            }
        },

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getStakeLido" },
                }
            },
            then: {
                properties: {
                    liquidStakingId: { type: "string" },
                    address: { type: "string" }
                },
                required: ["address"],
            }
        },

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getRewardsLido" },
                }
            },
            then: {
                properties: {
                    liquidStakingId: { type: "string" },
                    address: { type: "string" },
                    page: { type: "string", "pattern": "^(\\d+?)$", errorMessage: 'page should be a numeric value.' }
                },
                required: ["address"],
            }
        },

        // Orca

        //  Field mapping for swapOrca() Function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "swapOrca()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    from: { type: "string" },
                    path: { type: "array", minItems: 2, maxItems: 2 },
                    slippage,
                    amountIn: { type: "string", "pattern": "^(\\d+?)$", errorMessage: 'AmountIn should be numeric value.' },
                    closeWSolAccount: { type: "boolean", default: false }
                },
                required: ["amountIn", "from", "path"],
            }
        },

        //  Field mapping for addLiqui() Function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "addLiquiOrca()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    from: { type: "string" },
                    path: { type: "array", minItems: 2, maxItems: 2 },
                    slippage,
                    amountIn: { type: "array" }
                },
                required: ["amountIn", "from", "path"],
            }
        },

        //  Field mapping for priceOrca() Function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "priceOrca()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    path: { type: "array", minItems: 2, maxItems: 2 },
                    amountIn: { type: "string", "pattern": "^(\\d+?)$", errorMessage: 'AmountIn should be numeric value.' }
                },
                required: ["amountIn", "path"],
            }
        },

        //  Field mapping for removeOrca() Function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "removeOrca()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    from: { type: "string" },
                    path: { type: "array", minItems: 2, maxItems: 2 },
                    positionAddress: { type: "string" },
                    slippage,
                    liquidity: { type: "string" }
                },
                required: ["positionAddress", "from", "liquidity", "path"],
            }
        },

        //  Field mapping for orcaGetLiqui() Function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "liquidityOrca()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    positionNFT: { type: "string" },
                },
                required: ["positionNFT"],
            }
        },

        //  Field mapping for orcaGetLiqui() Function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "poolOrca()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    poolAddress: { type: "string" },
                },
                required: ["poolAddress"],
            }
        },

        // Field Mapping for getPriceJUP() function

        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getPriceJUP" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    path: { type: "array", minItems: 2, maxItems: 2 },
                    amountIn: { type: "string", "pattern": "^(\\d+?)$", errorMessage: 'amountIn should be numeric value.' }
                },
                required: ["path", "amountIn"]
            }
        },

        // Field Mapping for swapJupiter() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "swapJupiter" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    from: { type: "string" },
                    path: { type: "array", minItems: 2, maxItems: 2 },
                    amountIn: { type: "string", "pattern": "^(\\d+?)$", errorMessage: 'amountIn should be numeric value.' },
                    slippage
                },
                required: ["path", "amountIn", "from"]
            }
        },

        // Schema mapping for chorusOneReqWithdraw
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "chorusOneReqWithdraw" },
                }
            },
            then: {
                properties: {
                    liquidStakingId: { type: "string" },
                    from: { type: "string" },
                    amount: { type: "string", pattern: '^[1-9][0-9]*$', "errorMessage": "Value should be an integer greater than 0" },
                    gas,
                    gasPriority
                },
                required: ["from", "amount", "gas"],
            }
        },

        // Schema mapping for claimChorusOne
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "claimChorusOne" },
                }
            },
            then: {
                properties: {
                    liquidStakingId: { type: "string" },
                    from: { type: "string" },
                    requestId: {
                        type: "string",
                        pattern: '^[1-9][0-9]*$', "errorMessage": "requestId should be an integer greater than 0"
                    },
                    gas,
                    gasPriority
                },
                required: ["from", "requestId", "gas"],
            }
        },

        // Schema mapping for mintChorusOne
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "mintChorusOne" },
                }
            },
            then: {
                properties: {
                    liquidStakingId: { type: "string" },
                    from: { type: "string" },
                    referrer: { type: "string", default: "0x0000000000000000000000000000000000000000" },
                    amount: { type: "string", pattern: '^[1-9][0-9]*$', "errorMessage": "Value should be an integer greater than 0" },
                    gas,
                    gasPriority
                },
                required: ["from", "amount", "gas"],
            }
        },

        // Schema mapping for burnChorusOne
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "burnChorusOne" },
                }
            },
            then: {
                properties: {
                    liquidStakingId: { type: "string" },
                    from: { type: "string" },
                    amount: { type: "string", pattern: '^[1-9][0-9]*$', "errorMessage": "Value should be an integer greater than 0" },
                    gas,
                    gasPriority
                },
                required: ["from", "amount", "gas"],
            }
        },

        // Schema mapping for getRewardsChorusOne
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getRewardsChorusOne" },
                }
            },
            then: {
                properties: {
                    liquidStakingId: { type: "string" },
                    address: { type: "string" },
                    startBlock: { type: "string", pattern: '^[0-9][0-9]*$', "errorMessage": "Value should be an integer" },
                    endBlock: { type: "string", pattern: '^[1-9][0-9]*$', "errorMessage": "Value should be an integer greater than 0" },
                },
                required: ["address"],
            }
        },

        // Field Mapping for Stellar DEX
        // Field Mapping for addLiquiditySDEX() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "addLiquiditySDEX" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    path: { type: "array", minItems: 2, maxItems: 2 },
                    amountIn: { type: "array", minItems: 2, maxItems: 2 },
                    from: { type: "string" },
                    slippage
                },
                required: ["path", "amountIn", "from"]
            }
        },
         // Field Mapping for removeLiquiditySDEX() function
         {
            if: {
                properties: {
                    function: { type: "string", pattern: "removeLiquiditySDEX" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    path: { type: "array", minItems: 2, maxItems: 2 },
                    amountOutMin: { type: "array", minItems: 2, maxItems: 2 },
                    liquidity: { type: "string", pattern: '^[1-9][0-9]*$', "errorMessage": "liquidity should be positive greater than 0"},
                    from: { type: "string" },
                    slippage
                },
                required: ["path", "liquidity", "from", "amountOutMin"]
            }
        },

        // Field Mapping for swapSDEX() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "swapSDEX()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    path: { type: "array", minItems: 2, maxItems: 2 },
                    amountIn: { type: "string", pattern: '^[1-9][0-9]*$', "errorMessage": "amountIn should be positive integer greater than 0" },
                    amountOutMin: {
                        type: "string", pattern: '^[1-9][0-9]*$', "errorMessage": "amountOutMin should be positive integer greater than 0"
                    },
                    from: { type: "string" },
                    slippage
                },
                required: ["amountIn", "amountOutMin", "from", "path"]
            }
        },

        // Field Mapping for getLiquiditySDEX() function
        {
            if: {
                properties: {
                    function: { type: "string", pattern: "getLiquiditySDEX()" },
                }
            },
            then: {
                properties: {
                    dexId: { type: "string" },
                    path: { type: "array", minItems: 2, maxItems: 2 },
                    address: { type: "string" },
                },
                required: ["address", "path"]
            }
        },
    ]
};
