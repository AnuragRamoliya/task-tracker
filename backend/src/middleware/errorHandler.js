const AppError = require("../utils/AppError");

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) return next(error);

  const normalized =
    error instanceof AppError
      ? error
      : new AppError(500, "INTERNAL_SERVER_ERROR", "Unexpected server error");

  if (normalized.status >= 500 && process.env.NODE_ENV !== "test") {
    console.error(error);
  }

  res.status(normalized.status).json({
    status: normalized.status,
    code: normalized.code,
    message: normalized.message,
    ...(normalized.details ? { details: normalized.details } : {})
  });
};

module.exports = errorHandler;
