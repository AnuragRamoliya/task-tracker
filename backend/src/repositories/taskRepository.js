const { Op } = require("sequelize");
const { Task, User, Project } = require("../models");

const buildWhere = ({ organizationId, user, status, priority, assignee }) => {
  const where = {};
  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (assignee) where.assignee_id = assignee;
  if (user.role === "MEMBER") where.assignee_id = user.id;

  return {
    where,
    include: [
      {
        model: Project,
        attributes: ["id", "name", "organization_id"],
        where: { organization_id: organizationId }
      },
      { model: User, as: "assignee", attributes: ["id", "name", "email", "role"] }
    ]
  };
};

const list = async ({ organizationId, user, status, priority, assignee, page, limit, sortBy, sortOrder }) => {
  const query = buildWhere({ organizationId, user, status, priority, assignee });
  const offset = (page - 1) * limit;
  return Task.findAndCountAll({
    ...query,
    distinct: true,
    limit,
    offset,
    order: [[sortBy, sortOrder]]
  });
};

const findById = (id, organizationId) =>
  Task.findOne({
    where: { id },
    include: [
      { model: Project, attributes: ["id", "name", "organization_id"], where: { organization_id: organizationId } },
      { model: User, as: "assignee", attributes: ["id", "name", "email", "role"] }
    ]
  });

const create = (payload) => Task.create(payload);

const overdueByUser = (organizationId) =>
  Task.findAll({
    attributes: ["assignee_id"],
    where: { due_date: { [Op.lt]: new Date() }, status: { [Op.ne]: "DONE" } },
    include: [
      { model: Project, attributes: [], where: { organization_id: organizationId } },
      { model: User, as: "assignee", attributes: ["id", "name", "email"] }
    ]
  });

module.exports = { list, findById, create, overdueByUser };
