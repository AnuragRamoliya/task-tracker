const router = require("express").Router();
const controller = require("../modules/task/taskController");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const validate = require("../middleware/validate");
const asyncHandler = require("../utils/asyncHandler");
const schemas = require("../validations/taskValidation");
const { idParam } = require("../validations/common");

router.get("/", auth, validate(schemas.listTasks), asyncHandler(controller.list));
router.get("/:id", auth, validate(idParam), asyncHandler(controller.get));
router.post("/", auth, authorize("ADMIN", "MANAGER"), validate(schemas.createTask), asyncHandler(controller.create));
router.patch("/:id", auth, authorize("ADMIN", "MANAGER"), validate(schemas.updateTask), asyncHandler(controller.update));
router.delete("/:id", auth, authorize("ADMIN", "MANAGER"), validate(idParam), asyncHandler(controller.remove));
router.patch("/:id/status", auth, validate(schemas.updateStatus), asyncHandler(controller.updateStatus));

module.exports = router;
