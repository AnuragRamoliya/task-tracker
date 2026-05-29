const router = require("express").Router();
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const projectRoutes = require("./projectRoutes");
const taskRoutes = require("./taskRoutes");
const analyticsController = require("../modules/analytics/analyticsController");
const notificationController = require("../modules/notification/notificationController");
const asyncHandler = require("../utils/asyncHandler");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.get("/analytics", auth, authorize("ADMIN", "MANAGER"), asyncHandler(analyticsController.getAnalytics));
router.get("/notifications/stream", auth, notificationController.stream);

module.exports = router;
