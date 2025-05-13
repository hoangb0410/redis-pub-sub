const { createClient } = require("redis");

async function initSubscriber() {
  const subClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:6379`,
  });
  await subClient.connect();

  await subClient.subscribe("user_events", (message) => {
    const { action, data } = JSON.parse(message);
    console.log(`[SUBSCRIBER] Action: ${action}`, data);
  });
}

module.exports = initSubscriber;
