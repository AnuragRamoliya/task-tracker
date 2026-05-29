const { z } = require("./common");

const createProject = z.object({
  body: z.object({
    name: z.string().min(2).max(140),
    description: z.string().max(5000).optional()
  }),
  params: z.any().optional(),
  query: z.any().optional()
});

const updateProject = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z.object({
    name: z.string().min(2).max(140).optional(),
    description: z.string().max(5000).optional()
  }),
  query: z.any().optional()
});

module.exports = { createProject, updateProject };
