const { sequelize, User, ClientUser } = require("../models");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const responseService = require("../services/responseService");

// Add a new user
// const addUser = async (req, res) => {
//   try {
//     const { name, email, username, password, mobile_no, role_id, address } =
//       req.body;

//     // Check if the email, username, or mobile number already exists in the database
//     const existingUser = await User.findOne({
//       where: {
//         [Op.or]: [{ email }, { username }, { mobile_no }],
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
//       return responseService.error(req, res, "Validation Error", errors, 400);
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create the new user
//     const newUser = await User.create({
//       name,
//       email,
//       username,
//       password: hashedPassword,
//       mobile_no,
//       role_id,
//       address,
//     });

//     return responseService.success(
//       req,
//       res,
//       "User created successfully",
//       newUser,
//       201
//     );
//   } catch (error) {
//     console.error("Error in addUser function:", error.message);
//     return responseService.error(req, res, "Internal server error", null, 500);
//   }
// };
const addUser = async (req, res) => {
  try {
    const {
      name,
      email,
      username,
      password,
      mobile_no,
      role_id,
      address,
      client_id,
    } = req.body;

    console.log("Received request body:", req.body);

    const existingUser = await User.findOne({
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

      console.log("Validation errors found:", errors);
      return responseService.error(req, res, "Validation Error", errors, 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    const transaction = await sequelize.transaction();

    try {
      const newUser = await User.create(
        {
          name,
          email,
          username,
          password: hashedPassword,
          mobile_no,
          role_id,
          address,
        },
        { transaction }
      );
      console.log("User created successfully:", newUser);

      if (client_id) {
        await ClientUser.create(
          {
            user_id: newUser.user_id,
            client_id,
          },
          { transaction }
        );
        console.log("ClientUser mapping created successfully");
      }

      await transaction.commit();
      return responseService.success(
        req,
        res,
        "User created successfully",
        newUser,
        201
      );
    } catch (error) {
      await transaction.rollback();
      console.error("Error during transaction:", error.message);

      // Improved error handling to include actual error message
      return responseService.error(
        req,
        res,
        "Failed to create user and client-user mapping",
        { error: error.message }, // Send the error message for debugging
        500
      );
    }
  } catch (error) {
    console.error("Error in addUser function:", error.message);

    // Improved error handling to include actual error message
    return responseService.error(
      req,
      res,
      "Internal server error",
      {
        error: error.message, // Send the error message for debugging
      },
      500
    );
  }
};

// Update a user
// const updateUser = async (req, res) => {
//   try {
//     const { user_id, name, email, username, mobile_no, role_id, address } =
//       req.body;

//     console.log(req.body); // Log the request body

//     // Check if the email, username, or mobile number already exists in the database and belongs to a different user
//     const existingUser = await User.findOne({
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
//       return responseService.error(req, res, "Validation Error", errors, 400);
//     }

//     // Perform the update
//     const [rowsUpdated] = await User.update(
//       { name, email, username, mobile_no, role_id, address },
//       { where: { user_id } }
//     );

//     console.log(`Rows updated: ${rowsUpdated}`); // Log the result of the update

//     if (rowsUpdated === 0) {
//       const errors = { user: "User not found" };
//       return responseService.error(req, res, "User not found", errors, 404);
//     }

//     // Fetch the updated user
//     const updatedUser = await User.findByPk(user_id, {
//       attributes: { exclude: ["password"] }, // Exclude the password
//     });

//     if (!updatedUser) {
//       const errors = { user: "User not found after update" };
//       return responseService.error(req, res, "User not found", errors, 404);
//     }

//     return responseService.success(
//       req,
//       res,
//       "User updated successfully",
//       updatedUser
//     );
//   } catch (error) {
//     console.error("Error in updateUser function:", error.message);
//     return responseService.error(req, res, "Internal server error", null, 500);
//   }
// };
const updateUser = async (req, res) => {
  try {
    const {
      user_id, // user_id is now destructured from req.body
      name,
      email,
      username,
      mobile_no,
      role_id,
      address,
      client_id,
    } = req.body;

    console.log("Received request body:", req.body);

    // Check if the user exists in the database
    const user = await User.findByPk(user_id);
    if (!user) {
      return responseService.error(req, res, "User not found", null, 404);
    }

    // Check if email, username, or mobile_no already exists for another user
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }, { mobile_no }],
        user_id: { [Op.ne]: user_id }, // Exclude the current user from the search
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

      console.log("Validation errors found:", errors);
      return responseService.error(req, res, "Validation Error", errors, 400);
    }

    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
      // Update the user details within the transaction
      await User.update(
        {
          name,
          email,
          username,
          mobile_no,
          role_id,
          address,
        },
        { where: { user_id }, transaction }
      );
      console.log("User updated successfully");

      // If client_id is provided, update or create the ClientUser mapping
      if (client_id) {
        const clientUserMapping = await ClientUser.findOne({
          where: { user_id },
        });

        if (clientUserMapping) {
          // Update existing ClientUser mapping
          await ClientUser.update(
            { client_id },
            { where: { user_id }, transaction }
          );
          console.log("ClientUser mapping updated successfully");
        } else {
          // Create a new ClientUser mapping
          await ClientUser.create(
            {
              user_id,
              client_id,
            },
            { transaction }
          );
          console.log("ClientUser mapping created successfully");
        }
      }

      // Commit the transaction if successful
      await transaction.commit();
      return responseService.success(
        req,
        res,
        "User updated successfully",
        null,
        200
      );
    } catch (error) {
      // Rollback the transaction in case of error
      await transaction.rollback();
      console.error("Error during transaction:", error.message);

      return responseService.error(
        req,
        res,
        "Failed to update user and client-user mapping",
        { error: error.message },
        500
      );
    }
  } catch (error) {
    console.error("Error in updateUser function:", error.message);

    return responseService.error(
      req,
      res,
      "Internal server error",
      { error: error.message },
      500
    );
  }
};

// Delete or restore a user
const deleteUser = async (req, res) => {
  try {
    const { user_id } = req.body;

    // Fetch the user, including those marked as deleted (paranoid: false)
    const user = await User.findByPk(user_id, { paranoid: false });
    if (!user) {
      return responseService.error(req, res, "User not found", {}, 404);
    }

    // Log the current state of the user
    console.log(`Current state of user ${user_id}:`, user.toJSON());

    if (user.deleted_at) {
      // Restore the user
      await user.restore(); // Restore the record
      user.status = true; // Update status after restoring
      await user.save(); // Save the changes
      console.log(`Restored user with ID ${user_id}`);
      return responseService.success(req, res, "User restored successfully");
    } else {
      // Soft delete the user
      user.status = false; // Update status before deleting
      await user.save(); // Save the status change
      await user.destroy(); // Soft delete the record
      console.log(`Soft deleted user with ID ${user_id}`);
      return responseService.success(
        req,
        res,
        "User soft deleted successfully"
      );
    }
  } catch (error) {
    console.error("Error in deleteUser function:", error.message);
    return responseService.error(req, res, "Internal server error", null, 500);
  }
};

// View a user
const viewUser = async (req, res) => {
  try {
    const { user_id } = req.body;
    const user = await User.findByPk(user_id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return responseService.error(req, res, "User not found", {}, 404);
    }

    return responseService.success(
      req,
      res,
      "User retrieved successfully",
      user
    );
  } catch (error) {
    console.error("Error in viewUser function:", error.message);
    return responseService.error(req, res, "Internal server error", null, 500);
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });

    return responseService.success(
      req,
      res,
      "Users retrieved successfully",
      users
    );
  } catch (error) {
    console.error("Error in getUsers function:", error.message);
    return responseService.error(req, res, "Internal server error", null, 500);
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
          { mobile_no: { [Op.like]: `%${search}%` } },
        ],
      }),
      ...(status && { status: status === "active" ? true : false }),
    };

    const users = await User.findAndCountAll({
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

    return responseService.success(
      req,
      res,
      "Users retrieved successfully",
      responseData
    );
  } catch (error) {
    console.error("Error in paginateUsers function:", error.message);
    return responseService.error(req, res, "Internal server error", null, 500);
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
