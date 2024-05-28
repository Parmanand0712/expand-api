const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const heathRouter = require("../routers/heathCheck");
const keyGenerator = require("../routers/keyGenerator");
const chainQueryRouter = require("../routers/chainQuery");
const dexRouter = require("../routers/dexQuery");
const lendBorrowRouter = require("../routers/lendBorrowQuery");
const tokenRouter = require("../routers/fungibleToken");
const nonFungibleTokenRouter = require("../routers/nonFungibleToken");
const oracleRouter = require("../routers/oracleQuery");
const yieldRouter = require("../routers/yieldAggregator");
const stabelCoinRouter = require("../routers/stableCoin");
const lambdaRouter = require("../routers/lambda");
const syntheticRouter = require("../routers/synthetic");
const wethRouter = require('../routers/wethQuery');
const bridgeRouter = require('../routers/bridgeQuery');
const accountAbstractionRouter = require('../routers/accountAbstractionQuery');
const derivativeRouter = require("../routers/derivativeQuery");
const liquidStakingRouter = require("../routers/liquidStakingQuery");
const rwaRouter = require("../routers/rwaQuery");

const app = express();

// CORS-Cross Origin Resource Sharing
app.use(cors({ origin: "*" }));
app.options("*", cors());

// body parser
app.use(express.json());

// dev logs
app.use(morgan("dev"));

// key generator Router
app.use(keyGenerator);

// health check Router
app.use(heathRouter);

// Chain Query Router
app.use(chainQueryRouter);

// Dex Query Router
app.use(dexRouter);

// Lend Borrow Router
app.use(lendBorrowRouter);

// ERC20 Router
app.use(tokenRouter);

// Non Fungible Token Router
app.use(nonFungibleTokenRouter);

// Oracle Router
app.use(oracleRouter);

// yieldAggregator Router
app.use(yieldRouter);

// Stable Coin Router
app.use(stabelCoinRouter);

// Lambda Function
app.use(lambdaRouter);

// Synthetic Router
app.use(syntheticRouter);

// Weth Router
app.use(wethRouter);

// Bridge Router
app.use(bridgeRouter);

// Account Abstraction Router
app.use(accountAbstractionRouter);

// Derivative Router
app.use(derivativeRouter);

// Liquid Staking ROuter
app.use(liquidStakingRouter);
// RWA Router
app.use(rwaRouter);

module.exports = app;
