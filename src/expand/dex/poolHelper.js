/* eslint-disable no-param-reassign */
/* eslint-disable no-promise-executor-return */
/* eslint-disable no-loop-func */

/* eslint-disable no-await-in-loop */
const axios = require('axios');
const rateLimit = require('axios-rate-limit');
const fs = require('fs');
const redis = require('../../../common/redis/index');
const config = require('../../../common/configuration/config.json');
const errorMessage = require('../../../common/configuration/errorMessage.json');
const uniswapV2FactoryAbi = require('../../../assets/abis/uniswapV2FactoryAbi.json');
const uniswapV3FactoryAbi = require('../../../assets/abis/uniswapV3Factory.json');
const sushiswapV2FactoryAbi = require('../../../assets/abis/sushiswapV2FactoryAbi.json');
const balancerVaultAbi = require('../../../assets/abis/balancerV2Vault.json');

const throwErrorMessage = (msg) => ({
    'message': errorMessage.error.message[msg],
    'code': errorMessage.error.code.invalidInput
});
  
  const propertiesToConvert = [
    "blockNumber",
    "gas",
    "maxFeePerGas",
    "maxPriorityFeePerGas",
    "gasPrice",
    "nonce",
    "transactionIndex",
    "value",
    "type",
    "chainId"
  ];

  function convertHexValuesToNumbers(obj) {
    propertiesToConvert.forEach(prop => {
      if (obj[prop]) {
        obj[prop] = parseInt(obj[prop], 16).toString();
      }
    });

    return obj;
}

const getEventData = async (web3 , factoryAddress, abi, poolEvent , steps , method) => {
    const contract = new web3.eth.Contract(abi, factoryAddress);
    const data = await axios.get(config.etherscan.baseUrl[config.dex[1000].chainId], {
        params: {
            module: config.etherscan.moduleGeneric,
            action: config.etherscan.actionContract,
            contractaddresses: factoryAddress,
            apiKey: config.etherscan.keys[config.dex[1000].chainId],
        },
    }).then(res => (res.data.result[0].txHash));

    const fromBlock = await web3.eth.getTransaction(data).then(res => res.blockNumber);
    const endBlock = await web3.eth.getBlockNumber();
    const poolsData = [];

    for (let i = fromBlock; i <= endBlock; i += steps - 1) {
        poolsData.push(contract.getPastEvents(poolEvent, {
            fromBlock: i,
            toBlock: Math.min((i + steps - 1), endBlock),
        }));
    }

    const eventData = await Promise.all(poolsData);
    
    const result = [];

    for (const events of eventData) {
        for (const event of events) {
            result.push(event.returnValues[method].toLowerCase());
        }
    }

    return result;
};

module.exports = {

    getPoolWalletAddresses: async (web3) => {

        const cacheKey = `poolAddressesForPoolWalletAddress`;
        if(await redis.EXISTS(cacheKey)){
            console.log("keyExists");
            const cachedData = await redis.get(cacheKey);
            const parsedData = JSON.parse(cachedData);
            return parsedData;
        }
        const dexIds = config.walletPositions.dexesSupport;
        const [uniswapV3PoolsData, uniswapV2PoolsData, sushiswapV2PoolsData, balancerV2PoolsData, curveV2PoolsData] = await Promise.all([
            getEventData(web3, config.dex[dexIds[2]].factoryAddress, uniswapV3FactoryAbi, 'PoolCreated', 200000, "pool"),
            getEventData(web3, config.dex[dexIds[0]].factoryAddress, uniswapV2FactoryAbi, 'PairCreated', 50000, "pair"),
            getEventData(web3, config.dex[dexIds[1]].factoryAddress, sushiswapV2FactoryAbi, 'PairCreated', 50000, "pair"),
            getEventData(web3, config.dex[dexIds[3]].vaultAddress, balancerVaultAbi, 'PoolRegistered', 50000, "poolAddress"),
            axios.get(config.walletPositions.curveApiForPools)
                .then(res => res.data.data.poolData.map(entry => entry.address.toLowerCase()))
        ]);

        await redis.set(cacheKey, 
            JSON.stringify({ uniswapV3PoolsData, uniswapV2PoolsData, sushiswapV2PoolsData, balancerV2PoolsData, curveV2PoolsData }));
        redis.expire(cacheKey, config.default.ttl);
        return{ uniswapV3PoolsData, uniswapV2PoolsData, sushiswapV2PoolsData, balancerV2PoolsData, curveV2PoolsData };
        
    },

    getPoolIndividualLiqudity: async (web3, options) => {
        let eventHash = [];
        let { batchSize } = config.ellipticSteps;
        let { step, latestBlock, startBlockNumber, endPage } = options;
        const { dexId, poolLiquidityContract, token0Symbol, token1Symbol, startPage } = options;
        const { publicRpc } = config.chains[config.dex[dexId].chainId];
        const promises = [];
        // eslint-disable-next-line no-promise-executor-return
        const timer = ms => new Promise(res => setTimeout(res, ms));
        startBlockNumber = Number(startBlockNumber);
        latestBlock = Number(latestBlock);
        step = Number(step);
        batchSize = Number(batchSize);

        const batchPromises = [];
        for (let startBlock = startBlockNumber; startBlock <= latestBlock; startBlock += batchSize * step) {
            const endBlock = Math.min(startBlock + (batchSize - 1) * step, latestBlock);

            for (let i = startBlock; i <= endBlock; i += step - 1) {
                await timer(15);
                batchPromises.push(
                    poolLiquidityContract.getPastEvents('Mint', {
                        fromBlock: i,
                        toBlock: Math.min((i + step - 1), (latestBlock))
                    })
                );
            }
        }

        const batchEvents = await Promise.all(batchPromises);

        for (const events of batchEvents) {
            for (const event of events) {
                eventHash.push({
                    blockNumber: event.blockNumber,
                    transactionHash: event.transactionHash,
                    token0Value: event.returnValues.amount0,
                    token1Value: event.returnValues.amount1
                });
            }
        }

        eventHash = eventHash.reverse();
        const totalPages = Math.ceil(eventHash.length / 100);
        if (totalPages < endPage) endPage = totalPages;
        if (startPage > totalPages || endPage > totalPages) return throwErrorMessage("invalidInput");
        const currentPages = `${startPage}-${endPage}`;
        const cacheKey = `poolIndividualLiquidity_${options.poolAddress}_${startPage}_${endPage}_${eventHash.length}`;
        const keyExists = await redis.EXISTS(cacheKey);
        if (keyExists) {
            const cachedData = await redis.get(cacheKey);
            const parsedData = JSON.parse(cachedData);
            return parsedData;
        }
        let transactionReciept;
        const http = rateLimit(axios.create(), { maxRequests: 250, perMilliseconds: 1000, maxRPS: 250 });
        for (let i = (Number(startPage - 1) * 100); i <= ((endPage - 1) * 100); i += 100) {
            const chunk = eventHash.slice(i, i + 100);
            // eslint-disable-next-line no-loop-func
            promises.push(chunk.map(async (event) => {
                await timer(20);
                try {
                    transactionReciept = await http(publicRpc, {
                        method: 'POST',
                        data: JSON.stringify({
                            method: 'eth_getTransactionByHash',
                            params: [event.transactionHash],
                            id: Math.random(),
                            jsonrpc: '2.0'
                        }),
                    }).then(res => res.data.result);
                }
                catch (error) {
                    await timer(100);
                    transactionReciept = await web3.eth.getTransaction(event.transactionHash);
                }

                return {
                    userAddress: transactionReciept.from,
                    liquidityData: [{
                        "blockNumber": (typeof (transactionReciept.blockNumber) !== 'number') ? Number(transactionReciept.blockNumber).toString()
                            : Number(transactionReciept.blockNumber).toString(),
                        "assets": {
                            [token0Symbol]: event.token0Value,
                            [token1Symbol]: event.token1Value
                        }
                    }]
                };

            }));

        };


        const flattenedArray = promises.reduce((accumulator, currentArray) => accumulator.concat(currentArray), []);

        const liquidityD = await Promise.all(flattenedArray);

        await redis.set(cacheKey, JSON.stringify({ totalPages: totalPages.toString(), currentPages, users: liquidityD }));

        return { totalPages: totalPages.toString(), currentPages, users: liquidityD };
    },
    getPoolHistoricalTimeSeries: async (web3, options) => {
        const eventHash = [];
        const promises = [];
        const { poolLiquidityContract, startBlock, endBlock, step, decimals, decimalsforToken1, token0Symbol, token1Symbol, poolAddress } = options;
        console.log(startBlock , endBlock);
        const batchSize = Number(config.ellipticSteps.batchSize);
        const { publicRpc } = config.chains[config.dex[options.dexId].chainId];
        // eslint-disable-next-line no-promise-executor-return
        const timer = ms => new Promise(res => setTimeout(res, ms));
        const writeStream = fs.createWriteStream(`temp/eventHashData_${poolAddress}_${startBlock}_${endBlock}`, { encoding: 'utf8' });

        for (let startBlockNumber = Number(startBlock); startBlockNumber <= endBlock; startBlockNumber += batchSize * step) {
            const batchPromises = [];

            for (let i = startBlockNumber; i <= endBlock; i += step + 1) {
                await timer(20);
                batchPromises.push(
                    poolLiquidityContract.getPastEvents('Swap', {
                        fromBlock: i,
                        toBlock: Math.min((i + step ), (endBlock))
                    })
                );
            }

            const batchEvents = await Promise.all(batchPromises);

            for (const events of batchEvents) {
                for (const event of events) {
                    eventHash.push({
                        hash: event.transactionHash,
                        blockNumber: event.blockNumber,
                        price: (options.dexId !== '1300') ? ((event.returnValues.amount1In !== '0') ?
                            ((event.returnValues.amount1In / 10 ** decimalsforToken1) / (event.returnValues.amount0Out / 10 ** decimals)).toString()
                            : ((event.returnValues.amount1Out / 10 ** decimalsforToken1)
                                / (event.returnValues.amount0In / 10 ** decimals)).toString()) :
                            ((Math.abs(event.returnValues.amount1) / 10 ** decimalsforToken1)
                                / (Math.abs(event.returnValues.amount0) / 10 ** decimals)),
                    });
                    writeStream.write(`${JSON.stringify(eventHash[eventHash.length - 1])}\n`);
                }
            }
        }

        writeStream.end();

        if (eventHash.length === 0) return { pair: `${token0Symbol}/${token1Symbol}`, priceData: {} };

        const cacheKey = `getHistoricalTimeSeries${options.poolAddress}_${startBlock}_${endBlock}`;
        const keyExists = await redis.EXISTS(cacheKey);
        if (keyExists) {
            const cachedData = await redis.get(cacheKey);
            const parsedData = JSON.parse(cachedData);
            return parsedData;
        }

        const readStream = await fs.promises.readFile(`temp/eventHashData_${poolAddress}_${startBlock}_${endBlock}`, { encoding: 'utf8' });
        const linesData = readStream.split('\n');

        const http = rateLimit(axios.create(), { maxRequests: 200, perMilliseconds: 1000, maxRPS: 200 });
        let blockReceipt = 0;

        const lines = linesData.slice(0, -1);
        for (let i = 0; i < lines.length - 1; i += 5000) {
            const chunk = lines.slice(i, i + 5000);

            promises.push(
                (chunk.map(async (line) => {
                    const parsedLine = JSON.parse(line);

                    try {
                        await timer(50);
                        blockReceipt = await http(publicRpc, {
                            method: 'POST',
                            data: JSON.stringify({
                                method: 'eth_getBlockByNumber',
                                params: [`0x${(parsedLine.blockNumber).toString(16)}`, false],
                                id: Math.random(),
                                jsonrpc: '2.0'
                            }),
                        }).then(res => parseInt(res.data.result.timestamp, 16));

                        return {
                            hash: parsedLine.hash,
                            timestamp: blockReceipt,
                            price: parsedLine.price
                        };
                    } catch (err) {
                        await timer(200);
                        blockReceipt = await http(publicRpc, {
                            method: 'POST',
                            data: JSON.stringify({
                                method: 'eth_getBlockByNumber',
                                params: [`0x${(parsedLine.blockNumber).toString(16)}`, false],
                                id: Math.random(),
                                jsonrpc: '2.0'
                            }),
                        }).then(res => parseInt(res.data.result.timestamp, 16));

                        return {
                            hash: parsedLine.hash,
                            timestamp: blockReceipt,
                            price: parsedLine.price
                        };
                    }
                }))
            );
        }

        const flattenedArray = promises.reduce((accumulator, currentArray) => accumulator.concat(currentArray), []);

        const liquidityD = await Promise.all(flattenedArray);

        liquidityD.reverse();

        await redis.set(cacheKey, JSON.stringify({ pair: `${token0Symbol}/${token1Symbol}`, priceData: liquidityD }));

        await redis.expire(cacheKey, 1000);

        return { pair: `${token0Symbol}/${token1Symbol}`, priceData: liquidityD };
    },
    getPoolHistroicalTransactions: async (web3, options) => {
        let eventHash = [];
        const promises = [];
        const { poolLiquidityContract, startBlock, endBlock, step, token0Symbol, token1Symbol } = options;
        const batchSize = Number(config.ellipticSteps.batchSize);
        const { publicRpc } = config.chains[config.dex[options.dexId].chainId];
        // eslint-disable-next-line no-promise-executor-return
        const timer = ms => new Promise(res => setTimeout(res, ms));
        const http = rateLimit(axios.create(), { maxRequests: 200, perMilliseconds: 1000, maxRPS: 200 });
        for (let startBlockNumber = Number(startBlock); startBlockNumber <= Number(endBlock); startBlockNumber += (batchSize * step)) {
            const batchPromises = [];
            for (let i = startBlockNumber; i <= Number(endBlock); i += step + 1) {
                await timer(20);
                batchPromises.push(
                    poolLiquidityContract.getPastEvents('Mint', {
                        fromBlock: i,
                        toBlock: Math.min((i + step ), Number(endBlock))
                    })
                );

            }

            const batchEvents = await Promise.all(batchPromises);

            for (const events of batchEvents) {
                for (const event of events) {
                    eventHash.push({
                        blockNumber: event.blockNumber,
                        transactionHash: event.transactionHash
                    });
                }
            }
        }

        const events = await Promise.all(eventHash);
        const eventHashUnique = Array.from(new Set(events.map(JSON.stringify)), JSON.parse);
        eventHash = eventHashUnique.reverse();

        if (eventHash.length === 0) return { pair: `${token0Symbol}/${token1Symbol}`, transactions: {} };

        const cacheKey = `getHistoricalTransactions${options.poolAddress}_${startBlock}_${endBlock}`;
        const keyExists = await redis.EXISTS(cacheKey);
        if (keyExists) {
            const cachedData = await redis.get(cacheKey);
            const parsedData = JSON.parse(cachedData);
            return parsedData;
        }

        const transactions = [];
        for (let i = 0; i <= eventHash.length - 1; i += 1000) {
            const chunk = eventHash.slice(i, i + 1000);
            let transactionReciept;
            // eslint-disable-next-line no-loop-func
            promises.push(chunk.map(async (event) => {
                await timer(50);

                try {
                    transactionReciept = await http(publicRpc, {
                        method: 'POST',
                        data: JSON.stringify({
                            method: 'eth_getTransactionByHash',
                            params: [event.transactionHash],
                            id: Math.random(),
                            jsonrpc: '2.0'
                        }),
                    }).then(res => res.data.result);
                }
                catch (err) {
                    await timer(100);
                    transactionReciept = await web3.eth.getTransaction(event.transactionHash);
                }

                transactions.push({
                    transactionHash: event.transactionHash,
                    transactionDetails: convertHexValuesToNumbers(transactionReciept),

                });

                return {
                    transactions
                };

            }));

        };

        const flattenedArray = promises.reduce((accumulator, currentArray) => accumulator.concat(currentArray), []);

        const liquidityD = await Promise.all(flattenedArray);

        liquidityD.reverse();

        const uniqueData = Array.from(new Set(liquidityD.map(JSON.stringify)), JSON.parse);


        await redis.set(cacheKey, JSON.stringify({ pair: `${token0Symbol}/${token1Symbol}`, transactions: uniqueData[0].transactions }));

        await redis.expire(cacheKey, 1000);

        return { pair: `${token0Symbol}/${token1Symbol}`, transactions: uniqueData[0].transactions };
    },
    getPoolChartData: async (web3, options) => {
        const blocksArray = [];
        const { poolLiquidityContract, routerContract, decimals, decimalsforToken1, token0Symbol, token1Symbol
            , interval, latestBlock, token0, token1 } = options;
        const chartData = {};
        const pricingData = [];

        // eslint-disable-next-line no-promise-executor-return
        const timer = ms => new Promise(res => setTimeout(res, ms));
        for (let i = 0; i <= 30; i += 1) {
            blocksArray.push(Math.round(latestBlock - (i * Number(interval) * (60 / 13))));
        }


        for (let j = 0; j < blocksArray.length - 1; j += 1) {
            const promises = [];
            const transaction = [];
            const eventData = await poolLiquidityContract.getPastEvents('Swap', {
                fromBlock: blocksArray[j + 1],
                toBlock: blocksArray[j]
            });

            for (const event of eventData) {
                pricingData.push((options.dexId !== '1300') ? ((event.returnValues.amount1In !== '0') ?
                    ((((event.returnValues.amount1In / 10 ** decimalsforToken1) / (event.returnValues.amount0Out / 10 ** decimals)).toString())
                        * (10 ** decimalsforToken1)).toFixed(0)
                    : ((((event.returnValues.amount1Out / 10 ** decimalsforToken1) / (event.returnValues.amount0In / 10 ** decimals)).toString()
                        * (10 ** decimalsforToken1))).toFixed(0)) :
                    (((Math.abs(event.returnValues.amount1) / 10 ** decimalsforToken1)
                        / (Math.abs(event.returnValues.amount0) / 10 ** decimals)) * (10 ** decimalsforToken1)).toFixed(0));
                transaction.push({
                    blockNumber: event.blockNumber.toString(),
                    price: (options.dexId !== '1300') ? ((event.returnValues.amount1In !== '0') ?
                        ((((event.returnValues.amount1In / 10 ** decimalsforToken1) / (event.returnValues.amount0Out / 10 ** decimals)).toString())
                            * (10 ** decimalsforToken1)).toFixed(0)
                        : (((event.returnValues.amount1Out / 10 ** decimalsforToken1) / (event.returnValues.amount0In / 10 ** decimals)).toString()
                            * (10 ** decimalsforToken1)).toFixed(0)) :
                        (((Math.abs(event.returnValues.amount1) / 10 ** decimalsforToken1)
                            / (Math.abs(event.returnValues.amount0) / 10 ** decimals)) * (10 ** decimalsforToken1)).toFixed(0),
                    amount: (options.dexId !== '1300') ? ((event.returnValues.amount0Out !== '0')
                        ? { token0: event.returnValues.amount0Out, token1: event.returnValues.amount1In }
                        : { token0: event.returnValues.amount0In, token1: event.returnValues.amount1Out }) :
                        { token0: Math.abs(event.returnValues.amount0), token1: Math.abs(event.returnValues.amount1) }

                });

            }

            if (options.dexId !== '1300') {
                for (let i = blocksArray[j + 1]; i <= blocksArray[j]; i += 1) {
                    promises.push(
                        routerContract.methods.getAmountsOut(
                            (10 ** (decimals)).toString(),
                            [token0, token1]
                        ).call(i).then(res => res[1]));
                    await timer(15);

                }
            }
            else {
                for (let i = blocksArray[j + 1]; i <= blocksArray[j]; i += 1) {
                    promises.push(
                        routerContract.methods.quoteExactInputSingle(
                            token0, token1, 3000, (10 ** (decimals)).toString(), 0
                        ).call(i));
                    await timer(15);

                }
            }

            const priceData = await Promise.all(promises);

            chartData[`${blocksArray[j + 1]} to ${blocksArray[j]}`] = [{
                open_price: priceData[0], close_price: priceData[priceData.length - 1]
                , low_price: (Math.min(...[...priceData, ...pricingData])).toString()
                , high_price: (Math.max(...[...priceData, ...pricingData])).toString(),
                transactions: transaction
            }];


        }

        return ({ pair: `${token0Symbol}/${token1Symbol}`, chartData });
    },
    getPoolTradeData: async (web3, options) => {
        let eventHash = [];
        const batchPromises = [];
        const { poolLiquidityContract, startBlock, endBlock, step, token0Symbol, token1Symbol } = options;
        const timer = ms => new Promise(res => setTimeout(res, ms));
        try{
            poolLiquidityContract.getPastEvents(options.eventType, {
                fromBlock: endBlock - 1000,
                toBlock: endBlock,
            });
        }
        catch(error){
            return throwErrorMessage("invalidEventType");
        }
        for (let i = Number(startBlock); i <= Number(endBlock); i += step + 1) {
            await timer(15);
            const promisess = [
                poolLiquidityContract.getPastEvents(options.eventType, {
                    fromBlock: i,
                    toBlock: Math.min(i + step , endBlock),
                })
            ];

            batchPromises.push(Promise.all(promisess));
        }

        const Events = await Promise.all(batchPromises);
        const batchEvents = Events.reduce((accumulator, currentArray) => accumulator.concat(currentArray), []);

        for (const events of batchEvents) {
            for (const event of events) {
                eventHash.push({
                    blockNumber: event.blockNumber.toString(),
                    transactionHash: event.transactionHash,
                    values: event.returnValues,
                    eventType: event.event,
                    data: event.raw
                });
            }
        }

        const events = await Promise.all(eventHash);
        const eventHashUnique = Array.from(new Set(events.map(JSON.stringify)), JSON.parse);
        eventHash = eventHashUnique.reverse();

        const cacheKey = `getPoolTradeData${options.poolAddress}_${startBlock}_${endBlock}_${options.eventType}`;
        const keyExists = await redis.EXISTS(cacheKey);
        if (keyExists) {
            const cachedData = await redis.get(cacheKey);
            const parsedData = JSON.parse(cachedData);
            return parsedData;
        }

        await redis.set(cacheKey, JSON.stringify({ pair: `${token0Symbol}/${token1Symbol}`, transactions: eventHash }));

        await redis.expire(cacheKey, 1000);

        return { pair: `${token0Symbol}/${token1Symbol}`, transactions: eventHash };
    },


};