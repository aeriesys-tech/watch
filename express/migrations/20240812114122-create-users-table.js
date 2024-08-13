"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING(250),
        allowNull: false,
      },
      mobile_no: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false, // Keep this as not null
        references: {
          model: "roles",
          key: "role_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // Change the delete behavior to cascade
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      avatar: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: "avatar.png",
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Add indexes
    await queryInterface.addIndex("users", ["name"]);
    await queryInterface.addIndex("users", ["email"], { unique: true });
    await queryInterface.addIndex("users", ["username"], { unique: true });
    await queryInterface.addIndex("users", ["mobile_no"], { unique: true });
    await queryInterface.addIndex("users", ["role_id"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("users");
  },
};
