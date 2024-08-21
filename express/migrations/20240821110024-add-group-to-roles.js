"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the new group column
    await queryInterface.addColumn("roles", "group", {
      type: Sequelize.STRING(100),
      allowNull: true, // Adjust as needed
    });

    // No need to add this index again, comment or remove this section:
    // await queryInterface.addIndex("roles", ["role"], {
    //   unique: true,
    // });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the group column in the down migration
    await queryInterface.removeColumn("roles", "group");
  },
};
