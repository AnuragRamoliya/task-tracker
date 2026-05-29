const userService = require("../../services/userService");

const list = async (req, res) => res.json(await userService.listUsers(req.user));
const create = async (req, res) => res.status(201).json(await userService.createUser(req.user, req.validated.body));
const updateRole = async (req, res) =>
  res.json(await userService.updateRole(req.user, req.validated.params.id, req.validated.body.role));

module.exports = { list, create, updateRole };
