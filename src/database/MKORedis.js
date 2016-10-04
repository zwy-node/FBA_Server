/**
 * Created by Fizz on 16/9/13.
 */

const redis = require('redis');
const config = require(BASEDIR + '/config/development');

//let redisConfig = CONFIG.redis;
let redisConfig = config.redis;
let redisClient = redis.createClient(redisConfig.RDS_PORT, redisConfig.RDS_HOST, {auth_pass: redisConfig.RDS_PWD});

module.exports = redisClient;
