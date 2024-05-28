module.exports = {
    webConfig: {
      port: process.env.NODE_PORT,
    },
    redisConfig: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  };
  