const { z } = require("./common");

const register = z.object({
  body: z.object({
    name: z.string().min(2).max(120),
    email: z.string().email(),
    password: z.string().min(8).max(72),
    organizationName: z.string().min(2).max(120).optional()
  }),
  params: z.any().optional(),
  query: z.any().optional()
});

const login = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1)
  }),
  params: z.any().optional(),
  query: z.any().optional()
});

module.exports = { register, login };
