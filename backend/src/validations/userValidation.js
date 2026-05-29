const { z, role } = require("./common");

const createUser = z.object({
  body: z.object({
    name: z.string().min(2).max(120),
    email: z.string().email(),
    password: z.string().min(8).max(72),
    role: role.default("MEMBER")
  }),
  params: z.any().optional(),
  query: z.any().optional()
});

const updateRole = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z.object({ role }),
  query: z.any().optional()
});

module.exports = { createUser, updateRole };
