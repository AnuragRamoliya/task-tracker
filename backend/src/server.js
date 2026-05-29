const app = require("./app");
const env = require("./config/env");
const redis = require("./config/redis");
const { sequelize } = require("./models");

const start = async () => {
  await sequelize.authenticate();
  try {
    await redis.connect();
  } catch (_error) {
    console.warn("Redis unavailable at startup; API will continue without cache until Redis is reachable.");
  }
  app.listen(env.port, () => {
    console.log(`Team Task Tracker API listening on port ${env.port}`);
  });
};

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
