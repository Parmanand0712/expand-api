const redis = require('redis');
const { redisConfig } = require('./redisConfig');

const client = redis.createClient(redisConfig);
client.connect();
client.on('connect', () => {
  console.info('Connected to Redis.');
});
client.on('error', (error) => {
  console.error(`Redis Error: ${error}`);
});
module.exports = client;
