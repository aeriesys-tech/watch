const cron = require("node-cron");
const db = require("../models");
const { Op } = require("sequelize");

// Schedule a task to run every day at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    const result = await db.UserToken.destroy({
      where: {
        expire_at: {
          [Op.lt]: new Date(),
        },
      },
    });
    console.log(`Deleted ${result} expired tokens`);
  } catch (error) {
    console.error("Error deleting expired tokens:", error);
  }
});
