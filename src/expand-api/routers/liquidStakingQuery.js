const express = require('express');

const liquidStakingRouter = express.Router();
const { validateParams } = require('../middlewares/paramValidator');
const {
    liquidStakingController,
    getDataByAction
  } = require("../controllers/liquidStakingQuery");

liquidStakingRouter.get("/liquidstaking/getstake",  validateParams, liquidStakingController, getDataByAction);
liquidStakingRouter.get("/liquidstaking/getapr",  validateParams, liquidStakingController, getDataByAction);
liquidStakingRouter.get("/liquidstaking/getrewards",  validateParams, liquidStakingController, getDataByAction);
liquidStakingRouter.get("/liquidstaking/getprotocolapr",  validateParams, liquidStakingController, getDataByAction);
liquidStakingRouter.get("/liquidstaking/getwithdrawalrequests",  validateParams, liquidStakingController, getDataByAction);
liquidStakingRouter.get("/liquidstaking/getwithdrawalstatus",  validateParams, liquidStakingController, getDataByAction);
liquidStakingRouter.get("/liquidstaking/getallowance",  validateParams, liquidStakingController, getDataByAction);


liquidStakingRouter.post("/liquidstaking/stake",  validateParams, liquidStakingController, getDataByAction);
liquidStakingRouter.post("/liquidstaking/claim",  validateParams, liquidStakingController, getDataByAction);
liquidStakingRouter.post("/liquidstaking/requestwithdrawal",  validateParams, liquidStakingController, getDataByAction);
liquidStakingRouter.post("/liquidstaking/approvewithdrawal",  validateParams, liquidStakingController, getDataByAction);
liquidStakingRouter.post("/liquidstaking/increaseallowance",  validateParams, liquidStakingController, getDataByAction);
liquidStakingRouter.post("/liquidstaking/decreaseallowance",  validateParams, liquidStakingController, getDataByAction);
liquidStakingRouter.post("/liquidstaking/wrap",  validateParams, liquidStakingController, getDataByAction);
liquidStakingRouter.post("/liquidstaking/unwrap",  validateParams, liquidStakingController, getDataByAction);
liquidStakingRouter.post("/liquidstaking/restake",  validateParams, liquidStakingController, getDataByAction);
liquidStakingRouter.post("/liquidstaking/mint",  validateParams, liquidStakingController, getDataByAction);
liquidStakingRouter.post("/liquidstaking/burn",  validateParams, liquidStakingController, getDataByAction);


module.exports = liquidStakingRouter;
