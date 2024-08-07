const Sequelize = require("sequelize");
const config =
  require("../config/database")[process.env.NODE_ENV || "development"];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const db = {
  sequelize,
  Sequelize,
  Role: require("./role")(sequelize, Sequelize.DataTypes),
  User: require("./user")(sequelize, Sequelize.DataTypes),
  UserToken: require("./userToken")(sequelize, Sequelize.DataTypes),
  Module: require("./module")(sequelize, Sequelize.DataTypes),
  Ability: require("./ability")(sequelize, Sequelize.DataTypes),
  RoleAbility: require("./roleAbility")(sequelize, Sequelize.DataTypes),
  PasswordReset: require("./passwordReset")(sequelize, Sequelize.DataTypes),
};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
