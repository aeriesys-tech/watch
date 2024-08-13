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
          model: "modules", // Table name in lowercase
          key: "module_id",
        },
        onDelete: "SET NULL", // Handle deletion of referenced rows
        onUpdate: "CASCADE", // Handle updates to referenced rows
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

    // Add index on module_id, ability, and description
    await queryInterface.addIndex("abilities", [
      "module_id",
      "ability",
      "description",
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("abilities");
  },
};
