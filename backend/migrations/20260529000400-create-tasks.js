"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tasks", {
      id: { type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      project_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "projects", key: "id" },
        onDelete: "CASCADE"
      },
      title: { type: Sequelize.STRING(180), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      priority: { type: Sequelize.ENUM("LOW", "MEDIUM", "HIGH"), allowNull: false, defaultValue: "MEDIUM" },
      status: {
        type: Sequelize.ENUM("TODO", "IN_PROGRESS", "IN_REVIEW", "DONE", "BLOCKED"),
        allowNull: false,
        defaultValue: "TODO"
      },
      assignee_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "RESTRICT"
      },
      created_by: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "RESTRICT"
      },
      due_date: { type: Sequelize.DATE, allowNull: true },
      completed_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }
    });
    await queryInterface.addIndex("tasks", ["status"]);
    await queryInterface.addIndex("tasks", ["assignee_id"]);
    await queryInterface.addIndex("tasks", ["due_date"]);
    await queryInterface.addIndex("tasks", ["assignee_id", "status"]);
  },
  async down(queryInterface) {
    await queryInterface.dropTable("tasks");
  }
};
