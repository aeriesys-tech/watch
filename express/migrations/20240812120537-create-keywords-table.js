"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("keywords", {
      keyword_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      language_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "languages",
          key: "language_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      keyword: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      regional_keyword: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Add indexes
    await queryInterface.addIndex("keywords", ["keyword"], {
      unique: true,
    });
    await queryInterface.addIndex("keywords", ["regional_keyword"]);
    await queryInterface.addIndex("keywords", ["language_id"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("keywords");
  },
};
