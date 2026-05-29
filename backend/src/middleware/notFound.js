const AppError = require("../utils/AppError");

module.exports = (req, res, next) => {
  next(new AppError(404, "NOT_FOUND", `Route ${req.method} ${req.originalUrl} not found`));
};
