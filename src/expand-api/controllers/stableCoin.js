const helper = require("../middlewares/helper");
const errorMessages = require("../../../common/configuration/errorMessage.json");
const { getApiParams} = require("../../../common/dynamo");

exports.getStableCoinPrice = async (req, res) => {
  const time = new Date().getTime();
  try {
    const price = await helper.stableCoinCommon("getPrice", req.query);
    if (
      price.valid !== undefined ||
      price.error !== undefined ||
      price.message !== undefined ||
      price.code !== undefined
    ) {

      try{
        await getApiParams(req , time , price , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error : price
      });
    } else {

      try{
        await getApiParams(req , time , price , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: price,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};
