const express = require("express");

const accountAbstractionQueryRouter = express.Router();
const {validateParams} = require("../middlewares/paramValidator");
const {
  getUsersOps,
  sendUsersOps,
  getSignatureMessage,
  getPaymasterData
} = require("../controllers/accountAbstractionQuery");

accountAbstractionQueryRouter.get("/aa/getuserops", validateParams, getUsersOps);
accountAbstractionQueryRouter.post("/aa/senduserops", validateParams, sendUsersOps);
accountAbstractionQueryRouter.get("/aa/getsignaturemessage", validateParams, getSignatureMessage);
accountAbstractionQueryRouter.get("/aa/getpaymasterdata", validateParams, getPaymasterData);


module.exports = accountAbstractionQueryRouter;
