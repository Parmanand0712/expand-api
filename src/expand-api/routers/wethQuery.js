const express = require("express");

const wethRouter = express.Router();
const { getWethBalance, getHistoricalLogsWeth, getWethHistoricalTransactions } = require("../controllers/wethQuery");
const {validateParams} = require("../middlewares/paramValidator");

wethRouter.get("/weth/getbalance", validateParams,getWethBalance);
wethRouter.get("/weth/historical/logs", validateParams, getHistoricalLogsWeth);
wethRouter.get('/fungibletoken/historical/weth',validateParams, getWethHistoricalTransactions);

module.exports = wethRouter;
