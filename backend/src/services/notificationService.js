const clients = new Map();

const addClient = (userId, res) => {
  const id = Number(userId);
  if (!clients.has(id)) clients.set(id, new Set());
  clients.get(id).add(res);
  res.on("close", () => clients.get(id)?.delete(res));
};

const notifyUser = (userId, event, payload) => {
  const userClients = clients.get(Number(userId));
  if (!userClients) return;
  userClients.forEach((res) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  });
};

module.exports = { addClient, notifyUser };
