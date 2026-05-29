const { User } = require("../models");

const findByEmailWithPassword = (email) =>
  User.unscoped().findOne({ where: { email } });

const findById = (id) => User.findByPk(id);

const list = (organizationId) =>
  User.findAll({
    where: { organization_id: organizationId },
    order: [["created_at", "DESC"]]
  });

const create = (payload, options = {}) => User.create(payload, options);

module.exports = { findByEmailWithPassword, findById, list, create };
