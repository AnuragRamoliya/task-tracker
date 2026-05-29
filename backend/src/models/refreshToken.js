module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "RefreshToken",
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      token_hash: { type: DataTypes.STRING(255), allowNull: false },
      jti: { type: DataTypes.STRING(80), allowNull: false, unique: true },
      expires_at: { type: DataTypes.DATE, allowNull: false },
      revoked_at: { type: DataTypes.DATE, allowNull: true },
      replaced_by_jti: { type: DataTypes.STRING(80), allowNull: true }
    },
    {
      tableName: "refresh_tokens",
      underscored: true,
      indexes: [{ fields: ["user_id"] }, { fields: ["jti"] }]
    }
  );
