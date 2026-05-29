require("dotenv").config();

const required = ["JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"];

if (process.env.NODE_ENV !== "test") {
  required.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  });
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 4000),
  apiBaseUrl: process.env.API_BASE_URL || "http://localhost:4000",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    name: process.env.DB_NAME || "task_tracker",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || ""
  },
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || "test_access_secret",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "test_refresh_secret",
    accessExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d"
  },
  cookieSecure: process.env.COOKIE_SECURE === "true"
};

module.exports = env;
