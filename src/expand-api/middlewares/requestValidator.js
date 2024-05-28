/*
 *
 * This is a file to validate the request is valid or not for the given protocol ID request
 *
 */

const erroMessage = require("../../../common/configuration/errorMessage.json");
const config = require("../../../common/configuration/config.json");
const common = require("../../../common/common");

exports.validateRequest = async (req, res, next) => {
  if (config.requestValidation.enabled) {
    try {
      const payload = req.query ? req.query : req.body;

      // Currently this is only for the dexId, we can enhance this middleware as required in future!!
      const dexId = payload.dexId
        ? payload.dexId
        : await common.getDexIdFromDexName(config.default.dex);
      const invalidRequests = config.dex[dexId] ? config.dex[dexId].invalidRequest : undefined;
      const route = req._parsedUrl.pathname;

      if (
        invalidRequests !== undefined &&
        invalidRequests.includes(route.substring(route.lastIndexOf("/") + 1))
      ) {
        return res.status(400).json({
          status: 400,
          msg: erroMessage.api.failuerMessage,
          error: erroMessage.error.message.notApplicable,
        });
      } else {
        return next();
      }
    } catch (error) {
      return res.status(400).json({ status: 400, msg: "invalid request" });
    }
  } else {
    return next();
  }
};
