const express = require("express");

const stableCoinRouter = express.Router();
const {validateParams} = require("../middlewares/paramValidator");

const { getStableCoinPrice } = require("../controllers/stableCoin");

stableCoinRouter.get("/stablecoin/getprice", validateParams,getStableCoinPrice);

module.exports = stableCoinRouter;
