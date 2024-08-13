// const Sequelize = require("sequelize");
// const config =
//   require("../config/database")[process.env.NODE_ENV || "development"];

// const sequelize = new Sequelize(
//   config.database,
//   config.username,
//   config.password,
//   config
// );

// const db = {
//   sequelize,
//   Sequelize,
//   Role: require("./role")(sequelize, Sequelize.DataTypes),
//   User: require("./user")(sequelize, Sequelize.DataTypes),
//   UserToken: require("./userToken")(sequelize, Sequelize.DataTypes),
//   Module: require("./module")(sequelize, Sequelize.DataTypes),
//   Ability: require("./ability")(sequelize, Sequelize.DataTypes),
//   RoleAbility: require("./roleAbility")(sequelize, Sequelize.DataTypes),
//   PasswordReset: require("./passwordReset")(sequelize, Sequelize.DataTypes),
//   Language: require("./language")(sequelize, Sequelize.DataTypes),
//   Keyword: require("./keyword")(sequelize, Sequelize.DataTypes), // Ensure Keyword is properly initialized
// };

// Object.keys(db).forEach((modelName) => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// module.exports = db;
"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require("../config/database")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Automatically import all model files in the current directory
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && // Ignore hidden files
      file !== basename && // Ignore this file (index.js)
      file.slice(-3) === ".js" && // Include only .js files
      file.indexOf(".test.js") === -1 // Exclude test files
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// Run associate methods if they exist
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
