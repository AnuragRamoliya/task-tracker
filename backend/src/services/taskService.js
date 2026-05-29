const { Op } = require("sequelize");
const { Project, Task, User } = require("../models");
const taskRepository = require("../repositories/taskRepository");
const redisService = require("./redisService");
const notificationService = require("./notificationService");
const AppError = require("../utils/AppError");
const { canTransition, canChangeTaskStatus } = require("../utils/taskTransitions");

const assertTaskAccess = (actor, task) => {
  if (actor.role === "MEMBER" && Number(task.assignee_id) !== Number(actor.id)) {
    throw new AppError(403, "TASK_ACCESS_DENIED", "Members can only access assigned tasks");
  }
};

const listTasks = async (actor, query) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 20);
  const cacheKey = redisService.taskListKey({ assigneeId: query.assignee || (actor.role === "MEMBER" ? actor.id : "all"), page, limit });
  const cached = await redisService.getJson(cacheKey);
  if (cached) return cached;

  const result = await taskRepository.list({
    organizationId: actor.organization_id,
    user: actor,
    status: query.status,
    priority: query.priority,
    assignee: query.assignee,
    page,
    limit,
    sortBy: query.sortBy || "due_date",
    sortOrder: query.sortOrder || "ASC"
  });

  const response = {
    data: result.rows,
    meta: { page, limit, total: result.count, totalPages: Math.ceil(result.count / limit) }
  };
  await redisService.setJson(cacheKey, response, 60);
  return response;
};

const getTask = async (actor, id) => {
  const task = await taskRepository.findById(id, actor.organization_id);
  if (!task) throw new AppError(404, "TASK_NOT_FOUND", "Task not found");
  assertTaskAccess(actor, task);
  return task;
};

const createTask = async (actor, payload) => {
  const project = await Project.findOne({ where: { id: payload.project_id, organization_id: actor.organization_id } });
  if (!project) throw new AppError(404, "PROJECT_NOT_FOUND", "Project not found");
  const assignee = await User.findOne({ where: { id: payload.assignee_id, organization_id: actor.organization_id } });
  if (!assignee) throw new AppError(404, "ASSIGNEE_NOT_FOUND", "Assignee not found");
  const task = await taskRepository.create({ ...payload, created_by: actor.id });
  await redisService.invalidateTaskCaches(task.assignee_id);
  notificationService.notifyUser(task.assignee_id, "task.assigned", { taskId: task.id, title: task.title });
  return task;
};

const updateTask = async (actor, id, payload) => {
  const task = await getTask(actor, id);
  const previousAssignee = task.assignee_id;
  if (payload.assignee_id) {
    const assignee = await User.findOne({ where: { id: payload.assignee_id, organization_id: actor.organization_id } });
    if (!assignee) throw new AppError(404, "ASSIGNEE_NOT_FOUND", "Assignee not found");
  }
  await task.update(payload);
  await redisService.invalidateTaskCaches(previousAssignee);
  await redisService.invalidateTaskCaches(task.assignee_id);
  if (payload.assignee_id && Number(payload.assignee_id) !== Number(previousAssignee)) {
    notificationService.notifyUser(task.assignee_id, "task.assigned", { taskId: task.id, title: task.title });
  }
  return task;
};

const deleteTask = async (actor, id) => {
  const task = await getTask(actor, id);
  await task.destroy();
  await redisService.invalidateTaskCaches(task.assignee_id);
};

const updateStatus = async (actor, id, status) => {
  const task = await getTask(actor, id);
  if (!canChangeTaskStatus(actor, task)) {
    throw new AppError(403, "STATUS_CHANGE_FORBIDDEN", "Only assignee, manager, or admin can change task status");
  }
  if (!canTransition(task.status, status)) {
    throw new AppError(400, "INVALID_STATUS_TRANSITION", `Cannot transition from ${task.status} to ${status}`);
  }
  await task.update({ status, completed_at: status === "DONE" ? new Date() : null });
  await redisService.invalidateTaskCaches(task.assignee_id);
  notificationService.notifyUser(task.assignee_id, "task.status_changed", { taskId: task.id, status });
  return task;
};

const analytics = async (actor) => {
  const overdue = await Task.findAll({
    attributes: ["assignee_id", [Task.sequelize.fn("COUNT", Task.sequelize.col("Task.id")), "count"]],
    where: { due_date: { [Op.lt]: new Date() }, status: { [Op.ne]: "DONE" } },
    include: [{ model: User, as: "assignee", attributes: ["id", "name", "email"], where: { organization_id: actor.organization_id } }],
    group: ["assignee_id", "assignee.id"]
  });
  const completed = await Task.findAll({
    attributes: ["created_at", "completed_at"],
    where: { completed_at: { [Op.ne]: null } }
  });
  const avgMs =
    completed.reduce((sum, task) => sum + (new Date(task.completed_at) - new Date(task.created_at)), 0) /
    (completed.length || 1);
  return {
    overdueTasksPerUser: overdue,
    averageCompletionHours: Number((avgMs / 36e5).toFixed(2))
  };
};

module.exports = { listTasks, getTask, createTask, updateTask, deleteTask, updateStatus, analytics };
