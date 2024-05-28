const helper = require("../middlewares/helper");
const errorMessages = require("../../../common/configuration/errorMessage.json");
const { getApiParams } = require("../../../common/dynamo"); 

exports.getWethBalance = async (req, res) => {
  const time = new Date().getTime();
    try {
      const balance = await helper.fungibleTokenCommon("getWethBalance", req.query);
      if (balance.valid !== undefined || balance.error !== undefined || balance.message !== undefined || balance.code !== undefined) {

        try{
          await getApiParams(req , time , balance , errorMessages , 'failed');
          
        }
        catch(err){
          console.log(err);
        }

        
        return res.status(errorMessages.statusCodes.failed).json({
          status: errorMessages.statusCodes.failed,
          msg: errorMessages.api.queryErrorMessage,
          error: balance,
        });
      } else {

        try{
          await getApiParams(req , time , balance , errorMessages , 'success');
          
        }
        catch(err){
          console.log(err);
        }
  
        return res.status(errorMessages.statusCodes.success).json({
          status: errorMessages.statusCodes.success,
          msg: errorMessages.api.successMessage,
          data: balance,
        });
      }
    } catch (error) {
      return res.status(errorMessages.statusCodes.serverError).json({
        status: errorMessages.statusCodes.serverError,
        msg: errorMessages.api.serverErrorMesssage,
      });
    }
  };

  exports.getHistoricalLogsWeth = async (req, res) => {
    const time = new Date().getTime();
    try {
      const historicalLogsWeth = await helper.fungibleTokenCommon("getHistoricalLogsWeth", req.query);
      if (historicalLogsWeth.valid !== undefined || historicalLogsWeth.error !== undefined 
        || historicalLogsWeth.message !== undefined || historicalLogsWeth.code !== undefined) {

          try{
            await getApiParams(req , time , historicalLogsWeth , errorMessages , 'failed');
            
          }
          catch(err){
            console.log(err);
          }
    
        return res.status(errorMessages.statusCodes.failed).json({
          status: errorMessages.statusCodes.failed,
          msg: errorMessages.api.queryErrorMessage,
          error: historicalLogsWeth,
        });
      } else {

        try{
          await getApiParams(req , time , historicalLogsWeth , errorMessages , 'success');
          
        }
        catch(err){
          console.log(err);
        }
  
        return res.status(errorMessages.statusCodes.success).json({
          status: errorMessages.statusCodes.success,
          msg: errorMessages.api.successMessage,
          data: historicalLogsWeth,
        });
      }
    } catch (error) {
      return res.status(errorMessages.statusCodes.serverError).json({
        status: errorMessages.statusCodes.serverError,
        msg: errorMessages.api.serverErrorMesssage,
      });
    }
  };

  exports.getWethHistoricalTransactions = async (req, res) => {
    const time = new Date().getTime();
    try {
      const historicalTransactionsWeth = await helper.fungibleTokenCommon("getWethHistoricalTransactions", req.query);
      if (historicalTransactionsWeth.valid !== undefined || historicalTransactionsWeth.error !== undefined 
        || historicalTransactionsWeth.message !== undefined || historicalTransactionsWeth.code !== undefined) {

          try{
            await getApiParams(req , time , historicalTransactionsWeth , errorMessages , 'failed');
            
          }
          catch(err){
            console.log(err);
          }
    
        return res.status(errorMessages.statusCodes.failed).json({
          status: errorMessages.statusCodes.failed,
          msg: errorMessages.api.queryErrorMessage,
          error: historicalTransactionsWeth,
        });
      } else {

        try{
          await getApiParams(req , time , historicalTransactionsWeth , errorMessages , 'success');
          
        }
        catch(err){
          console.log(err);
        }
  
        return res.status(errorMessages.statusCodes.success).json({
          status: errorMessages.statusCodes.success,
          msg: errorMessages.api.successMessage,
          data: historicalTransactionsWeth,
        });
      }
    } catch (error) {
      return res.status(errorMessages.statusCodes.serverError).json({
        status: errorMessages.statusCodes.serverError,
        msg: errorMessages.api.serverErrorMesssage,
      });
    }
  };
