"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("clients", {
      client_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      client_code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      client_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      contact_person: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      mobile_no: {
        type: Sequelize.STRING(15),
        allowNull: true,
        unique: true,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      logo: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("clients");
  },
};
