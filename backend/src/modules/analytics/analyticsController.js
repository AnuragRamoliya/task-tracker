const taskService = require("../../services/taskService");

const getAnalytics = async (req, res) => res.json(await taskService.analytics(req.user));

module.exports = { getAnalytics };
