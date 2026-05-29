const AppError = require("../utils/AppError");

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query
  });

  if (!result.success) {
    const first = result.error.issues[0];
    return next(
      new AppError(400, "VALIDATION_ERROR", first.message, result.error.flatten())
    );
  }

  req.validated = result.data;
  return next();
};

module.exports = validate;
