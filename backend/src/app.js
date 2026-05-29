const express = require("express");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const routes = require("./routes");
const securityMiddleware = require("./middleware/security");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");
const swaggerSpec = require("./config/swagger");

const app = express();

app.use(securityMiddleware);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
