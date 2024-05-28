const express = require("express");

const chainQueryRouter = express.Router();
const {validateParams } = require("../middlewares/paramValidator");
const {
  rwaQueryController,
  getDataByAction
} = require("../controllers/rwaQuery");

chainQueryRouter.post("/rwa/settrustline", validateParams, rwaQueryController, getDataByAction);
chainQueryRouter.post("/rwa/issue", validateParams, rwaQueryController, getDataByAction);
chainQueryRouter.post("/rwa/burn", validateParams, rwaQueryController, getDataByAction);
chainQueryRouter.post("/rwa/transfer", validateParams, rwaQueryController, getDataByAction);
chainQueryRouter.post("/rwa/freeze", validateParams, rwaQueryController, getDataByAction);

module.exports = chainQueryRouter;
