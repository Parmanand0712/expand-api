const redis = require('../../../common/redis/index');
const dynamo = require('../../../common/dynamo');
const erroMessage = require("../../../common/configuration/errorMessage.json");

exports.getCached = async(req, res, next) => {
    try{
        const time = new Date().getTime();
        const cacheKey = `${req.path}_${JSON.stringify(req.query)}`;
        req.cacheKey = cacheKey;
        const cachedResponse = await redis.get(cacheKey);
        if(cachedResponse){
            dynamo.getApiParams(req , time , cachedResponse , erroMessage , 'success');
            return res.json({
                status: 200,
                msg: erroMessage.api.successMessage,
                data: JSON.parse(cachedResponse)
            });
        }
    } catch (error) {
        console.log("got error", error);
        return next();
    }
    return next();
};
