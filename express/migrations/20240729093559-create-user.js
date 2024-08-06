"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      user_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(100),
        unique: true,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING(100),
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(250),
        allowNull: false,
      },
      mobile_no: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      role_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "roles",
          key: "role_id",
        },
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      avatar: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "avatar.png",
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("users");
  },
};
