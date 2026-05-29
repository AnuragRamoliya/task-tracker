const { z, priority, status, futureDate, emptyStringToUndefined } = require("./common");

const taskBase = {
  project_id: z.coerce.number().int().positive(),
  title: z.string().min(2).max(180),
  description: z.string().max(10000).optional(),
  priority: priority.default("MEDIUM"),
  assignee_id: z.coerce.number().int().positive(),
  due_date: futureDate
};

const createTask = z.object({
  body: z.object(taskBase),
  params: z.any().optional(),
  query: z.any().optional()
});

const updateTask = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z.object({
    title: z.string().min(2).max(180).optional(),
    description: z.string().max(10000).optional(),
    priority: priority.optional(),
    assignee_id: z.coerce.number().int().positive().optional(),
    due_date: futureDate
  }),
  query: z.any().optional()
});

const updateStatus = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z.object({ status }),
  query: z.any().optional()
});

const listTasks = z.object({
  body: z.any().optional(),
  params: z.any().optional(),
  query: z.object({
    page: emptyStringToUndefined(z.coerce.number().int().positive().default(1)),
    limit: emptyStringToUndefined(z.coerce.number().int().positive().max(100).default(20)),
    status: emptyStringToUndefined(status.optional()),
    priority: emptyStringToUndefined(priority.optional()),
    assignee: emptyStringToUndefined(z.coerce.number().int().positive().optional()),
    sortBy: emptyStringToUndefined(z.enum(["due_date", "created_at", "priority", "status"]).default("due_date")),
    sortOrder: emptyStringToUndefined(z.enum(["ASC", "DESC"]).default("ASC"))
  })
});

module.exports = { createTask, updateTask, updateStatus, listTasks };
