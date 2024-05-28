const express = require("express");

const derivativeRouter = express.Router();
const { validateParams } = require("../middlewares/paramValidator");
const { validateRequest } = require('../middlewares/requestValidator');
const {
    getOrders,
    getOrder,
    getHistoricalPnL,
    getAssets,
    getFills,
    getPerpetualPositions,
    getSubAccounts,
    getTransfers
} = require("../controllers/derivativeQuery");

derivativeRouter.get("/derivative/getorders", validateParams, validateRequest, getOrders);
derivativeRouter.get("/derivative/getfills", validateParams, validateRequest, getFills);
derivativeRouter.get("/derivative/getassets", validateParams, validateRequest, getAssets);
derivativeRouter.get("/derivative/gethistoricalpnl", validateParams, validateRequest, getHistoricalPnL);
derivativeRouter.get("/derivative/getorder", validateParams, validateRequest, getOrder);
derivativeRouter.get("/derivative/getperpetualpositions", validateParams, validateRequest, getPerpetualPositions);
derivativeRouter.get("/derivative/getsubaccounts", validateParams, validateRequest, getSubAccounts);
derivativeRouter.get("/derivative/gettransfers", validateParams, validateRequest, getTransfers);

module.exports = derivativeRouter;
