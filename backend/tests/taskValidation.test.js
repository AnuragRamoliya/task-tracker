const { listTasks } = require("../src/validations/taskValidation");

test("list task filters ignore empty query string values", () => {
  const result = listTasks.safeParse({
    body: undefined,
    params: {},
    query: {
      page: "1",
      limit: "10",
      status: "",
      priority: "",
      assignee: "",
      sortBy: "",
      sortOrder: ""
    }
  });

  expect(result.success).toBe(true);
  expect(result.data.query).toEqual({
    page: 1,
    limit: 10,
    status: undefined,
    priority: undefined,
    assignee: undefined,
    sortBy: "due_date",
    sortOrder: "ASC"
  });
});

test("list task filters still reject invalid enum values", () => {
  const result = listTasks.safeParse({
    body: undefined,
    params: {},
    query: {
      status: "INVALID",
      priority: "MEDIUM"
    }
  });

  expect(result.success).toBe(false);
});
