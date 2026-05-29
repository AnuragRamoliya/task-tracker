const jwt = require("jsonwebtoken");
const env = require("../config/env");
const AppError = require("../utils/AppError");
const { User } = require("../models");

const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) throw new AppError(401, "UNAUTHENTICATED", "Access token is required");

    const payload = jwt.verify(token, env.jwt.accessSecret);
    const user = await User.findByPk(payload.sub);
    if (!user || !user.is_active) {
      throw new AppError(401, "UNAUTHENTICATED", "Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error instanceof AppError ? error : new AppError(401, "UNAUTHENTICATED", "Invalid access token"));
  }
};

module.exports = authMiddleware;
