const express = require("express");

const lambdaRouter = express.Router();
const {validateParams} = require("../middlewares/paramValidator");

const { getEncodeFunctionData } = require("../controllers/lambda");

lambdaRouter.get("/encodefunctiondata",  validateParams,getEncodeFunctionData);

module.exports = lambdaRouter;
