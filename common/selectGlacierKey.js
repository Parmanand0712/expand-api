const redis = require('./redis/index');
require("dotenv").config({ path: '../../../.env' });


const cacheKey = `glacierKey`;

// Schema of redis object
// {
//     "expand_glacier1": hits,
//     "expand_glacier2": hits
// }

exports.selectGlacierKey = async () => {
    let glacierkey = {};
    let data = {};
    try {
        const prevState = await redis.get(cacheKey);
        console.log(prevState);
        if (prevState) {
            data = JSON.parse(prevState);
            if (data.expand_glacier1 < data.expand_glacier2) {
                data.expand_glacier1 = parseInt(data.expand_glacier1) + 1;
                glacierkey.data = process.env.GLACIER;
            }
              else {
                data.expand_glacier2 = parseInt(data.expand_glacier2) + 1;
                glacierkey.data = process.env.GLACIER_backup;
            }
            redis.set(cacheKey, JSON.stringify(data));
        } else {
            data = {
                "expand_glacier1": 1,
                "expand_glacier2": 0
            };
            glacierkey = { data: process.env.GLACIER };
            redis.set(cacheKey, JSON.stringify(data));
            redis.expire(cacheKey, 60);
        }
        
        return glacierkey;
    } catch (error) {
        console.log("Error in selecting glacier apikey: ",error);
        glacierkey.data = process.env.GLACIER;
        return glacierkey;
    }
};
