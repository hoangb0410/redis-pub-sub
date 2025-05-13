const { createClient } = require("redis");
require("dotenv").config();

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:6379`,
});
redisClient.connect();

module.exports = redisClient;
