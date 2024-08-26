const { DeviceUser, Client, Device, User } = require("../models");
const { Op } = require("sequelize");
const responseService = require("../services/responseService");

// Add a new device user
const addDeviceUser = async (req, res) => {
  try {
    const {
      client_id,
      device_id,
      user_id,
      from_date_time,
      to_date_time,
      status,
    } = req.body;

    // Object to collect validation errors
    const errors = {};

    // Check if the client, device, and user exist
    const client = await Client.findByPk(client_id);
    if (!client) {
      errors.client_id = "Client not found";
    }

    const device = await Device.findByPk(device_id);
    if (!device) {
      errors.device_id = "Device not found";
    }

    const user = await User.findByPk(user_id);
    if (!user) {
      errors.user_id = "User not found";
    }

    // Check if the combination of device_id and user_id already exists
    const existingDeviceUser = await DeviceUser.findOne({
      where: { device_id, user_id },
    });

    if (existingDeviceUser) {
      errors.device_user = "Device user combination already exists";
    }

    // If there are any errors, return them
    if (Object.keys(errors).length > 0) {
      return responseService.error(req, res, "Validation Error", errors, 400);
    }

    // Create the new device user entry
    const newDeviceUser = await DeviceUser.create({
      client_id,
      device_id,
      user_id,
      from_date_time,
      to_date_time,
      status,
    });

    return responseService.success(
      req,
      res,
      "Device User created successfully",
      newDeviceUser,
      201
    );
  } catch (error) {
    console.error("Error in addDeviceUser function:", error.message);
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};

// Update an existing device user
const updateDeviceUser = async (req, res) => {
  try {
    const {
      device_user_id,
      client_id,
      device_id,
      user_id,
      from_date_time,
      to_date_time,
      status,
    } = req.body;

    // Object to collect validation errors
    const errors = {};

    // Check if the client, device, and user exist
    const client = await Client.findByPk(client_id);
    if (!client) {
      errors.client_id = "Client not found";
    }

    const device = await Device.findByPk(device_id);
    if (!device) {
      errors.device_id = "Device not found";
    }

    const user = await User.findByPk(user_id);
    if (!user) {
      errors.user_id = "User not found";
    }

    // Check if the combination of device_id and user_id already exists
    const existingDeviceUser = await DeviceUser.findOne({
      where: { device_id, user_id },
    });
    if (
      existingDeviceUser &&
      existingDeviceUser.device_user_id !== device_user_id
    ) {
      errors.device_user = "Device user combination already exists";
    }

    // If there are any errors, return them
    if (Object.keys(errors).length > 0) {
      return responseService.error(req, res, "Validation Error", errors, 400);
    }

    // Update the device user entry
    await DeviceUser.update(
      {
        client_id,
        device_id,
        user_id,
        from_date_time,
        to_date_time,
        status,
      },
      { where: { device_user_id } }
    );

    // Fetch the updated device user entry
    const updatedDeviceUser = await DeviceUser.findByPk(device_user_id);
    return responseService.success(
      req,
      res,
      "Device User updated successfully",
      updatedDeviceUser
    );
  } catch (error) {
    console.error("Error in updateDeviceUser function:", error.message);
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};

// Delete or restore a device user
const deleteDeviceUser = async (req, res) => {
  try {
    const { device_user_id } = req.body;

    // Find the device user
    const deviceUser = await DeviceUser.findByPk(device_user_id);

    // Check if the device user exists
    if (!deviceUser) {
      return responseService.error(req, res, "Device User not found", {}, 404);
    }

    // Toggle the status between active (1) and inactive (0)
    if (deviceUser.status === true) {
      // Soft delete (deactivate) the user by setting status to 0 (false)
      deviceUser.status = false;
      await deviceUser.save(); // Save the status change
      return responseService.success(
        req,
        res,
        "Device User deactivated successfully",
        {}
      );
    } else {
      // Restore the user by setting status to 1 (true)
      deviceUser.status = true;
      await deviceUser.save(); // Save the status change
      return responseService.success(
        req,
        res,
        "Device User restored successfully",
        {}
      );
    }
  } catch (error) {
    console.error("Error in deleteDeviceUser function:", error.message);
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};

// View a device user
const viewDeviceUser = async (req, res) => {
  try {
    const { device_user_id } = req.body;

    // Find the device user along with associated client, device, and user models
    const deviceUser = await DeviceUser.findByPk(device_user_id, {
      include: [
        {
          model: Client,
          as: "client", // Ensure the correct alias if necessary
          attributes: ["client_id", "client_name"], // Select relevant fields
        },
        {
          model: Device,
          as: "device", // Ensure the correct alias if necessary
          attributes: ["device_id", "serial_no"], // Select relevant fields
        },
        {
          model: User,
          as: "user", // Ensure the correct alias if necessary
          attributes: ["user_id", "username"], // Select relevant fields
        },
      ],
    });

    // Check if the device user exists
    if (!deviceUser) {
      return responseService.error(req, res, "Device User not found", {}, 404);
    }

    // Return success response with the device user data
    return responseService.success(
      req,
      res,
      "Device User retrieved successfully",
      deviceUser
    );
  } catch (error) {
    console.error("Error in viewDeviceUser function:", error.message);
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};

// Get all device users
const getDeviceUsers = async (req, res) => {
  try {
    // Fetch all device users along with associated client, device, and user models
    const deviceUsers = await DeviceUser.findAll({
      include: [
        {
          model: Client,
          as: "client", // Ensure correct alias
          attributes: ["client_id", "client_name"], // Fetch relevant fields
        },
        {
          model: Device,
          as: "device", // Ensure correct alias
          attributes: ["device_id", "serial_no"], // Fetch relevant fields
        },
        {
          model: User,
          as: "user", // Ensure correct alias
          attributes: ["user_id", "username"], // Fetch relevant fields
        },
      ],
      paranoid: false, // Include soft-deleted entries if needed
    });
    // Check if any device users exist
    if (!deviceUsers || deviceUsers.length === 0) {
      return responseService.error(req, res, "No Device Users found", {}, 404);
    }
    // Return success response with all device users
    return responseService.success(
      req,
      res,
      "Device Users retrieved successfully",
      deviceUsers
    );
  } catch (error) {
    console.error("Error in getDeviceUsers function:", error.message);
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};

// Paginate device users
const paginateDeviceUsers = async (req, res) => {
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

    // Build the where clause dynamically based on search and status
    const where = {
      ...(search && {
        [Op.or]: [
          { client_id: { [Op.like]: `%${search}%` } },
          { device_id: { [Op.like]: `%${search}%` } },
          { user_id: { [Op.like]: `%${search}%` } },
        ],
      }),
      ...(status && { status: status === "active" ? true : false }),
    };

    // Fetch paginated device users with related models
    const deviceUsers = await DeviceUser.findAndCountAll({
      where,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: sort,
      include: [
        {
          model: Client,
          as: "client",
          attributes: ["client_id", "client_name"],
        },
        {
          model: Device,
          as: "device",
          attributes: ["device_id", "serial_no"],
        },
        {
          model: User,
          as: "user",
          attributes: ["user_id", "username"],
        },
      ],
      paranoid: false, // Include soft-deleted entries if needed
    });

    const responseData = {
      data: deviceUsers.rows,
      totalPages: Math.ceil(deviceUsers.count / limit),
      currentPage: parseInt(page, 10),
      totalItems: deviceUsers.count,
    };

    // Check if there are any records
    if (!deviceUsers.rows.length) {
      return responseService.error(req, res, "No Device Users found", {}, 404);
    }

    // Return success response with paginated data
    return responseService.success(
      req,
      res,
      "Device Users fetched successfully",
      responseData
    );
  } catch (error) {
    console.error("Error in paginateDeviceUsers function:", error.message);
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};

module.exports = {
  addDeviceUser,
  updateDeviceUser,
  deleteDeviceUser,
  viewDeviceUser,
  getDeviceUsers,
  paginateDeviceUsers,
};
