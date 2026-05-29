const request = require("supertest");
const app = require("../src/app");
const { Organization, Project, Task, User, sequelize } = require("../src/models");
const bcrypt = require("bcryptjs");
const redis = require("../src/config/redis");

let adminToken;
let memberToken;
let task;

beforeEach(async () => {
  await sequelize.sync({ force: true });
  const organization = await Organization.create({ name: "Test Org", slug: "test-org" });
  const admin = await User.create({
    organization_id: organization.id,
    name: "Admin",
    email: "admin@test.com",
    password_hash: await bcrypt.hash("Password@123", 12),
    role: "ADMIN"
  });
  const member = await User.create({
    organization_id: organization.id,
    name: "Member",
    email: "member@test.com",
    password_hash: await bcrypt.hash("Password@123", 12),
    role: "MEMBER"
  });
  const project = await Project.create({ organization_id: organization.id, name: "Project" });
  task = await Task.create({
    project_id: project.id,
    title: "Build tests",
    priority: "MEDIUM",
    status: "TODO",
    assignee_id: member.id,
    created_by: admin.id
  });

  adminToken = (await request(app).post("/api/auth/login").send({ email: "admin@test.com", password: "Password@123" })).body.accessToken;
  memberToken = (await request(app).post("/api/auth/login").send({ email: "member@test.com", password: "Password@123" })).body.accessToken;
});

afterAll(async () => {
  redis.disconnect();
  await sequelize.close();
});

test("assignee can perform an allowed status transition", async () => {
  const response = await request(app)
    .patch(`/api/tasks/${task.id}/status`)
    .set("Authorization", `Bearer ${memberToken}`)
    .send({ status: "IN_PROGRESS" });

  expect(response.status).toBe(200);
  expect(response.body.status).toBe("IN_PROGRESS");
});

test("invalid task transition is rejected server-side", async () => {
  const response = await request(app)
    .patch(`/api/tasks/${task.id}/status`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ status: "DONE" });

  expect(response.status).toBe(400);
  expect(response.body.code).toBe("INVALID_STATUS_TRANSITION");
});
