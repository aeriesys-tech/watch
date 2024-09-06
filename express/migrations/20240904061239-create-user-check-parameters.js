'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_check_parameters', {
      user_check_parameter_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      device_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'device_users', // Name of the referenced table
          key: 'device_user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      check_parameter_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'check_parameters', // Name of the referenced table
          key: 'check_parameter_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.BOOLEAN, // New status column as BOOLEAN
        allowNull: false,
        defaultValue: true, // Default value is true (active)
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
    await queryInterface.dropTable('user_check_parameters');
  },
};
