const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/database")[process.env.NODE_ENV || "development"];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

const Organization = require("./organization")(sequelize, DataTypes);
const User = require("./user")(sequelize, DataTypes);
const Project = require("./project")(sequelize, DataTypes);
const Task = require("./task")(sequelize, DataTypes);
const RefreshToken = require("./refreshToken")(sequelize, DataTypes);

Organization.hasMany(User, { foreignKey: "organization_id" });
User.belongsTo(Organization, { foreignKey: "organization_id" });

Organization.hasMany(Project, { foreignKey: "organization_id" });
Project.belongsTo(Organization, { foreignKey: "organization_id" });

Project.hasMany(Task, { foreignKey: "project_id" });
Task.belongsTo(Project, { foreignKey: "project_id" });

User.hasMany(Task, { as: "assignedTasks", foreignKey: "assignee_id" });
Task.belongsTo(User, { as: "assignee", foreignKey: "assignee_id" });

User.hasMany(Task, { as: "createdTasks", foreignKey: "created_by" });
Task.belongsTo(User, { as: "creator", foreignKey: "created_by" });

User.hasMany(RefreshToken, { foreignKey: "user_id" });
RefreshToken.belongsTo(User, { foreignKey: "user_id" });

module.exports = {
  sequelize,
  Sequelize,
  Organization,
  User,
  Project,
  Task,
  RefreshToken
};
