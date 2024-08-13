"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("api_logs", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // Null allowed if unauthenticated
        references: {
          model: "users", // Adjust this if your user table has a different name
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      api_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      api_request: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ip_address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      message: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      response: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      timestamp: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // Add indexes
    await queryInterface.addIndex("api_logs", ["user_id"]);
    await queryInterface.addIndex("api_logs", ["api_name"]);
    await queryInterface.addIndex("api_logs", ["status"]);
    await queryInterface.addIndex("api_logs", ["ip_address"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("api_logs");
  },
};
