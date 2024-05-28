const helper = require("../middlewares/helper");
const errorMessages = require("../../../common/configuration/errorMessage.json");
const { getApiParams} = require("../../../common/dynamo");

exports.getEncodeFunctionData = async (req, res) => {
  const time = new Date().getTime();
  try {
    const encode = await helper.lambdaCommon("encodeFunctionData", req.query);
    if (
      encode.valid !== undefined ||
      encode.error !== undefined ||
      encode.message !== undefined ||
      encode.code !== undefined
    ) {

      try{
        await getApiParams(req , time , encode , errorMessages , 'failed');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.failed).json({
        status: errorMessages.statusCodes.failed,
        msg: errorMessages.api.queryErrorMessage,
        error: encode,
      });
    } else {

      try{
        await getApiParams(req , time , encode , errorMessages , 'success');
        
      }
      catch(err){
        console.log(err);
      }

      return res.status(errorMessages.statusCodes.success).json({
        status: errorMessages.statusCodes.success,
        msg: errorMessages.api.successMessage,
        data: encode,
      });
    }
  } catch (error) {
    return res.status(errorMessages.statusCodes.serverError).json({
      status: errorMessages.statusCodes.serverError,
      msg: errorMessages.api.serverErrorMesssage,
    });
  }
};
