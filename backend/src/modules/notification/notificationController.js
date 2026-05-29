const notificationService = require("../../services/notificationService");

const stream = (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive"
  });
  res.write("event: connected\ndata: {}\n\n");
  notificationService.addClient(req.user.id, res);
};

module.exports = { stream };
