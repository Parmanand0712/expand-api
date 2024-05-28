/*
 *
 * This is a patch file for chainId where user can not pass constructor as chainId
 *
 */

const erroMessage = require("../../../common/configuration/errorMessage.json");
const config = require("../../../common/configuration/config.json");

exports.validateParams = (req, res, next) => {
  if (config.paramValidation.enabled) {
    try {
      const payload = req.query ? req.query : req.body;
      if (payload.chainId && payload.chainId.toLowerCase() === "constructor") {
        return res.json({
          status: 400,
          msg: erroMessage.api.failuerMessage,
          error: erroMessage.error.message.invalidChainId,
        });
      } else {
        return next();
      }
    } catch (error) {
      console.log("error ===>", error);
      return res
        .status(400)
        .json({ status: 400, msg: "invalid request" });
    }
  } else {
    return next();
  }
};