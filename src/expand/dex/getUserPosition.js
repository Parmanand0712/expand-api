/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
/* 
 * All the function in this file
 * should be returning the following schema
 * 
 * 
    {
        "liquidity": "123123231"
    }  
 */

const async = require('async');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const schemaValidator = require('../../../common/configuration/schemaValidator');
const config = require('../../../common/configuration/config.json');
const uniswapV2FactoryAbi = require('../../../assets/abis/uniswapV2FactoryAbi.json');
const uniswapV2PoolAbi = require('../../../assets/abis/uniswapV2PoolAbi.json');
const sushiswapV2FactoryAbi = require('../../../assets/abis/sushiswapV2FactoryAbi.json');
const sushiswapv2PoolAbi = require('../../../assets/abis/sushiswapV2PoolAbi.json');
const pancakeswapV2FactoryAbi = require('../../../assets/abis/pancakeswapFactoryAbi.json');
const pancakeswapV2PoolAbi = require('../../../assets/abis/pancakeswapPoolAbi.json');
const uniswapV3NFTAbi = require('../../../assets/abis/uniswapV3NFTAbi.json');
const balancerV2VaultAbis = require('../../../assets/abis/balancerV2Vault.json');
const balancerV2PoolAbis = require('../../../assets/abis/balancerV2Pools.json');
const erc20ABI = require('../../../assets/abis/iERC20.json');
const uniswapV3FactoryAbi = require('../../../assets/abis/uniswapV3Factory.json');
const { getSymbolEvm } = require('../fungibleTokens/getSymbol');
const { getABIFile } = require('../../../common/curveCommon');

const invalidContract = {
    'message': errorMessage.error.message.contractExecutionError,
    'code': errorMessage.error.code.invalidInput
};

const notApplicable = {
    'message': errorMessage.error.message.notApplicable,
    'code': errorMessage.error.code.notApplicable
};

module.exports = {

    getPositionUniswapV2: async (web3, options) => {


        const poolAddresses = {};
        let liquidityPools = {};
        const poolSymbols = [];
        let aggregatedLiquidity = BigInt(0);
        const filterOptions = options;
        filterOptions.function = "getPositionUniswapV2()";

        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        try {

            filterOptions.factoryAddress = config.dex[filterOptions.dexId].factoryAddress;
            const factory = new web3.eth.Contract(uniswapV2FactoryAbi, filterOptions.factoryAddress);

            if (filterOptions.poolAddresses === undefined) {
                // Assign totalPoolLength to poolSize if poolSize is undefined or null
                const batchSize = 100;
                const batchIndices = Array.from({ length: Math.ceil(filterOptions.poolSize / batchSize) }, (_, i) => i);

                const fulfilledResults = []; // To store the results of the batches 

                // Use async.forEach instead of map for parallel execution
                await new Promise((resolve, reject) => {
                    async.forEach(
                        batchIndices,
                        async (batchIndex) => {
                            const startIndex = batchIndex * batchSize;
                            const endIndex = Math.min((batchIndex + 1) * batchSize, filterOptions.poolSize);

                            const batchPoolAddresses = {};
                            const batchLiquidityPools = {};

                            for (let i = startIndex; i < endIndex; i += 1) {
                                const pairAddress = await factory.methods.allPairs(i).call();

                                const pairContract = new web3.eth.Contract(uniswapV2PoolAbi, pairAddress);
                                const liquidity = await pairContract.methods.balanceOf(filterOptions.address).call();

                                if (liquidity !== "0") {
                                    const token0 = await pairContract.methods.token0().call();
                                    const token1 = await pairContract.methods.token1().call();
                                    const token1Name = await getSymbolEvm(web3, { tokenAddress: token0 });
                                    const token2Name = await getSymbolEvm(web3, { tokenAddress: token1 });
                                    poolSymbols.push(`${token1Name.symbol}${token2Name.symbol}`);
                                    batchPoolAddresses[`${token1Name.symbol}${token2Name.symbol}`] = pairAddress;
                                    batchLiquidityPools[pairAddress] = liquidity;
                                    aggregatedLiquidity += BigInt(liquidity);
                                }
                            }

                            fulfilledResults.push({ aggregatedLiquidity, poolAddresses: batchPoolAddresses, liquidity: batchLiquidityPools });
                        },
                        // eslint-disable-next-line consistent-return
                        (err) => {
                            if (err) {
                                reject(invalidContract);
                            } else {
                                resolve();
                            }
                        }
                    );
                });

                liquidityPools = Object.assign({}, ...fulfilledResults.map(result => result.liquidity));
                
                poolSymbols.forEach((pairName, index) => {
                    const address = Object.keys(liquidityPools)[index];
                    const value = Object.values(liquidityPools)[index];

                    poolAddresses[pairName] = {
                        [address]: value
                    };
                });

                return { "aggregatedLiquidity": ((aggregatedLiquidity)).toString(), poolAddresses };
            }
            else {
                const batchPoolAddresses = {};
                const batchLiquidityPools = {};
                const poolArray = (filterOptions.poolAddresses).split(",").map(item => item.trim());
                try {
                    for (let i = 0; i <= poolArray.length - 1; i += 1) {
                        const pairContract = new web3.eth.Contract(uniswapV2PoolAbi, poolArray[i]);
                        const liquidity = await pairContract.methods.balanceOf(filterOptions.address).call();
                        const token0 = await pairContract.methods.token0().call();
                        const token1 = await pairContract.methods.token1().call();
                        const token1Name = await getSymbolEvm(web3, { tokenAddress: token0 });
                        const token2Name = await getSymbolEvm(web3, { tokenAddress: token1 });
                        poolSymbols.push(`${token1Name.symbol}${token2Name.symbol}`);
                        batchPoolAddresses[`${token1Name.symbol}${token2Name.symbol}`] = poolArray[i];
                        batchLiquidityPools[poolArray[i]] = liquidity;
                        aggregatedLiquidity += BigInt(liquidity);

                    }

                    poolSymbols.forEach((pairName, index) => {
                        const address = Object.keys(batchLiquidityPools)[index];
                        const value = Object.values(batchLiquidityPools)[index];

                        poolAddresses[pairName] = {
                            [address]: value
                        };
                    });

                    return ({ "aggregatedLiquidity": ((aggregatedLiquidity)).toString(), poolAddresses });
                }
                catch (error) {
                    return (`${invalidContract.message}: ${error} `);
                }
            }

        } catch (error) {
            return (`${invalidContract.message}: ${error} `);
        }




    },

    getPositionSushiswapV2: async (web3, options) => {

        const poolAddresses = {};
        let liquidityPools = {};
        const poolSymbols = [];
        let aggregatedLiquidity = BigInt(0);
        const filterOptions = options;
        filterOptions.function = "getPositionUniswapV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        try {

            filterOptions.factoryAddress = config.dex[filterOptions.dexId].factoryAddress;
            const factory = new web3.eth.Contract(sushiswapV2FactoryAbi, filterOptions.factoryAddress);

            if (filterOptions.poolAddresses === undefined) {

                // Assign totalPoolLength to poolSize if poolSize is undefined or null
                const batchSize = 100;
                const batchIndices = Array.from({ length: Math.ceil(filterOptions.poolSize / batchSize) }, (_, i) => i);

                const fulfilledResults = []; // To store the results of the batches 

                // Use async.forEach instead of map for parallel execution
                await new Promise((resolve, reject) => {
                    async.forEach(
                        batchIndices,
                        async (batchIndex) => {
                            const startIndex = batchIndex * batchSize;
                            const endIndex = Math.min((batchIndex + 1) * batchSize, filterOptions.poolSize);

                            const batchPoolAddresses = {};
                            const batchLiquidityPools = {};

                            for (let i = startIndex; i < endIndex; i += 1) {
                                const pairAddress = await factory.methods.allPairs(i).call();

                                const pairContract = new web3.eth.Contract(sushiswapv2PoolAbi, pairAddress);
                                const liquidity = await pairContract.methods.balanceOf(filterOptions.address).call();

                                if (liquidity !== "0") {
                                    const token0 = await pairContract.methods.token0().call();
                                    const token1 = await pairContract.methods.token1().call();
                                    const token1Name = await getSymbolEvm(web3, { tokenAddress: token0 });
                                    const token2Name = await getSymbolEvm(web3, { tokenAddress: token1 });
                                    poolSymbols.push(`${token1Name.symbol}${token2Name.symbol}`);
                                    batchPoolAddresses[`${token1Name.symbol}${token2Name.symbol}`] = pairAddress;
                                    batchLiquidityPools[pairAddress] = liquidity;
                                    aggregatedLiquidity += BigInt(liquidity);
                                }
                            }

                            fulfilledResults.push({ aggregatedLiquidity, poolAddresses: batchPoolAddresses, liquidity: batchLiquidityPools });
                        },
                        (err) => {
                            if (err) {
                                reject(invalidContract);
                            } else {
                                resolve();
                            }
                        }
                    );
                });

                liquidityPools = Object.assign({}, ...fulfilledResults.map(result => result.liquidity));

                poolSymbols.forEach((pairName, index) => {
                    const address = Object.keys(liquidityPools)[index];
                    const value = Object.values(liquidityPools)[index];

                    poolAddresses[pairName] = {
                        [address]: value
                    };
                });

                return { "aggregatedLiquidity": ((aggregatedLiquidity)).toString(), poolAddresses, };
            }
            else {
                const batchPoolAddresses = {};
                const batchLiquidityPools = {};
                const poolArray = (filterOptions.poolAddresses).split(",").map(item => item.trim());
                try {
                    for (let i = 0; i <= poolArray.length - 1; i += 1) {
                        const pairContract = new web3.eth.Contract(sushiswapv2PoolAbi, poolArray[i]);
                        const liquidity = await pairContract.methods.balanceOf(filterOptions.address).call();
                        const token0 = await pairContract.methods.token0().call();
                        const token1 = await pairContract.methods.token1().call();
                        const token1Name = await getSymbolEvm(web3, { tokenAddress: token0 });
                        const token2Name = await getSymbolEvm(web3, { tokenAddress: token1 });
                        poolSymbols.push(`${token1Name.symbol}${token2Name.symbol}`);
                        batchPoolAddresses[`${token1Name.symbol}${token2Name.symbol}`] = poolArray[i];
                        batchLiquidityPools[poolArray[i]] = liquidity;
                        aggregatedLiquidity += BigInt(liquidity);

                    }

                    poolSymbols.forEach((pairName, index) => {
                        const address = Object.keys(batchLiquidityPools)[index];
                        const value = Object.values(batchLiquidityPools)[index];

                        poolAddresses[pairName] = {
                            [address]: value
                        };
                    });

                    return ({ "aggregatedLiquidity": ((aggregatedLiquidity)).toString(), poolAddresses });
                }
                catch (error) {
                    return (`${invalidContract.message}: ${error} `);
                }
            }

        } catch (error) {
             return (`${invalidContract.message}: ${error} `);
        }

    },

    getPositionPancakeV2: async (web3, options) => {

        const poolAddresses = {};
        let liquidityPools = {};
        let aggregatedLiquidity = BigInt(0);
        const poolSymbols = [];
        const filterOptions = options;
        filterOptions.function = "getPositionUniswapV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }
        try {

            filterOptions.factoryAddress = config.dex[filterOptions.dexId].factoryAddress;
            const factory = new web3.eth.Contract(pancakeswapV2FactoryAbi, filterOptions.factoryAddress);

            if (filterOptions.poolAddresses === undefined) {

                // Assign totalPoolLength to poolSize if poolSize is undefined or null
                const batchSize = 100;
                const batchIndices = Array.from({ length: Math.ceil(filterOptions.poolSize / batchSize) }, (_, i) => i);

                const fulfilledResults = []; // To store the results of the batches 

                // Use async.forEach instead of map for parallel execution
                await new Promise((resolve, reject) => {
                    async.forEach(
                        batchIndices,
                        async (batchIndex) => {
                            const startIndex = batchIndex * batchSize;
                            const endIndex = Math.min((batchIndex + 1) * batchSize, filterOptions.poolSize);

                            const batchPoolAddresses = {};
                            const batchLiquidityPools = {};

                            for (let i = startIndex; i < endIndex; i += 1) {
                                const pairAddress = await factory.methods.allPairs(i).call();

                                const pairContract = new web3.eth.Contract(pancakeswapV2PoolAbi, pairAddress);
                                const liquidity = await pairContract.methods.balanceOf(filterOptions.address).call();

                                if (liquidity !== "0") {
                                    const token0 = await pairContract.methods.token0().call();
                                    const token1 = await pairContract.methods.token1().call();
                                    const token1Name = await getSymbolEvm(web3, { tokenAddress: token0 });
                                    const token2Name = await getSymbolEvm(web3, { tokenAddress: token1 });
                                    poolSymbols.push(`${token1Name.symbol}${token2Name.symbol}`);
                                    batchPoolAddresses[`${token1Name.symbol}${token2Name.symbol}`] = pairAddress;
                                    batchLiquidityPools[pairAddress] = liquidity;
                                    aggregatedLiquidity += BigInt(liquidity);
                                }
                            }

                            fulfilledResults.push({ aggregatedLiquidity, poolAddresses: batchPoolAddresses, liquidity: batchLiquidityPools });
                        },
                        (err) => {
                            if (err) {
                                reject(invalidContract);
                            } else {
                                resolve();
                            }
                        }
                    );
                });

                liquidityPools = Object.assign({}, ...fulfilledResults.map(result => result.liquidity));
               
                poolSymbols.forEach((pairName, index) => {
                    const address = Object.keys(liquidityPools)[index];
                    const value = Object.values(liquidityPools)[index];

                    poolAddresses[pairName] = {
                        [address]: value
                    };
                });

                return { "aggregatedLiquidity": ((aggregatedLiquidity)).toString(), poolAddresses };
            }
            else {
                const batchPoolAddresses = {};
                const batchLiquidityPools = {};
                const poolArray = (filterOptions.poolAddresses).split(",").map(item => item.trim());
                try {
                    for (let i = 0; i <= poolArray.length - 1; i += 1) {
                        const pairContract = new web3.eth.Contract(pancakeswapV2PoolAbi, poolArray[i]);
                        const liquidity = await pairContract.methods.balanceOf(filterOptions.address).call();
                        const token0 = await pairContract.methods.token0().call();
                        const token1 = await pairContract.methods.token1().call();
                        const token1Name = await getSymbolEvm(web3, { tokenAddress: token0 });
                        const token2Name = await getSymbolEvm(web3, { tokenAddress: token1 });
                        poolSymbols.push(`${token1Name.symbol}${token2Name.symbol}`);
                        batchPoolAddresses[`${token1Name.symbol}${token2Name.symbol}`] = poolArray[i];
                        batchLiquidityPools[poolArray[i]] = liquidity;
                        aggregatedLiquidity += BigInt(liquidity);

                    }

                    poolSymbols.forEach((pairName, index) => {
                        const address = Object.keys(batchLiquidityPools)[index];
                        const value = Object.values(batchLiquidityPools)[index];

                        poolAddresses[pairName] = {
                            [address]: value
                        };
                    });

                    return ({ "aggregatedLiquidity": ((aggregatedLiquidity)).toString(), poolAddresses });
                }
                catch (error) {
                    return (`${invalidContract.message}: ${error} `);
                }
            }

        } catch (error) {
             return (`${invalidContract.message}: ${error} `);
        }
    },

    getPositionUniswapV3: async (web3, options) => {

        const poolAddresses = {};
        const liquidityPools = {};
        const poolSymbols = [];
        let aggregatedLiquidity = BigInt(0);
        const filterOptions = options;

        filterOptions.function = "getPositionUniswapV3()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        try {
            filterOptions.positionManager = config.dex[filterOptions.dexId].positionManager;

            if (filterOptions.poolAddresses === undefined) {

                const tokenIdContract = new web3.eth.Contract(
                    uniswapV3NFTAbi,
                    filterOptions.positionManager
                );

                const totalTokenId = await tokenIdContract.methods.balanceOf(
                    filterOptions.address
                ).call();

                const poolContract = new web3.eth.Contract(uniswapV3FactoryAbi, config.dex[filterOptions.dexId].factoryAddress);

                for (let tokenIndex = 0; tokenIndex <= totalTokenId - 1; tokenIndex += 1) {

                    // eslint-disable-next-line no-await-in-loop
                    const tokenId = await tokenIdContract.methods.tokenOfOwnerByIndex(
                        filterOptions.address,
                        tokenIndex
                    ).call();

                    // eslint-disable-next-line no-await-in-loop
                    const liquidity = await tokenIdContract.methods.positions(
                        tokenId
                    ).call();

                    if (liquidity.liquidity !== "0") {
                        const token1Symbol = await getSymbolEvm(web3, { tokenAddress: liquidity.token0 });
                        const token2Symbol = await getSymbolEvm(web3, { tokenAddress: liquidity.token1 });
                        const poolAddress = await poolContract.methods.getPool(liquidity.token0, liquidity.token1, liquidity.fee).call();
                        poolSymbols.push(`${token1Symbol.symbol}${token2Symbol.symbol}`);
                        if (poolAddress in liquidityPools) {

                            let oldLiquidity = BigInt(liquidityPools[poolAddress]);
                            oldLiquidity += BigInt(liquidity.liquidity);
                            liquidityPools[poolAddress] = oldLiquidity.toString();
                        }
                        else {
                            liquidityPools[poolAddress] = liquidity.liquidity;
                        }

                        aggregatedLiquidity += BigInt(liquidity.liquidity);
                    }

                }

                if(filterOptions.dexId !== '1307') { 
                poolSymbols.forEach((pairName, index) => {
                    const address = Object.keys(liquidityPools)[index - 1];
                    const value = Object.values(liquidityPools)[index - 1];

                    poolAddresses[pairName] = {
                        [address]: value
                    };
                });
            }
            else {
                poolSymbols.forEach((pairName, index) => {
                    const address = Object.keys(liquidityPools)[index];
                    const value = Object.values(liquidityPools)[index];

                    poolAddresses[pairName] = {
                        [address]: value
                    };
                });
            }

                return ({ "aggregatedLiquidity": ((aggregatedLiquidity)).toString(), poolAddresses });

            }
            else {

                const tokenIdContract = new web3.eth.Contract(
                    uniswapV3NFTAbi,
                    filterOptions.positionManager
                );

                const totalTokenId = await tokenIdContract.methods.balanceOf(
                    filterOptions.address
                ).call();

                const poolContract = new web3.eth.Contract(uniswapV3FactoryAbi, config.dex[filterOptions.dexId].factoryAddress);
                const poolArray = (filterOptions.poolAddresses).split(",").map(item => item.trim());
                    
                for (let tokenIndex = 0; tokenIndex <= totalTokenId - 1; tokenIndex += 1) {

                    // eslint-disable-next-line no-await-in-loop
                    const tokenId = await tokenIdContract.methods.tokenOfOwnerByIndex(
                        filterOptions.address,
                        tokenIndex
                    ).call();

                    // eslint-disable-next-line no-await-in-loop
                    const liquidity = await tokenIdContract.methods.positions(
                        tokenId
                    ).call();

                    const poolAddress = await poolContract.methods.getPool(liquidity.token0, liquidity.token1, liquidity.fee).call();
                    for (let i = 0; i <= poolArray.length - 1; i += 1) {
                        if ((poolArray[i]).toLowerCase() === (poolAddress).toLowerCase()) {
                            const token1Symbol = await getSymbolEvm(web3, { tokenAddress: liquidity.token0 });
                            const token2Symbol = await getSymbolEvm(web3, { tokenAddress: liquidity.token1 });
                            poolSymbols.push(`${token1Symbol.symbol}${token2Symbol.symbol}`);
                            if (poolAddress in liquidityPools) {

                                let oldLiquidity = BigInt(liquidityPools[poolAddress]);
                                oldLiquidity += BigInt(liquidity.liquidity);
                                liquidityPools[poolAddress] = oldLiquidity.toString();
                            }
                            else {
                                liquidityPools[poolAddress] = liquidity.liquidity;
                            }

                            aggregatedLiquidity += BigInt(liquidity.liquidity);

                        }
                    }
                }

                const uniqueArray = poolSymbols.filter((item, index) => poolSymbols.indexOf(item) === index);

                uniqueArray.forEach((pairName, index) => {
                    const address = Object.keys(liquidityPools)[index];
                    const value = Object.values(liquidityPools)[index];

                    poolAddresses[pairName] = {
                        [address]: value
                    };
                });

                return ({ "aggregatedLiquidity": ((aggregatedLiquidity)).toString(), poolAddresses });
            }
        }
        catch (error) {
             return (`${invalidContract.message}: ${error} `);
        }

    },

    getPositionBalancerV2: async (web3, options) => {

        const poolAddresses = {};
        const liquidityPools = {};
        const poolSymbols = [];
        let aggregatedLiquidity = BigInt(0);
        const filterOptions = options;

        filterOptions.function = "getPositionUniswapV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        try {

            if (filterOptions.poolAddresses !== undefined) {

                filterOptions.vaultAddress = config.dex[filterOptions.dexId].vaultAddress;

                const balancerV2Vault = new web3.eth.Contract(balancerV2VaultAbis, filterOptions.vaultAddress);
                const poolArray = (filterOptions.poolAddresses).split(",").map(item => item.trim());

                for (let i = 0; i <= poolArray.length - 1; i += 1) {
                    const poolContract = new web3.eth.Contract(
                        balancerV2PoolAbis,
                        poolArray[i]
                    );
                    const poolId = await poolContract.methods.getPoolId().call();

                    const tokenAddresses = await balancerV2Vault.methods.getPoolTokens(poolId).call();
                    const token1Symbol = await getSymbolEvm(web3, { tokenAddress: tokenAddresses.tokens[0] });
                    const token2Symbol = await getSymbolEvm(web3, { tokenAddress: tokenAddresses.tokens[1] });
                    // eslint-disable-next-line no-await-in-loop
                    const liquidity = await poolContract.methods.balanceOf(
                        filterOptions.address
                    ).call();
                    poolSymbols.push(`${token1Symbol.symbol}${token2Symbol.symbol}`);
                    liquidityPools[poolArray[i]] = liquidity;
                    aggregatedLiquidity += BigInt(liquidity);
                }

                poolSymbols.forEach((pairName, index) => {
                    const address = Object.keys(liquidityPools)[index];
                    const value = Object.values(liquidityPools)[index];

                    poolAddresses[pairName] = {
                        [address]: value
                    };
                });

                return ({ "aggregatedLiquidity": ((aggregatedLiquidity)).toString(), poolAddresses });
            }

            else {
                filterOptions.vaultAddress = config.dex[filterOptions.dexId].vaultAddress;

                const balancerV2Vault = new web3.eth.Contract(balancerV2VaultAbis, filterOptions.vaultAddress);

                let poolId = '';
                const pools = config.dex[filterOptions.dexId].balPools;

                for (let i = 0; i < pools.length; i += 1) {
                    poolId = pools[i].poolId;

                    // eslint-disable-next-line no-await-in-loop
                    const poolAddress = await balancerV2Vault.methods.getPool(
                        poolId
                    ).call();

                    const poolContract = new web3.eth.Contract(
                        balancerV2PoolAbis,
                        poolAddress[0]
                    );

                    // eslint-disable-next-line no-await-in-loop
                    const liquidity = await poolContract.methods.balanceOf(
                        filterOptions.address
                    ).call();

                    if (liquidity !== "0") {
                        const tokenAddresses = await balancerV2Vault.methods.getPoolTokens(poolId).call();
                        const token1Symbol = await getSymbolEvm(web3, { tokenAddress: tokenAddresses.tokens[0] });
                        const token2Symbol = await getSymbolEvm(web3, { tokenAddress: tokenAddresses.tokens[1] });
                        poolSymbols.push(`${token1Symbol.symbol}${token2Symbol.symbol}`);
                        // eslint-disable-next-line prefer-destructuring
                        // poolAddresses[`${token1Symbol.symbol}${token2Symbol.symbol}`] = poolAddress[0];
                        liquidityPools[poolAddress[0]] = liquidity;
                        aggregatedLiquidity += BigInt(liquidity);
                    }
                }

                poolSymbols.forEach((pairName, index) => {
                    const address = Object.keys(liquidityPools)[index];
                    const value = Object.values(liquidityPools)[index];

                    poolAddresses[pairName] = {
                        [address]: value
                    };
                });

                return ({ "aggregatedLiquidity": ((aggregatedLiquidity)).toString(), poolAddresses });
            }
        }
        catch (error) {
             return (`${invalidContract.message}: ${error} `);
        }
    },

    getPositionCurveV2: async (web3, options) => {

        const filterOptions = options;

        filterOptions.function = "getPositionCurveV2()";
        const validJson = await schemaValidator.validateInput(filterOptions);

        if (!validJson.valid) {
            return (validJson);
        }

        const poolDetails = {};
        const liquidityPools = {};
        let aggregatedLiquidity = BigInt(0);
        const poolSymbols = [];
        let poolTokenName = '';

        const {dexId, address} = filterOptions;
        const {curvePools} = config.dex[dexId];

        try {
            for (let i = 0; i < curvePools.length; i += 1) {
                const { poolAddress, tokenAddress, tokenAddresses, factory, poolName } = curvePools[i];
                const poolABI = await getABIFile(poolName);

                const liquidityContract = new web3.eth.Contract(
                    factory ? poolABI : erc20ABI,
                    tokenAddress
                );

                const liquidity = await liquidityContract.methods.balanceOf(
                    address
                ).call();

                if (liquidity !== "0") {
                    for (const token of tokenAddresses) {
                        if (token.toLowerCase().includes('0xeeeeeeeeee')) {
                            poolTokenName += 'ETH';
                        }
                        else {
                            const tokenSymbol = await getSymbolEvm(web3, { tokenAddress: token });
                            poolTokenName += tokenSymbol.symbol;
                        }
                    }
                    poolSymbols.push(poolTokenName);
                    poolDetails[poolTokenName] = poolAddress;
                    liquidityPools[poolAddress] = liquidity;
                    aggregatedLiquidity += BigInt(liquidity);
                }

                poolSymbols.forEach((pairName, index) => {
                    const tAddress = Object.keys(liquidityPools)[index];
                    const value = Object.values(liquidityPools)[index];

                    poolDetails[pairName] = {
                        [tAddress]: value
                    };
                });

            };
            return ({ "aggregatedLiquidity": ((aggregatedLiquidity)).toString(), poolDetails });
        }
        catch (error) {
             return (`${invalidContract.message}: ${error} `);
        }
    },

    getPositionTraderJoe: async () => notApplicable,
    getPositionStonFi: async () => notApplicable,
    getPositionSDEX: async () => notApplicable,
    getPositionOrca: async () => notApplicable
};
