"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("abilities", {
      ability_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      module_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "modules", // References the modules table
          key: "module_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      ability: {
        type: Sequelize.STRING(250),
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING(250),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("abilities");
  },
};
