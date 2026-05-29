const projectRepository = require("../repositories/projectRepository");
const AppError = require("../utils/AppError");

const listProjects = (actor) => projectRepository.list(actor.organization_id);

const createProject = (actor, payload) =>
  projectRepository.create({ ...payload, organization_id: actor.organization_id });

const updateProject = async (actor, id, payload) => {
  const project = await projectRepository.findById(id, actor.organization_id);
  if (!project) throw new AppError(404, "PROJECT_NOT_FOUND", "Project not found");
  await project.update(payload);
  return project;
};

const deleteProject = async (actor, id) => {
  const project = await projectRepository.findById(id, actor.organization_id);
  if (!project) throw new AppError(404, "PROJECT_NOT_FOUND", "Project not found");
  await project.update({ is_archived: true });
};

module.exports = { listProjects, createProject, updateProject, deleteProject };
