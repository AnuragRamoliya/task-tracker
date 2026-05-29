const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");
const env = require("../config/env");

const securityMiddleware = [
  helmet(),
  cors({
    origin: env.frontendUrl,
    credentials: true
  }),
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false
  }),
  xss()
];

module.exports = securityMiddleware;
