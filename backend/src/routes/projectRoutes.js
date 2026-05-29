const router = require("express").Router();
const controller = require("../modules/project/projectController");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const validate = require("../middleware/validate");
const asyncHandler = require("../utils/asyncHandler");
const schemas = require("../validations/projectValidation");
const { idParam } = require("../validations/common");

router.get("/", auth, asyncHandler(controller.list));
router.post("/", auth, authorize("ADMIN", "MANAGER"), validate(schemas.createProject), asyncHandler(controller.create));
router.patch("/:id", auth, authorize("ADMIN", "MANAGER"), validate(schemas.updateProject), asyncHandler(controller.update));
router.delete("/:id", auth, authorize("ADMIN", "MANAGER"), validate(idParam), asyncHandler(controller.remove));

module.exports = router;
