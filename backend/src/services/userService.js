const bcrypt = require("bcryptjs");
const { User } = require("../models");
const userRepository = require("../repositories/userRepository");
const AppError = require("../utils/AppError");

const listUsers = (actor) => userRepository.list(actor.organization_id);

const createUser = async (actor, payload) => {
  const existing = await userRepository.findByEmailWithPassword(payload.email);
  if (existing) throw new AppError(409, "EMAIL_EXISTS", "Email is already registered");
  return User.create({
    organization_id: actor.organization_id,
    name: payload.name,
    email: payload.email,
    password_hash: await bcrypt.hash(payload.password, 12),
    role: payload.role || "MEMBER"
  });
};

const updateRole = async (actor, id, role) => {
  if (Number(actor.id) === Number(id)) {
    throw new AppError(400, "INVALID_ROLE_CHANGE", "Users cannot change their own role");
  }
  const user = await User.findOne({ where: { id, organization_id: actor.organization_id } });
  if (!user) throw new AppError(404, "USER_NOT_FOUND", "User not found");
  await user.update({ role });
  return user;
};

module.exports = { listUsers, createUser, updateRole };
