"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("check_parameters", {
      check_parameter_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      device_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "device_types",
          key: "device_type_id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      check_group_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "check_groups",
          key: "check_group_id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      parameter_code: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      parameter_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      unit_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "units",
          key: "unit_id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      icon: {
        type: Sequelize.STRING(100),
        allowNull: true,
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("check_parameters");
  },
};
