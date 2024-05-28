const env = process.env.ENVIRONMENT || 'development';
const config =
  env === 'production' || env === 'test'
    ? require('./production')
    : require('./development');

config.environment = env;
module.exports = config;
