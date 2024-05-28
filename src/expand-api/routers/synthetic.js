const express = require("express");

const syntheticRouter = express.Router();
const {validateParams} = require("../middlewares/paramValidator");


const {
  getPrice,
  // postConvertBaseToPeggedToken,
  // postConvertBaseToProtocolToken,
  // postConvertPeggedToProtocolToken,
  // postConvertProtocolToBaseToken,
  // postConvertProtocolToPeggedToken,
  // postLiquidate,
  postWithdrawPeggedToken,
  postDepositPeggedToken
} = require("../controllers/synthetic");


syntheticRouter.get('/synthetic/getprice',validateParams,getPrice);
syntheticRouter.post('/synthetic/withdrawpeggedtoken',validateParams,postWithdrawPeggedToken);
syntheticRouter.post('/synthetic/depositpeggedtoken',validateParams,postDepositPeggedToken);





module.exports = syntheticRouter;





