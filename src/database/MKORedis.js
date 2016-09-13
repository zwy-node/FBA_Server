/**
 * Created by Fizz on 16/9/13.
 */

const redis = require('redis');

let redisConfig = CONFIG.redis;
let redisClient = redis.createClient(redisConfig.RDS_PORT, redisConfig.RDS_HOST, {});

module.exports = redisClient;
