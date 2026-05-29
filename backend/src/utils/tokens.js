const jwt = require("jsonwebtoken");
const env = require("../config/env");

const signAccessToken = (user) =>
  jwt.sign(
    { sub: user.id, role: user.role, organizationId: user.organization_id },
    env.jwt.accessSecret,
    { expiresIn: env.jwt.accessExpiresIn }
  );

const signRefreshToken = (user, jti) =>
  jwt.sign({ sub: user.id, jti }, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn
  });

module.exports = { signAccessToken, signRefreshToken };
