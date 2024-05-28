const express = require("express");

const tokenRouter = express.Router();
const {validateParams} = require("../middlewares/paramValidator");

const { getName,
    getDecimal,
    getSymbol,
    getTokenDetails,
    postApprove,
    postBaseTokenToWrapToken,
    postConvertWrapTokenToBaseToken,
    postTransfer, postTransferForm,
    getUserAllowance,
    getUserBalance,
    getHistoricalTransactions,
    getHistoricalLogs
} = require("../controllers/fungibleToken");


tokenRouter.get('/fungibletoken/getname',validateParams, getName);
tokenRouter.get('/fungibletoken/getdecimals', validateParams,getDecimal);
tokenRouter.get('/fungibletoken/getsymbol', validateParams,getSymbol);
tokenRouter.get('/fungibletoken/gettokendetails', validateParams, getTokenDetails);
tokenRouter.get('/fungibletoken/getuserallowance', validateParams,getUserAllowance);
tokenRouter.get('/fungibletoken/getuserbalance', validateParams,getUserBalance);
tokenRouter.get('/fungibletoken/historical/transactions', validateParams, getHistoricalTransactions);
tokenRouter.get('/fungibletoken/historical/logs', validateParams, getHistoricalLogs);



tokenRouter.post('/fungibletoken/approve',validateParams, postApprove);
tokenRouter.post('/fungibletoken/convertbasetokentowraptoken',validateParams, postBaseTokenToWrapToken);
tokenRouter.post('/fungibletoken/convertwraptokentobasetoken',validateParams, postConvertWrapTokenToBaseToken);
tokenRouter.post('/fungibletoken/transfer',validateParams, postTransfer);
tokenRouter.post('/fungibletoken/transferfrom',validateParams, postTransferForm);


module.exports = tokenRouter;
