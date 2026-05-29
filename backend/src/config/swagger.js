const swaggerJsdoc = require("swagger-jsdoc");
const env = require("./env");

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Team Task Tracker API",
      version: "1.0.0",
      description: "Authentication, RBAC, projects, tasks, analytics, Redis caching, and SSE notifications."
    },
    servers: [{ url: env.apiBaseUrl }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            status: { type: "integer" },
            code: { type: "string" },
            message: { type: "string" }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }],
    paths: {
      "/api/auth/register": { post: { tags: ["Auth"], security: [], responses: { 200: { description: "Registered" } } } },
      "/api/auth/login": { post: { tags: ["Auth"], security: [], responses: { 200: { description: "Logged in" } } } },
      "/api/auth/refresh": { post: { tags: ["Auth"], security: [], responses: { 200: { description: "Token refreshed" } } } },
      "/api/auth/logout": { post: { tags: ["Auth"], security: [], responses: { 204: { description: "Logged out" } } } },
      "/api/users": {
        get: { tags: ["Users"], responses: { 200: { description: "User list" } } },
        post: { tags: ["Users"], responses: { 201: { description: "User created" } } }
      },
      "/api/users/{id}/role": { patch: { tags: ["Users"], responses: { 200: { description: "Role updated" } } } },
      "/api/projects": {
        get: { tags: ["Projects"], responses: { 200: { description: "Project list" } } },
        post: { tags: ["Projects"], responses: { 201: { description: "Project created" } } }
      },
      "/api/projects/{id}": {
        patch: { tags: ["Projects"], responses: { 200: { description: "Project updated" } } },
        delete: { tags: ["Projects"], responses: { 204: { description: "Project archived" } } }
      },
      "/api/tasks": {
        get: { tags: ["Tasks"], responses: { 200: { description: "Paginated task list" } } },
        post: { tags: ["Tasks"], responses: { 201: { description: "Task created" } } }
      },
      "/api/tasks/{id}": {
        get: { tags: ["Tasks"], responses: { 200: { description: "Task details" } } },
        patch: { tags: ["Tasks"], responses: { 200: { description: "Task updated" } } },
        delete: { tags: ["Tasks"], responses: { 204: { description: "Task deleted" } } }
      },
      "/api/tasks/{id}/status": { patch: { tags: ["Tasks"], responses: { 200: { description: "Task status updated" } } } },
      "/api/analytics": { get: { tags: ["Analytics"], responses: { 200: { description: "Task analytics" } } } },
      "/api/notifications/stream": { get: { tags: ["Notifications"], responses: { 200: { description: "SSE stream" } } } }
    }
  },
  apis: []
});

module.exports = swaggerSpec;
