const AppError = require("../utils/AppError");

const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new AppError(401, "UNAUTHENTICATED", "Authentication required"));
  }
  if (!roles.includes(req.user.role)) {
    return next(new AppError(403, "FORBIDDEN", "You do not have permission for this action"));
  }
  return next();
};

module.exports = authorize;
