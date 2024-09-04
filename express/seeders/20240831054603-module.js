'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('modules', [
      {
        module_id: 1,
        module: 'Roles',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        module_id: 2,
        module: 'Units',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        module_id: 3,
        module: 'Users',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        module_id: 4,
        module: 'Device Users',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        module_id: 5,
        module: 'Devices',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        module_id: 6,
        module: 'Client Users',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        module_id: 7,
        module: 'Device Types',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        module_id: 8,
        module: 'Clients',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        module_id: 9,
        module: 'Check Parameters',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        module_id: 10,
        module: 'Check Groups',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        module_id: 11,
        module: 'Abilities',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        module_id: 12,
        module: 'Role Abilities',
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('modules', null, {})
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
