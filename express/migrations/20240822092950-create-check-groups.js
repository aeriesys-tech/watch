"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "check_groups",
      {
        check_group_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        check_group: {
          type: Sequelize.STRING(100),
          allowNull: false,
          unique: true,
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
      },
      {
        timestamps: true,
        paranoid: true,
        underscored: true,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("check_groups");
  },
};
