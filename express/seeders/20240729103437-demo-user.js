"use strict";

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "Admin User",
          email: "admin@example.com",
          username: "admin",
          password: "hashed_password",
          mobile_no: "1234567890",
          role_id: 1,
          address: "123 Admin St",
          avatar: "admin.png",
          status: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("users", null, {});
  },
};
