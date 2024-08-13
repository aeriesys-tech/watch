"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("role_abilities", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "roles", // Adjust to the pluralized table name
          key: "role_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      ability_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "abilities", // Adjust to the pluralized table name
          key: "ability_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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

    // Add a unique index on the combination of role_id and ability_id
    await queryInterface.addIndex("role_abilities", ["role_id", "ability_id"], {
      unique: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("role_abilities");
  },
};
