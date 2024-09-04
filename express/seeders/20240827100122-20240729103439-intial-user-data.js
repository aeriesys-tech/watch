const bcrypt = require("bcrypt"); // Ensure you have bcrypt installed

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insert dummy users into the Users table
    await queryInterface.bulkInsert("users", [
      {
        name: "Admin",
        email: "admin@admin.com",
        username: "admin",
        password: await bcrypt.hash("admin123", 10), // hashed password
        mobile_no: "1234567890",
        role_id: 1, // Assuming 1 corresponds to Super Admin
        address: "123 Main St, bglr, IND",
        avatar: "admin.png",
        status: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Add more users as needed
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Delete all users
    await queryInterface.bulkDelete("users", null, {});
  },
};
