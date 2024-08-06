const db = require("../models");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

// Add a new user
const addUser = async (req, res) => {
  try {
    const { name, email, username, password, mobile_no, role_id, address } =
      req.body;

    // Check if the email already exists in the database
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        message: "User with same email already exists",
        errors: { email: "User with same email already exists" },
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await db.User.create({
      name,
      email,
      username,
      password: hashedPassword,
      mobile_no,
      role_id,
      address,
    });

    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// // Update a user
// const updateUser = async (req, res) => {
//   try {
//     const { user_id, name, email, username, mobile_no, role_id, address } =
//       req.body;

//     console.log(req.body); // Log the request body

//     // Perform the update
//     const [rowsUpdated] = await db.User.update(
//       { name, email, username, mobile_no, role_id, address },
//       { where: { user_id } }
//     );

//     console.log(`Rows updated: ${rowsUpdated}`); // Log the result of the update

//     if (rowsUpdated === 0) {
//       // If no rows were updated, send a 404 response
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Fetch the updated user
//     const updatedUser = await db.User.findOne({
//       where: { user_id },
//       attributes: { exclude: ["password"] }, // Exclude the password
//     });

//     if (!updatedUser) {
//       // If the user was not found after update, send a 404 response
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Send the updated user object
//     res.json(updatedUser);
//   } catch (error) {
//     console.error(error.message); // Log the error message
//     res.status(500).json({ error: error.message });
//   }
// };
const updateUser = async (req, res) => {
  try {
    const { user_id, name, email, username, mobile_no, role_id, address } =
      req.body;

    console.log(req.body); // Log the request body

    // Check if the email already exists in the database and belongs to a different user
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser && existingUser.user_id !== user_id) {
      return res
        .status(400)
        .json({
          message: "User with same email already exists",
          errors: { email: "User with same email already exists" },
        });
    }

    // Perform the update
    const [rowsUpdated] = await db.User.update(
      { name, email, username, mobile_no, role_id, address },
      { where: { user_id } }
    );

    console.log(`Rows updated: ${rowsUpdated}`); // Log the result of the update

    if (rowsUpdated === 0) {
      // If no rows were updated, send a 404 response
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch the updated user
    const updatedUser = await db.User.findOne({
      where: { user_id },
      attributes: { exclude: ["password"] }, // Exclude the password
    });

    if (!updatedUser) {
      // If the user was not found after update, send a 404 response
      return res.status(404).json({ error: "User not found" });
    }

    // Send the updated user object
    res.json(updatedUser);
  } catch (error) {
    console.error(error.message); // Log the error message
    res.status(500).json({ error: error.message });
  }
};

// Delete a user

const deleteUser = async (req, res) => {
  try {
    const { user_id } = req.body;

    // Fetch the user, including those marked as deleted (paranoid: false)
    const user = await db.User.findOne({ where: { user_id }, paranoid: false });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Log the current state of the user
    console.log(`Current state of user ${user_id}:`, user.toJSON());

    if (user.deleted_at) {
      // Restore the user
      await user.restore(); // Restore the record
      user.status = true; // Update status after restoring
      await user.save(); // Save the changes
      console.log(`Restored user with ID ${user_id}`);
      return res.json({ message: "User restored successfully" });
    } else {
      // Soft delete the user
      user.status = false; // Update status before deleting
      await user.save(); // Save the status change
      await user.destroy(); // Soft delete the record
      console.log(`Soft deleted user with ID ${user_id}`);
      return res.json({ message: "User soft deleted successfully" });
    }
  } catch (error) {
    console.error("Error in deleteUser function:", error);
    res.status(500).json({ error: error.message });
  }
};

// View a user
const viewUser = async (req, res) => {
  try {
    const { user_id } = req.body;
    const user = await db.User.findOne({
      where: { user_id },
      attributes: { exclude: ["password"] },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await db.User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Paginate users
// const paginateUsers = async (req, res) => {
//   try {
//     const { page = 1, limit = 10 } = req.body;
//     const offset = (page - 1) * limit;
//     const users = await db.User.findAndCountAll({
//       paranoid: false,
//       limit,
//       offset,
//       attributes: { exclude: ["password"] },
//     });
//     res.json({
//       data: users.rows,
//       totalPages: Math.ceil(users.count / limit),
//       currentPage: page,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
const paginateUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "created_at",
      order = "asc",
      search = "",
      status,
    } = req.query;

    const offset = (page - 1) * limit;

    // Build the sort object dynamically
    const sort = [[sortBy, order.toUpperCase()]];

    // Implement search and status filter
    const where = {
      ...(search && {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { username: { [Op.like]: `%${search}%` } },
          // Add any other fields you want to search by
        ],
      }),
      ...(status && { status: status === "active" ? true : false }),
    };

    const users = await db.User.findAndCountAll({
      where,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: sort,
      attributes: { exclude: ["password"] },
      paranoid: false,
    });

    res.json({
      data: users.rows,
      totalPages: Math.ceil(users.count / limit),
      currentPage: parseInt(page, 10),
      totalItems: users.count,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addUser,
  updateUser,
  deleteUser,
  viewUser,
  getUsers,
  paginateUsers,
};
