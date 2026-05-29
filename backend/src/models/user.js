module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      organization_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      name: { type: DataTypes.STRING(120), allowNull: false },
      email: { type: DataTypes.STRING(160), allowNull: false, unique: true },
      password_hash: { type: DataTypes.STRING(255), allowNull: false },
      role: {
        type: DataTypes.ENUM("ADMIN", "MANAGER", "MEMBER"),
        allowNull: false,
        defaultValue: "MEMBER"
      },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
      tableName: "users",
      underscored: true,
      defaultScope: { attributes: { exclude: ["password_hash"] } },
      scopes: { withPassword: { attributes: {} } }
    }
  );
