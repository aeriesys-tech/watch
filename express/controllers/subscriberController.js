const { sequelize, User, ClientUser, Role, DeviceUser, Device, DeviceType } = require('../models')
const { Sequelize, Op } = require("sequelize");
const bcrypt = require("bcrypt")
const responseService = require("../services/responseService");


const addSubscriber = async (req, res, next) => {
  try {
    const { name, email, username, password, mobile_no, address, role_id, status, client_id } = req.body;
    console.log("Received request body:", req.body);

    const existingSubscriber = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }, { mobile_no }],
      },
    });

    if (existingSubscriber) {
      const errors = {};
      if (existingSubscriber.email === email) {
        errors.email = "Subscriber with the same email already exists";
      }
      if (existingSubscriber.username === username) {
        errors.username = "Subscriber with the same username already exists";
      }
      if (existingSubscriber.mobile_no === mobile_no) {
        errors.mobile_no = "Subscriber with the same mobile number already exists";
      }
      console.log("Validation errors found:", errors);
      return responseService.error(req, res, "Validation Error", errors, 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    const transaction = await sequelize.transaction();
    try {
      const newSubscriber = await User.create({ name, email, username, password: hashedPassword, mobile_no, address, role_id, status }
        , { transaction }
      );
      console.log("User created successfully:", newSubscriber);

      await ClientUser.create(
        {
          user_id: newSubscriber.user_id,
          client_id,
        },
        { transaction }
      );
      console.log("ClientUser mapping created successfully");
      await transaction.commit();
      return responseService.success(req, res, "Subscriber created successfully", newSubscriber, 201);

    } catch (error) {
      await transaction.rollback();
      console.error("Error during transaction:", error.message);

      // Improved error handling to include actual error message
      return responseService.error(req, res, "Failed to create subscriber", { error: error.message }, 500);
    }
  } catch (error) {
    console.error("Error in addSubscriber function:", error.message);
    // Improved error handling to include actual error message
    return responseService.error(req, res, "Internal server error", { error: error.message }, 500);
  }
}


const updateSubscriber = async (req, res, next) => {
  try {
    const { user_id, name, email, username, mobile_no, role_id, address, status, client_id } = req.body;
    console.log("Received request body:", req.body);

    // Check if the user exists in the database
    const subscriber = await User.findByPk(user_id);
    if (!subscriber) {
      return responseService.error(req, res, "User not found", null, 404);
    }

    // Check if email, username, or mobile_no already exists for another user
    const existingSubscriber = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }, { mobile_no }],
        user_id: { [Op.ne]: user_id }, // Exclude the current user from the search
      },
    });

    if (existingSubscriber) {
      const errors = {};
      if (existingSubscriber.email === email) {
        errors.email = "Subscriber with the same email already exists";
      }
      if (existingSubscriber.username === username) {
        errors.username = "Subscriber with the same username already exists";
      }
      if (existingSubscriber.mobile_no === mobile_no) {
        errors.mobile_no = "Subscriber with the same mobile number already exists";
      }

      console.log("Validation errors found:", errors);
      return responseService.error(req, res, "Validation Error", errors, 400);
    }

    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
      // Update the user details within the transaction
      await User.update({ name, email, username, mobile_no, role_id, address, status, client_id },
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
        }
        // else {
        //   // Create a new ClientUser mapping
        //   await ClientUser.create(
        //     {
        //       user_id,
        //       client_id,
        //     },
        //     { transaction }
        //   );
        //   console.log("ClientUser mapping created successfully");
        // }
      }

      // Commit the transaction if successful
      await transaction.commit();

      // retrieve the user
      // const updatedSubscriber = await User.findByPk(user_id, {
      //     attributes: { exclude: ["password", "created_at", "updated_at", "deleted_at"] }, // Customize the attributes as needed
      //     include: [{ 
      //         model: ClientUser, 
      //         as: 'clientUser', 
      //         attributes: ['client_id'] 
      //       }],
      //   });

      // // Include client_id in the response if the ClientUser mapping exists
      // const userWithClientId = updatedSubscriber ? {
      //     ...updatedSubscriber.toJSON(),
      //     client_id: updatedSubscriber.clientUser ? updatedSubscriber.clientUser.client_id : null
      // } : null;

      return responseService.success(req, res, "Subscriber updated successfully", null, 200);
    } catch (error) {
      console.log("Error during transaction:----", error);
      // Rollback the transaction in case of error
      await transaction.rollback();
      console.log("Error during transaction:----1", error.message);
      return responseService.error(req, res, "Failed to update user", { error: error.message }, 500);
    }
  } catch (error) {
    console.log("Error in updateUser function:----2", error.message);
    return responseService.error(req, res, "Internal server error", { error: error.message }, 500);
  }
}


const paginateSubscribers = async (req, res, next) => {
  try {
    const { client_id = "", page = 1, limit = 10, sortBy = "created_at", order = "asc", search = "", status } = req.query;

    const offset = (page - 1) * limit;

    // Build the sort object dynamically
    // const sort = [[sortBy, order.toUpperCase()]];
    // const sort = [[{ model: User, as: 'user' }, sortBy, order.toUpperCase()]];

    if (sortBy === 'role') {
      // If sorting by role or group, apply sorting to the Role model
      sort = [[{ model: User, as: 'user' }, { model: Role }, sortBy, order.toUpperCase()]];
    } else {
      // Otherwise, apply sorting to the User model
      sort = [[{ model: User, as: 'user' }, sortBy, order.toUpperCase()]];
    }

    // Implement search and status filter
    const where = {
      //   ...(search && {
      //     [Op.or]: [
      //       { name: { [Op.like]: `%${search}%` } },
      //       { email: { [Op.like]: `%${search}%` } },
      //       { username: { [Op.like]: `%${search}%` } },
      //       { mobile_no: { [Op.like]: `%${search}%` } },
      //     ],
      //   }),
      //   ...(status && { status: status === "active" ? true : false }),
      client_id,
    };

    const userWhere = {
      ...(search && {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { username: { [Op.like]: `%${search}%` } },
          { mobile_no: { [Op.like]: `%${search}%` } },
        ],
      }),
    };
    const subscribers = await ClientUser.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'user',
        where: userWhere,
        paranoid: false,
        attributes: ['user_id', 'name', 'email', 'username', 'mobile_no', 'status'],
        include: [
          {
            model: Role,
            attributes: ['role_id', 'role', 'group'], // Include role_id and group from Role table
          },
        ],
      }],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: sort,
      attributes: { exclude: ["password"] },
      paranoid: true,
    });

    const responseData = {
      data: subscribers.rows.map(clientUser => clientUser.user),
      totalPages: Math.ceil(subscribers.count / limit),
      currentPage: parseInt(page, 10),
      totalItems: subscribers.count,
    };

    return responseService.success(req, res, "Users retrieved successfully", responseData);

  } catch (error) {
    console.error("Error in paginateUsers function:", error.message);
    return responseService.error(req, res, "Internal server error", null, 500);
  }
}


const deleteSubscriber = async (req, res, next) => {
  try {
    const { user_id } = req.body;

    // Fetch the user, including those marked as deleted (paranoid: false)
    const subscriber = await User.findByPk(user_id, { paranoid: false });
    if (!subscriber) {
      return responseService.error(req, res, "User not found", {}, 404);
    }

    // Log the current state of the user
    console.log(`Current state of user ${user_id}:`, subscriber.toJSON());

    if (subscriber.deleted_at) {
      // Restore the user
      await subscriber.restore(); // Restore the record
      subscriber.status = true; // Update status after restoring
      await subscriber.save(); // Save the changes
      console.log(`Restored user with ID ${user_id}`);
      return responseService.success(req, res, "User restored successfully");
    }
    else {
      // Soft delete the user
      subscriber.status = false; // Update status before deleting
      await subscriber.save(); // Save the status change
      await subscriber.destroy(); // Soft delete the record
      console.log(`Soft deleted user with ID ${user_id}`);
      return responseService.success(req, res, "User soft deleted successfully");
    }
  } catch (error) {
    console.error("Error in deleteUser function:", error.message);
    return responseService.error(req, res, "Internal server error", null, 500);
  }
}


const getSubscriber = async (req, res, next) => {
  try {
    const { subscriber_id, client_id } = req.body;

    // Fetch the basic subscriber information
    const subscriber = await User.findOne({
      attributes: { exclude: ["password"] },
      where: { user_id: subscriber_id },
      paranoid: true,
      include: [
        {
          model: ClientUser,
          as: 'clientUsers',
          attributes: ['client_id'],
          where: {
            client_id: client_id,
            user_id: subscriber_id
          },


        }
      ]
    });

    if (!subscriber) {

      return responseService.error(req, res, "User not found", {}, 404);
    }

    // Fetch the latest DeviceUser with associated Device and DeviceType
    const latestDeviceUser = await DeviceUser.findOne({
      attributes: ['device_user_id', 'device_id', 'from_date_time', 'to_date_time', 'status'],
      where: {
        user_id: subscriber_id,
        client_id: client_id
      },
      order: [['device_user_id', 'DESC']], // Order by latest
      limit: 1, // Get the most recent entry
      include: [{
        model: Device,
        as: 'device',
        attributes: ['serial_no', 'mobile_no', 'port_no', 'status'],
        include: [{
          model: DeviceType,
          as: 'deviceType',
          attributes: ['device_type', 'status'],
        }]
      }]
    });

    // Attach the latest DeviceUser (if it exists) to the subscriber
    if (latestDeviceUser) {
      subscriber.dataValues.deviceUsers = [latestDeviceUser];
    }

    return responseService.success(req, res, "User retrieved successfully", subscriber, 200);

  } catch (error) {
    console.error("Error in viewUser function:", error.message);
    return responseService.error(req, res, "Internal server error", null, 500);
  }
}


module.exports = { addSubscriber, updateSubscriber, paginateSubscribers, deleteSubscriber, getSubscriber }