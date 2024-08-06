"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop foreign key constraint from users table
    await queryInterface.removeConstraint("users", "users_ibfk_1"); // Use the correct constraint name

    // Optionally, drop the table if necessary
    await queryInterface.dropTable("roles");
  },

  down: async (queryInterface, Sequelize) => {
    // Recreate the roles table (assuming you have the structure)
    await queryInterface.createTable("roles", {
      role_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      // Add other fields here
    });

    // Recreate the foreign key constraint
    await queryInterface.addConstraint("users", {
      fields: ["role_id"],
      type: "foreign key",
      name: "users_ibfk_1",
      references: {
        table: "roles",
        field: "role_id",
      },
    });
  },
};
