const taskService = require("../../services/taskService");

const list = async (req, res) => res.json(await taskService.listTasks(req.user, req.validated.query));
const get = async (req, res) => res.json(await taskService.getTask(req.user, req.validated.params.id));
const create = async (req, res) => res.status(201).json(await taskService.createTask(req.user, req.validated.body));
const update = async (req, res) => res.json(await taskService.updateTask(req.user, req.validated.params.id, req.validated.body));
const remove = async (req, res) => {
  await taskService.deleteTask(req.user, req.validated.params.id);
  res.status(204).send();
};
const updateStatus = async (req, res) =>
  res.json(await taskService.updateStatus(req.user, req.validated.params.id, req.validated.body.status));

module.exports = { list, get, create, update, remove, updateStatus };
