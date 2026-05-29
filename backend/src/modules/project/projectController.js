const projectService = require("../../services/projectService");

const list = async (req, res) => res.json(await projectService.listProjects(req.user));
const create = async (req, res) => res.status(201).json(await projectService.createProject(req.user, req.validated.body));
const update = async (req, res) =>
  res.json(await projectService.updateProject(req.user, req.validated.params.id, req.validated.body));
const remove = async (req, res) => {
  await projectService.deleteProject(req.user, req.validated.params.id);
  res.status(204).send();
};

module.exports = { list, create, update, remove };
