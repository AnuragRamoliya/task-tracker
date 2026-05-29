module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "Task",
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      project_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      title: { type: DataTypes.STRING(180), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      priority: {
        type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH"),
        allowNull: false,
        defaultValue: "MEDIUM"
      },
      status: {
        type: DataTypes.ENUM("TODO", "IN_PROGRESS", "IN_REVIEW", "DONE", "BLOCKED"),
        allowNull: false,
        defaultValue: "TODO"
      },
      assignee_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      created_by: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      due_date: { type: DataTypes.DATE, allowNull: true },
      completed_at: { type: DataTypes.DATE, allowNull: true }
    },
    {
      tableName: "tasks",
      underscored: true,
      indexes: [
        { fields: ["status"] },
        { fields: ["assignee_id"] },
        { fields: ["due_date"] },
        { fields: ["assignee_id", "status"] }
      ]
    }
  );
