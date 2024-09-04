'use strict';



/** @type {import('sequelize-cli').Migration} */
module.exports = {

  // insert abilties into table
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("abilities", [
      {
        ability_id: 1,
        module_id: 1,
        ability: 'roles.view',
        description: 'View Roles',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 2,
        module_id: 1,
        ability: 'roles.create',
        description: 'Create Roles',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 3,
        module_id: 1,
        ability: 'roles.update',
        description: 'Edit Roles',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 4,
        module_id: 1,
        ability: 'roles.delete',
        description: 'Delete Roles',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 5,
        module_id:2,
        ability: 'units.view',
        description: 'View Units',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 6,
        module_id: 2,
        ability: 'units.create',
        description: 'Create Units',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 7,
        module_id: 2,
        ability: 'units.update',
        description: 'Edit Units',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 8,
        module_id: 2,
        ability: 'units.delete',
        description: 'Delete Units',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 9,
        module_id: 3,
        ability: 'users.view',
        description: 'View Users',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 10,
        module_id: 3,
        ability: 'users.create',
        description: 'Create users',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 11,
        module_id: 3,
        ability: 'users.update',
        description: 'Edit Users',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 12,
        module_id: 3,
        ability: 'users.delete',
        description: 'Delete Users',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 13,
        module_id: 4,
        ability: 'device_users.view',
        description: 'View Device Users',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 14,
        module_id: 4,
        ability: 'device_users.create',
        description: 'Create Device Users',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 15,
        module_id: 4,
        ability: 'device_users.update',
        description: 'Edit Device Users',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 16,
        module_id: 4,
        ability: 'device_users.delete',
        description: 'Delete Device Users',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 17,
        module_id: 5,
        ability: 'devices.view',
        description: 'View Devices',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 18,
        module_id: 5,
        ability: 'devices.create',
        description: 'Create Devices',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 19,
        module_id: 5,
        ability: 'devices.update',
        description: 'Edit Devices',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 20,
        module_id: 5,
        ability: 'devices.delete',
        description: 'Delete Devices',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 21,
        module_id: 6,
        ability: 'client_users.view',
        description: 'View Client Users',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 22,
        module_id: 6,
        ability: 'client_users.create',
        description: 'Create Client Users',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 23,
        module_id: 6,
        ability: 'client_users.update',
        description: 'Edit Client Users',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 24,
        module_id: 6,
        ability: 'client_users.delete',
        description: 'Delete Client Users',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 25,
        module_id: 7,
        ability: 'device_types.view',
        description: 'View Device Types',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 26,
        module_id: 7,
        ability: 'device_types.create',
        description: 'Create Device Types',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 27,
        module_id: 7,
        ability: 'device_types.update',
        description: 'Update Device Types',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 28,
        module_id: 7,
        ability: 'device_types.delete',
        description: 'Delete Device Types',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 29,
        module_id: 8,
        ability: 'clients.view',
        description: 'View Clients',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 30,
        module_id: 8,
        ability: 'clients.create',
        description: 'Create Clients',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 31,
        module_id: 8,
        ability: 'clients.update',
        description: 'Edit Clients',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 32,
        module_id: 8,
        ability: 'clients.delete',
        description: 'Delete Clients',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 33,
        module_id: 9,
        ability: 'check_parameters.view',
        description: 'View Check Parameters',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 34,
        module_id: 9,
        ability: 'check_parameters.create',
        description: 'Create Check Parameters',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 35,
        module_id: 9,
        ability: 'check_parameters.update',
        description: 'Edit Check Parameters',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 36,
        module_id: 9,
        ability: 'check_parameters.delete',
        description: 'Delete Check Parameters',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 37,
        module_id: 10,
        ability: 'check_groups.view',
        description: 'View Check Groups',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 38,
        module_id: 10,
        ability: 'check_groups.create',
        description: 'Create Check Groups',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 39,
        module_id: 10,
        ability: 'check_groups.update',
        description: 'Edit Check Groups',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 40,
        module_id: 10,
        ability: 'check_groups.delete',
        description: 'Delete Check Groups',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 41,
        module_id: 11,
        ability: 'abilities.view',
        description: 'View Abilities',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 42,
        module_id: 11,
        ability: 'abilities.create',
        description: 'Create Abilities',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 43,
        module_id: 11,
        ability: 'abilities.update',
        description: 'Edit Abilities',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 44,
        module_id: 11,
        ability: 'abilities.delete',
        description: 'Delete Abilities',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 45,
        module_id: 12,
        ability: 'role_abilities.import',
        description: 'Import module, ability, and role abilities from JSON',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 46,
        module_id: 12,
        ability: 'role_abilities.change',
        description: 'Change the status of the role ability',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        ability_id: 47,
        module_id: 12,
        ability: 'role_abilities.view',
        description: 'Get all the abilities with role ability status',
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

    // delete all abilities
    await queryInterface.bulkDelete("abilities", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
