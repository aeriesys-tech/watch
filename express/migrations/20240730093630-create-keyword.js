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
        references: {
          model: "languages",
          key: "language_id",
        },
        allowNull: true,
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
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("keywords");
  },
};
