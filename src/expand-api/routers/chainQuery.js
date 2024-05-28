const express = require("express");

const chainQueryRouter = express.Router();
const {validateParams } = require("../middlewares/paramValidator");
const { getCached } = require("../middlewares/cached");
const {

  chainQueryController,
  getDataByAction
} = require("../controllers/chainQuery");
const { checkAddons } = require("../middlewares/add_on");

chainQueryRouter.get("/chain/getbalance", validateParams, chainQueryController, getDataByAction);
chainQueryRouter.get("/chain/getblock", validateParams, chainQueryController, getDataByAction);
chainQueryRouter.get("/chain/getflashbotblocks", validateParams, chainQueryController, getDataByAction);
chainQueryRouter.get("/chain/getflashbottransactions", validateParams, chainQueryController, getDataByAction);
chainQueryRouter.get("/chain/getflashbotbundle", validateParams, chainQueryController, getDataByAction);

chainQueryRouter.get("/chain/getstorage", validateParams, chainQueryController, getDataByAction);
chainQueryRouter.get("/chain/gettransaction", validateParams, chainQueryController, getDataByAction);
chainQueryRouter.get("/chain/getpublicrpc", validateParams, chainQueryController, getDataByAction);
chainQueryRouter.get("/chain/getgasprice" , validateParams, chainQueryController, getDataByAction);
chainQueryRouter.get("/chain/getgasfees" , validateParams, chainQueryController, getDataByAction);
chainQueryRouter.get("/chain/gettokenaddress" , validateParams, chainQueryController, getDataByAction);
chainQueryRouter.get("/chain/gethistoricalrewards", validateParams, getCached, chainQueryController, getDataByAction);
chainQueryRouter.get("/chain/portfolio", validateParams, getCached, chainQueryController, getDataByAction);
chainQueryRouter.get("/chain/getusertransactions", validateParams, getCached, chainQueryController, getDataByAction);
chainQueryRouter.get("/chain/getevents", validateParams, getCached, chainQueryController, getDataByAction);
chainQueryRouter.get("/chain/getlatestledger", validateParams, getCached, chainQueryController, getDataByAction);
chainQueryRouter.get("/chain/gettokenmarketdata", validateParams, getCached, chainQueryController, getDataByAction);

chainQueryRouter.post("/chain/estimategas", validateParams, chainQueryController, getDataByAction );
chainQueryRouter.post("/chain/generic", validateParams, chainQueryController, getDataByAction);
chainQueryRouter.post("/chain/genericsmartcontractmethod", validateParams, chainQueryController, getDataByAction);
chainQueryRouter.post("/chain/sendtransaction", validateParams, checkAddons, chainQueryController, getDataByAction);
chainQueryRouter.post("/chain/decodetransaction", validateParams, chainQueryController, getDataByAction);
chainQueryRouter.post("/chain/simulatetransaction", validateParams, chainQueryController, getDataByAction);

module.exports = chainQueryRouter;
