const express = require("express");

const dexRouter = express.Router();
const {validateParams} = require("../middlewares/paramValidator");
const {validateRequest} = require('../middlewares/requestValidator');
const {
  getDexPrice,
  getDexLiquidity,
  getDexPool,
  postDexSwap,
  postDexAddLiquidity,
  postDexRemoveLiquidity,
  getDexPoolLiquidity,
  getDexPosition,
  getDexTokenHolders,
  getDexTokenLiquidity,
  postDexSwapAggregator,
  getDexQuoteAggregator,
  getPoolIndividualLiquidity,
  getDexLiquiditySources,
  getPoolChartData,
  getHistoricalTransactions,
  getHistoricalTimeSeries,
  getPoolTradeData,
  getDexOrders,
  createDexOrder,
  getDexWalletPosition,
  postDexRefundLiquidity,
  getRoute
} = require("../controllers/dexQuery");

dexRouter.get("/dex/getprice",validateParams, validateRequest, getDexPrice);
dexRouter.get("/dex/getpools",validateParams, getDexPool);
dexRouter.get("/dex/getuserliquidity",validateParams, validateRequest, getDexLiquidity);
dexRouter.get("/dex/getpoolliquidity",validateParams, validateRequest, getDexPoolLiquidity);
dexRouter.get("/dex/getindividualposition",validateParams, validateRequest, getDexPosition);
dexRouter.get("/dex/getwalletposition",validateParams, validateRequest, getDexWalletPosition);
dexRouter.get("/dex/getliquidityholders",validateParams, validateRequest, getDexTokenHolders);
dexRouter.get("/dex/gettokenliquidity",validateParams, validateRequest, getDexTokenLiquidity);
dexRouter.get("/dex/quoteaggregator",validateParams, validateRequest, getDexQuoteAggregator);
dexRouter.get("/dex/getpoolindividualliquidity",validateParams, validateRequest, getPoolIndividualLiquidity);
dexRouter.get("/dex/getliquiditysources",validateParams, validateRequest, getDexLiquiditySources);
dexRouter.get("/dex/getorders",validateParams, validateRequest, getDexOrders);
dexRouter.get("/dex/getroute",validateParams, validateRequest, getRoute);


dexRouter.get("/dex/getpoolchartdata",validateParams, validateRequest, getPoolChartData);
dexRouter.get("/dex/gethistoricaltransactions",validateParams, validateRequest, getHistoricalTransactions);
dexRouter.get("/dex/gethistoricaltimeseries",validateParams, validateRequest, getHistoricalTimeSeries);
dexRouter.get("/dex/getpooltradedata",validateParams, validateRequest, getPoolTradeData);
dexRouter.post("/dex/swap",validateParams, validateRequest, postDexSwap);
dexRouter.post("/dex/addliquidity",validateParams, validateRequest, postDexAddLiquidity);
dexRouter.post("/dex/removeliquidity",validateParams, validateRequest, postDexRemoveLiquidity);
dexRouter.post("/dex/refundliquidity",validateParams, validateRequest, postDexRefundLiquidity);
dexRouter.post("/dex/swapaggregator",validateParams, validateRequest, postDexSwapAggregator);
dexRouter.post("/dex/createOrder",validateParams, validateRequest, createDexOrder);

module.exports = dexRouter;
