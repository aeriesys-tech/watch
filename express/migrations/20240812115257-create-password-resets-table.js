"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("password_resets", {
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expire_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Add index on email and token for faster lookups
    await queryInterface.addIndex("password_resets", ["email"]);
    await queryInterface.addIndex("password_resets", ["token"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("password_resets");
  },
};
