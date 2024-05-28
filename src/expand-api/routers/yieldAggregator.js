const express = require("express");

const yeildRouter = express.Router();
const {validateParams} = require("../middlewares/paramValidator");

const {
  getYieldBalance,
  getYieldVault,
  postYieldDepositPool,
  postYieldDepositVault,
  postYieldWithdrawPool,
  postYieldWithdrawVault,
} = require("../controllers/yieldAggregator");

yeildRouter.get("/yieldaggregator/getbalance",validateParams, getYieldBalance);
yeildRouter.get("/yieldaggregator/getvaults",validateParams, getYieldVault);
yeildRouter.post("/yieldaggregator/depositvault",validateParams, postYieldDepositVault);
yeildRouter.post("/yieldaggregator/depositpool",validateParams, postYieldDepositPool);
yeildRouter.post("/yieldaggregator/withdrawpool",validateParams, postYieldWithdrawPool);
yeildRouter.post("/yieldaggregator/withdrawvault",validateParams, postYieldWithdrawVault);

module.exports = yeildRouter;
