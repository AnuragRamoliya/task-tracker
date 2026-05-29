module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "Organization",
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(120), allowNull: false },
      slug: { type: DataTypes.STRING(140), allowNull: false, unique: true }
    },
    {
      tableName: "organizations",
      underscored: true
    }
  );
