const express = require("express");

const lendBorrowRouter = express.Router();
const {validateParams} = require("../middlewares/paramValidator");

const {
  getLendBorrowPool,
  postBorrow,
  postDeposit,
  postLiquidate,
  postRepay,
  postWithdraw,
  postEnterMarket,
  postExitMarket,
  getRepayAmount,
  getLendBorrowEnterMarketStatus,
  getBorrowAmount,
  getLendBorrowPools,
  getUserAccountData,
  exitIsolationMode,
  setUserEMode,
  postMigrate,
  getAssetInfo,
  postBundleActions,
  getGovernerData,
  getMaxAmounts,
  getClaimedRewards,
  claimRewards,
  transfer,
  allow,
  getUserPositions
  
} = require("../controllers/lendBorrowQuery");

// LENDBORROW QUERY
lendBorrowRouter.get("/lendborrow/getpool", validateParams, getLendBorrowPool);
lendBorrowRouter.get("/lendborrow/getpools", validateParams, getLendBorrowPools);
lendBorrowRouter.get('/lendborrow/entermarketstatus', validateParams, getLendBorrowEnterMarketStatus);
lendBorrowRouter.get("/lendborrow/getrepayamount", validateParams, getRepayAmount);
lendBorrowRouter.get("/lendborrow/getborrowamount", validateParams, getBorrowAmount);
lendBorrowRouter.get("/lendborrow/getuseraccountdata", validateParams, getUserAccountData);
lendBorrowRouter.get("/lendborrow/getassetinfo", validateParams, getAssetInfo);
lendBorrowRouter.get("/lendborrow/getgovernordata", validateParams, getGovernerData);
lendBorrowRouter.get("/lendborrow/getmaxamounts", validateParams, getMaxAmounts);
lendBorrowRouter.get("/lendborrow/getclaimedrewards", validateParams, getClaimedRewards);
lendBorrowRouter.get("/lendborrow/getuserpositions", validateParams, getUserPositions);

// LENDBORROW TRANSACTION
lendBorrowRouter.post("/lendborrow/borrow",  validateParams,postBorrow);
lendBorrowRouter.post("/lendborrow/allow",  validateParams,allow);
lendBorrowRouter.post("/lendborrow/deposit",  validateParams,postDeposit);
lendBorrowRouter.post("/lendborrow/liquidate", validateParams, postLiquidate);
lendBorrowRouter.post("/lendborrow/repay",  validateParams,postRepay);
lendBorrowRouter.post("/lendborrow/withdraw", validateParams, postWithdraw);
lendBorrowRouter.post("/lendborrow/entermarket",  validateParams,postEnterMarket);
lendBorrowRouter.post("/lendborrow/exitmarket",  validateParams,postExitMarket);
lendBorrowRouter.post("/lendborrow/exitisolationmode", validateParams,exitIsolationMode);
lendBorrowRouter.post("/lendborrow/setuseremode", validateParams,setUserEMode);
lendBorrowRouter.post("/lendborrow/migrate", validateParams,postMigrate);
lendBorrowRouter.post("/lendborrow/bundleactions", validateParams,postBundleActions);
lendBorrowRouter.post("/lendborrow/claimrewards", validateParams,claimRewards);
lendBorrowRouter.post("/lendborrow/transfer", validateParams,transfer);

module.exports = lendBorrowRouter;
