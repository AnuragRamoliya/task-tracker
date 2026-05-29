const Redis = require("ioredis");
const env = require("./env");

const redis = new Redis(env.redisUrl, {
  lazyConnect: true,
  maxRetriesPerRequest: 2,
  enableOfflineQueue: false
});

redis.on("error", (error) => {
  if (env.nodeEnv !== "test") {
    console.error("Redis error:", error.message);
  }
});

module.exports = redis;
