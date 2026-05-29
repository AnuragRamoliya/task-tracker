const router = require("express").Router();
const controller = require("../modules/auth/authController");
const validate = require("../middleware/validate");
const asyncHandler = require("../utils/asyncHandler");
const schemas = require("../validations/authValidation");

router.post("/register", validate(schemas.register), asyncHandler(controller.register));
router.post("/login", validate(schemas.login), asyncHandler(controller.login));
router.post("/refresh", asyncHandler(controller.refresh));
router.post("/logout", asyncHandler(controller.logout));

module.exports = router;
