"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("devices", {
      device_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      client_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "clients", // Name of the target table
          key: "client_id", // Key in the target table
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      device_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "device_types", // Name of the target table
          key: "device_type_id", // Key in the target table
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      serial_no: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      mobile_no: {
        type: Sequelize.STRING(15),
        allowNull: false,
        unique: true,
      },
      port_no: {
        type: Sequelize.STRING(10),
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
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("devices");
  },
};
