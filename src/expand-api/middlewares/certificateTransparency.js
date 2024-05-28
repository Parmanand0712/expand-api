const axios = require("axios");
const config = require("../../../common/configuration/config.json");
const errorMessage = require("../../../common/configuration/errorMessage.json");

exports.getCertficateTansparency = (req, res, next) => {
  const chainId = req.query.chainId ? req.query.chainId : "1";
  const data = config.chains[chainId] ? config.chains[chainId] : undefined;
  if (data === undefined ) {
    return res.status(400).json({status:errorMessage.statusCodes.failed,msg:errorMessage.error.message.invalidChainId});
  } else {
    return new Promise((resolve, reject) => {
      try {
        const { domain, sslMateId } = data;

        if (config.ctLogs.enabled && domain) {
          try {
            const options = {
              method: "get",
              maxBodyLength: Infinity,
              url: `https://api.certspotter.com/v1/issuances?domain=${domain}`,
              headers: {
                Authorization: `Bearer ${config.ctLogs.sslmateKey}`,
              },
            };

            axios.request(options).then((response) => {
              if (response.data.code === "rate_limited") {
                next();
              } else if (response.data[0].id === sslMateId) {
                next();
              } else {
                reject(response.data);
              }
            });
          } catch (error) {
            reject(error);
          }
        } else {
          next();
        }
      } catch (error) {
        res
          .status(400)
          .json({
            status: 400,
            msg: errorMessage.error.message.invalidChainId,
          });
      }
    });
  }
};
