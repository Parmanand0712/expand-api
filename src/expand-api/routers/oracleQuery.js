const express = require("express");

const oracleRouter = express.Router();
const {validateParams} = require("../middlewares/paramValidator");
const { getOraclePrice , getOracleSupportedTokens } = require("../controllers/oracleQuery");

oracleRouter.get("/oracle/getprice", validateParams, getOraclePrice);
oracleRouter.get("/oracle/getsupportedtokens", validateParams, getOracleSupportedTokens);

module.exports = oracleRouter;
