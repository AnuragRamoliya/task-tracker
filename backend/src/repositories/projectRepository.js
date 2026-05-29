const { Project } = require("../models");

const list = (organizationId) =>
  Project.findAll({
    where: { organization_id: organizationId, is_archived: false },
    order: [["created_at", "DESC"]]
  });

const findById = (id, organizationId) =>
  Project.findOne({ where: { id, organization_id: organizationId } });

const create = (payload) => Project.create(payload);

module.exports = { list, findById, create };
