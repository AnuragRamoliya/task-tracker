const redis = require("../config/redis");

const safe = async (operation, fallback = null) => {
  try {
    if (redis.status === "wait") await redis.connect();
    return await operation();
  } catch (_error) {
    return fallback;
  }
};

const getJson = (key) =>
  safe(async () => {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  });

const setJson = (key, value, ttlSeconds = 60) =>
  safe(() => redis.set(key, JSON.stringify(value), "EX", ttlSeconds));

const delByPattern = (pattern) =>
  safe(async () => {
    const stream = redis.scanStream({ match: pattern, count: 100 });
    const pipeline = redis.pipeline();
    return new Promise((resolve, reject) => {
      stream.on("data", (keys) => keys.forEach((key) => pipeline.del(key)));
      stream.on("end", async () => {
        await pipeline.exec();
        resolve();
      });
      stream.on("error", reject);
    });
  });

const taskListKey = ({ assigneeId, page, limit }) =>
  `tasks:user:${assigneeId || "all"}:page:${page}:limit:${limit}`;

const invalidateTaskCaches = (assigneeId) =>
  Promise.all([delByPattern("tasks:user:all:*"), delByPattern(`tasks:user:${assigneeId || "*"}:*`)]);

module.exports = { getJson, setJson, delByPattern, taskListKey, invalidateTaskCaches };
