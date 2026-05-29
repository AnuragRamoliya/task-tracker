const { z } = require("zod");

const idParam = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z.any().optional(),
  query: z.any().optional()
});

const role = z.enum(["ADMIN", "MANAGER", "MEMBER"]);
const priority = z.enum(["LOW", "MEDIUM", "HIGH"]);
const status = z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE", "BLOCKED"]);
const emptyStringToUndefined = (schema) => z.preprocess((value) => (value === "" ? undefined : value), schema);

const futureDate = z
  .string()
  .datetime()
  .optional()
  .refine((value) => !value || new Date(value) > new Date(), "due_date must be a future date");

module.exports = { z, idParam, role, priority, status, futureDate, emptyStringToUndefined };
