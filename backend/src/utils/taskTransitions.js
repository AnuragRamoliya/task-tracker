const activeStates = ["TODO", "IN_PROGRESS", "IN_REVIEW"];

const allowedTransitions = {
  TODO: ["IN_PROGRESS", "BLOCKED"],
  IN_PROGRESS: ["IN_REVIEW", "BLOCKED"],
  IN_REVIEW: ["DONE", "BLOCKED"],
  BLOCKED: ["TODO", "IN_PROGRESS"],
  DONE: []
};

const canTransition = (from, to) =>
  from === to || Boolean(allowedTransitions[from]?.includes(to));

const canChangeTaskStatus = (user, task) =>
  user.role === "ADMIN" ||
  user.role === "MANAGER" ||
  Number(task.assignee_id) === Number(user.id);

module.exports = { activeStates, allowedTransitions, canTransition, canChangeTaskStatus };
