const redisClient = require("../redis");

async function publishUserEvent(action, data) {
  await redisClient.publish("user_events", JSON.stringify({ action, data }));
}

module.exports = { publishUserEvent };
