const express = require('express');

const bridgeRouter = express.Router();
const { validateParams } = require('../middlewares/paramValidator');
const {
    getBridgeLiquidity,
    bridgeSwap,
    addBridgeLiquidity,
    removeBridgeLiquidity,
    getBridgeTransaction,
    getBridgePrice,
    getBridgeRoute,
    getBridgeChainsSupported,
    getBridgeTokensSupported
} = require('../controllers/bridgeQuery');

bridgeRouter.get("/bridge/getliquidity",  validateParams, getBridgeLiquidity);
bridgeRouter.get("/bridge/gettransaction",  validateParams, getBridgeTransaction);
bridgeRouter.get("/bridge/getprice",  validateParams, getBridgePrice);
bridgeRouter.get("/bridge/getroute",  validateParams, getBridgeRoute);
bridgeRouter.get("/bridge/getsupportedchains",  validateParams, getBridgeChainsSupported);
bridgeRouter.get("/bridge/getsupportedtokens",  validateParams, getBridgeTokensSupported);

bridgeRouter.post("/bridge/addliquidity",  validateParams, addBridgeLiquidity);
bridgeRouter.post("/bridge/removeliquidity",  validateParams, removeBridgeLiquidity);
bridgeRouter.post("/bridge/swap",  validateParams, bridgeSwap);


module.exports = bridgeRouter;
