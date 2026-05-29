const env = require("../../config/env");
const authService = require("../../services/authService");

const cookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  secure: env.cookieSecure,
  maxAge: 7 * 24 * 60 * 60 * 1000
};
const clearCookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  secure: env.cookieSecure
};

const respondWithAuth = (res, payload) => {
  res.cookie("refreshToken", payload.refreshToken, cookieOptions);
  res.json({
    accessToken: payload.accessToken,
    user: {
      id: payload.user.id,
      name: payload.user.name,
      email: payload.user.email,
      role: payload.user.role,
      organization_id: payload.user.organization_id
    }
  });
};

const register = async (req, res) => respondWithAuth(res, await authService.register(req.validated.body));
const login = async (req, res) => respondWithAuth(res, await authService.login(req.validated.body));
const refresh = async (req, res) => respondWithAuth(res, await authService.refresh(req.cookies.refreshToken || req.body.refreshToken));
const logout = async (req, res) => {
  await authService.logout(req.cookies.refreshToken || req.body.refreshToken);
  res.clearCookie("refreshToken", clearCookieOptions);
  res.status(204).send();
};

module.exports = { register, login, refresh, logout };
