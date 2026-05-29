const request = require("supertest");
const app = require("../src/app");
const { sequelize } = require("../src/models");
const redis = require("../src/config/redis");

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  redis.disconnect();
  await sequelize.close();
});

test("register, login, refresh, and logout flow", async () => {
  const register = await request(app).post("/api/auth/register").send({
    name: "Ada Lovelace",
    email: "ada@example.com",
    password: "Password@123",
    organizationName: "Analytical Engines"
  });

  expect(register.status).toBe(200);
  expect(register.body.accessToken).toBeDefined();
  const cookie = register.headers["set-cookie"];

  const login = await request(app).post("/api/auth/login").send({
    email: "ada@example.com",
    password: "Password@123"
  });
  expect(login.status).toBe(200);

  const refresh = await request(app).post("/api/auth/refresh").set("Cookie", cookie);
  expect(refresh.status).toBe(200);
  expect(refresh.body.accessToken).toBeDefined();

  const logout = await request(app).post("/api/auth/logout").set("Cookie", cookie);
  expect(logout.status).toBe(204);
});
