const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { Organization, RefreshToken, sequelize } = require("../models");
const userRepository = require("../repositories/userRepository");
const AppError = require("../utils/AppError");
const { signAccessToken, signRefreshToken } = require("../utils/tokens");

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");
const refreshExpiry = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

const issueTokens = async (user, transaction) => {
  const jti = crypto.randomUUID();
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user, jti);
  await RefreshToken.create(
    {
      user_id: user.id,
      token_hash: hashToken(refreshToken),
      jti,
      expires_at: refreshExpiry()
    },
    { transaction }
  );
  return { accessToken, refreshToken };
};

const register = async ({ name, email, password, organizationName }) =>
  sequelize.transaction(async (transaction) => {
    const existing = await userRepository.findByEmailWithPassword(email);
    if (existing) throw new AppError(409, "EMAIL_EXISTS", "Email is already registered");

    const organization = await Organization.create(
      {
        name: organizationName || `${name}'s Organization`,
        slug: `${email.split("@")[0]}-${crypto.randomBytes(4).toString("hex")}`
      },
      { transaction }
    );

    const user = await userRepository.create(
      {
        organization_id: organization.id,
        name,
        email,
        password_hash: await bcrypt.hash(password, 12),
        role: "ADMIN"
      },
      { transaction }
    );

    return { user, ...(await issueTokens(user, transaction)) };
  });

const login = async ({ email, password }) => {
  const user = await userRepository.findByEmailWithPassword(email);
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  }
  if (!user.is_active) throw new AppError(403, "ACCOUNT_DISABLED", "Account is disabled");
  return { user, ...(await issueTokens(user)) };
};

const refresh = async (refreshToken) => {
  if (!refreshToken) throw new AppError(401, "REFRESH_TOKEN_REQUIRED", "Refresh token is required");
  const payload = jwt.verify(refreshToken, env.jwt.refreshSecret);
  const stored = await RefreshToken.findOne({ where: { jti: payload.jti } });
  if (!stored || stored.revoked_at || stored.expires_at < new Date()) {
    throw new AppError(401, "INVALID_REFRESH_TOKEN", "Invalid refresh token");
  }
  if (stored.token_hash !== hashToken(refreshToken)) {
    throw new AppError(401, "INVALID_REFRESH_TOKEN", "Invalid refresh token");
  }

  return sequelize.transaction(async (transaction) => {
    const user = await userRepository.findById(payload.sub);
    const tokens = await issueTokens(user, transaction);
    const decoded = jwt.decode(tokens.refreshToken);
    await stored.update(
      { revoked_at: new Date(), replaced_by_jti: decoded.jti },
      { transaction }
    );
    return { user, ...tokens };
  });
};

const logout = async (refreshToken) => {
  if (!refreshToken) return;
  await RefreshToken.update(
    { revoked_at: new Date() },
    { where: { token_hash: hashToken(refreshToken), revoked_at: null } }
  );
};

module.exports = { register, login, refresh, logout };
