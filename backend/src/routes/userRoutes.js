const router = require("express").Router();
const controller = require("../modules/user/userController");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const validate = require("../middleware/validate");
const asyncHandler = require("../utils/asyncHandler");
const schemas = require("../validations/userValidation");

router.get("/", auth, authorize("ADMIN", "MANAGER"), asyncHandler(controller.list));
router.post("/", auth, authorize("ADMIN"), validate(schemas.createUser), asyncHandler(controller.create));
router.patch("/:id/role", auth, authorize("ADMIN"), validate(schemas.updateRole), asyncHandler(controller.updateRole));

module.exports = router;
