const env = require("./env");

module.exports = {
  development: {
    username: env.db.user,
    password: env.db.password,
    database: env.db.name,
    host: env.db.host,
    port: env.db.port,
    dialect: "mysql",
    logging: false,
    dialectOptions: {
        decimalNumbers: true
    },
    seederStorage: "sequelize",
    seederStorageTableName: "SequelizeMetaSeeders"
  },
  test: {
    dialect: "sqlite",
    storage: ":memory:",
    logging: false
  },
  production: {
    username: env.db.user,
    password: env.db.password,
    database: env.db.name,
    host: env.db.host,
    port: env.db.port,
    dialect: "mysql",
    logging: false,
    pool: { max: 20, min: 2, idle: 10000, acquire: 30000 }
  }
};
