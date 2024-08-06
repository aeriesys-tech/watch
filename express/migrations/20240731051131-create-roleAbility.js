"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("role_abilities", {
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "roles", // References the roles table
          key: "role_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      ability_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "abilities", // References the abilities table
          key: "ability_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
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
    await queryInterface.dropTable("role_abilities");
  },
};
