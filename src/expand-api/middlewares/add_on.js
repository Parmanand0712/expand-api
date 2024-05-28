const { getAddonPlan, getbdnTransactionCount } = require("../../../common/dynamo");
const erroMessage = require("../../../common/configuration/errorMessage.json");

exports.checkAddons = async (req, res, next) => {
    try {

        const apiKey = req.get("x-api-key");
        const plan = await getAddonPlan(apiKey);

        if(req.body.bdnTransaction === true && plan.planName.includes("bloxRoute")){
            const timestamp = new Date();
            const count = await getbdnTransactionCount(apiKey, timestamp.setDate(timestamp.getDate()-1));
            if(count>=100)
                return res.json({
                    status: 601,
                    msg: erroMessage.api.queryErrorMessage,
                    error: erroMessage.error.message.addTopup
                });
            return next();
        }
        else if(req.body.bdnTransaction === true && !plan.planName.includes("bloxRoute")){
            return res.json({
                status: 600,
                msg: erroMessage.api.queryErrorMessage,
                error: erroMessage.error.message.subscribebloxRoute
            });
        }

    } catch (error) {
        console.log("got error", error);
        return res
          .status(400)
          .json({ status: 400, msg: "invalid request" });
    }
    return next();
};
