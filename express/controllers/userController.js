const db = require("../models");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { sendResponse } = require("../services/responseService");
const database = require("../config/database");

// Add a new user

const addUser = async (req, res) => {
  try {
    const { name, email, username, password, mobile_no, role_id, address } =
      req.body;

    // Check if the email, username, or mobile number already exists in the database
    const existingUser = await db.User.findOne({
      where: {
        [Op.or]: [{ email }, { username }, { mobile_no }],
      },
    });

    if (existingUser) {
      const errors = {};
      if (existingUser.email === email) {
        errors.email = "User with the same email already exists";
      }
      if (existingUser.username === username) {
        errors.username = "User with the same username already exists";
      }
      if (existingUser.mobile_no === mobile_no) {
        errors.mobile_no = "User with the same mobile number already exists";
      }
      return sendResponse(
        res,
        400,
        false,
        "Validation Error",
        null,
        errors
      );
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

    return sendResponse(res, 201, true, "User created successfully", newUser);
  } catch (error) {
    console.error("Error in addUser function:", error);
    return sendResponse(res, 500, false, error.message);
  }
};

// // Update a user

// const updateUser = async (req, res) => {
//   try {
//     const { user_id, name, email, username, mobile_no, role_id, address } =
//       req.body;

//     console.log(req.body); // Log the request body

//     // Check if the email, username, or mobile number already exists in the database and belongs to a different user
//     const existingUser = await db.User.findOne({
//       where: {
//         [Op.or]: [{ email }, { username }, { mobile_no }],
//         user_id: { [Op.ne]: user_id }, // Exclude the current user from the check
//       },
//     });

//     if (existingUser) {
//       const errors = {};
//       if (existingUser.email === email) {
//         errors.email = "User with the same email already exists";
//       }
//       if (existingUser.username === username) {
//         errors.username = "User with the same username already exists";
//       }
//       if (existingUser.mobile_no === mobile_no) {
//         errors.mobile_no = "User with the same mobile number already exists";
//       }
//       return sendResponse(res, 400, false, "Validation Error", null, errors);
//     }

//     // Perform the update
//     const [rowsUpdated] = await db.User.update(
//       { name, email, username, mobile_no, role_id, address },
//       { where: { user_id } }
//     );

//     console.log(`Rows updated: ${rowsUpdated}`); // Log the result of the update

//     if (rowsUpdated === 0) {
//       // If no rows were updated, send a 404 response
//       return sendResponse(res, 404, false, "User not found", null, errors);
//     }

//     // Fetch the updated user
//     const updatedUser = await db.User.findOne({
//       where: { user_id },
//       attributes: { exclude: ["password"] }, // Exclude the password
//     });

//     if (!updatedUser) {
//       // If the user was not found after update, send a 404 response
//       return sendResponse(
//         res,
//         404,
//         false,
//         "User not found",
//         null,

//         errors
//       );
//     }

//     // Send the updated user object
//     return sendResponse(
//       res,
//       200,
//       true,
//       "User updated successfully",
//       updatedUser,

//       errors
//     );
//   } catch (error) {
//     console.error("Error in updateUser function:", error.message); // Log the error message
//     return sendResponse(res, 500, false, error.message);
//   }
// };

// Delete a user

const updateUser = async (req, res) => {
  try {
    const { user_id, name, email, username, mobile_no, role_id, address } =
      req.body;

    console.log(req.body); // Log the request body

    // Check if the email, username, or mobile number already exists in the database and belongs to a different user
    const existingUser = await db.User.findOne({
      where: {
        [Op.or]: [{ email }, { username }, { mobile_no }],
        user_id: { [Op.ne]: user_id }, // Exclude the current user from the check
      },
    });

    if (existingUser) {
      const errors = {};
      if (existingUser.email === email) {
        errors.email = "User with the same email already exists";
      }
      if (existingUser.username === username) {
        errors.username = "User with the same username already exists";
      }
      if (existingUser.mobile_no === mobile_no) {
        errors.mobile_no = "User with the same mobile number already exists";
      }
      return sendResponse(res, 400, false, "Validation Error", null, errors);
    }

    // Perform the update
    const [rowsUpdated] = await db.User.update(
      { name, email, username, mobile_no, role_id, address },
      { where: { user_id } }
    );

    console.log(`Rows updated: ${rowsUpdated}`); // Log the result of the update

    if (rowsUpdated === 0) {
      // Initialize the errors object
      const errors = { user: "User not found" };
      return sendResponse(res, 404, false, "User not found", null, errors);
    }

    // Fetch the updated user
    const updatedUser = await db.User.findOne({
      where: { user_id },
      attributes: { exclude: ["password"] }, // Exclude the password
    });

    if (!updatedUser) {
      // Initialize the errors object
      const errors = { user: "User not found after update" };
      return sendResponse(res, 404, false, "User not found", null, errors);
    }

    // Send the updated user object
    return sendResponse(
      res,
      200,
      true,
      "User updated successfully",
      updatedUser
    );
  } catch (error) {
    console.error("Error in updateUser function:", error.message); // Log the error message
    return sendResponse(res, 500, false, error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { user_id } = req.body;

    // Fetch the user, including those marked as deleted (paranoid: false)
    const user = await db.User.findOne({ where: { user_id }, paranoid: false });
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    // Log the current state of the user
    console.log(`Current state of user ${user_id}:`, user.toJSON());

    if (user.deleted_at) {
      // Restore the user
      await user.restore(); // Restore the record
      user.status = true; // Update status after restoring
      await user.save(); // Save the changes
      console.log(`Restored user with ID ${user_id}`);
      return sendResponse(res, 200, true, "User restored successfully");
    } else {
      // Soft delete the user
      user.status = false; // Update status before deleting
      await user.save(); // Save the status change
      await user.destroy(); // Soft delete the record
      console.log(`Soft deleted user with ID ${user_id}`);
      return sendResponse(res, 200, true, "User soft deleted successfully");
    }
  } catch (error) {
    console.error("Error in deleteUser function:", error.message);
    return sendResponse(res, 500, false, error.message);
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

    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    return sendResponse(res, 200, true, "User retrieved successfully", user);
  } catch (error) {
    console.error("Error in viewUser function:", error.message);
    return sendResponse(res, 500, false, error.message);
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await db.User.findAll({
      attributes: { exclude: ["password"] },
    });

    return sendResponse(res, 200, true, "Users retrieved successfully", users);
  } catch (error) {
    console.error("Error in getUsers function:", error.message);
    return sendResponse(res, 500, false, error.message);
  }
};

// Paginate users
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
    const responseData = {
      data: users.rows,
      totalPages: Math.ceil(users.count / limit),
      currentPage: parseInt(page, 10),
      totalItems: users.count,
    };

    return sendResponse(
      res,
      200,
      true,
      "Users retrieved successfully",
      responseData
    );
  } catch (error) {
    console.error("Error in paginateUsers function:", error.message);
    return sendResponse(res, 500, false, error.message);
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
