const { Device, Client, DeviceType } = require("../models");
const responseService = require("../services/responseService"); // Assuming you have a response service for handling responses
const { Op } = require("sequelize");

// Controller to add a new Device
const addDevice = async (req, res) => {
  try {
    const { client_id, device_type_id, serial_no, mobile_no, port_no, status } =
      req.body;

    // Check if the serial number, mobile number, or port number already exists
    const existingDevice = await Device.findOne({
      where: {
        [Op.or]: [{ serial_no }, { mobile_no }, { port_no }],
      },
    });

    if (existingDevice) {
      const errors = {};
      if (existingDevice.serial_no === serial_no) {
        errors.serial_no = "Device with the same serial number already exists";
      }
      if (existingDevice.mobile_no === mobile_no) {
        errors.mobile_no = "Device with the same mobile number already exists";
      }
      if (existingDevice.port_no === port_no) {
        errors.port_no = "Device with the same port number already exists";
      }
      return responseService.error(req, res, "Validation Error", errors, 400);
    }

    // Create new Device
    const newDevice = await Device.create({
      client_id,
      device_type_id,
      serial_no,
      mobile_no,
      port_no,
      status,
    });

    return responseService.success(
      req,
      res,
      "Device created successfully",
      newDevice,
      201
    );
  } catch (error) {
    console.error("Error in addDevice function:", error.message);
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};

// Controller to update an existing Device
const updateDevice = async (req, res) => {
  try {
    const {
      device_id,
      client_id,
      device_type_id,
      serial_no,
      mobile_no,
      port_no,
      status,
    } = req.body;

    // Check if the Device exists
    const device = await Device.findByPk(device_id);
    if (!device) {
      return responseService.error(req, res, "Device not found", {}, 404);
    }

    // Update the Device
    device.client_id = client_id || device.client_id;
    device.device_type_id = device_type_id || device.device_type_id;
    device.serial_no = serial_no || device.serial_no;
    device.mobile_no = mobile_no || device.mobile_no;
    device.port_no = port_no || device.port_no;
    device.status = status !== undefined ? status : device.status;
    await device.save();

    return responseService.success(
      req,
      res,
      "Device updated successfully",
      device,
      200
    );
  } catch (error) {
    console.error("Error in updateDevice function:", error.message);
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};

// Controller to delete a Device (soft delete)
const deleteDevice = async (req, res) => {
  try {
    const { device_id } = req.body;

    // Fetch the device, including those marked as deleted (paranoid: false)
    const device = await Device.findByPk(device_id, { paranoid: false });
    if (!device) {
      return responseService.error(req, res, "Device not found", {}, 404);
    }

    // Log the current state of the device
    console.log(`Current state of device ${device_id}:`, device.toJSON());

    if (device.deleted_at) {
      // Restore the device
      await device.restore(); // Restore the record
      device.status = true; // Update status after restoring
      await device.save(); // Save the changes
      console.log(`Restored device with ID ${device_id}`);
      return responseService.success(req, res, "Device restored successfully");
    } else {
      // Soft delete the device
      device.status = false; // Update status before deleting
      await device.save(); // Save the status change
      await device.destroy(); // Soft delete the record
      console.log(`Soft deleted device with ID ${device_id}`);
      return responseService.success(
        req,
        res,
        "Device soft deleted successfully"
      );
    }
  } catch (error) {
    console.error("Error in deleteDevice function:", error.message);
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};

// Controller to view a specific Device by ID
const viewDevice = async (req, res) => {
  try {
    const { device_id } = req.body;

    // Fetch the Device with associated Client and DeviceType data
    const device = await Device.findByPk(device_id, {
      include: [
        { model: Client, as: "client" },
        { model: DeviceType, as: "deviceType" },
      ],
    });

    if (!device) {
      return responseService.error(req, res, "Device not found", {}, 404);
    }

    return responseService.success(
      req,
      res,
      "Device fetched successfully",
      device,
      200
    );
  } catch (error) {
    console.error("Error in viewDevice function:", error.message);
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};

// Controller to get all Devices
const getDevices = async (req, res) => {
  try {
    // Fetch all Devices with associated Client and DeviceType data
    const devices = await Device.findAll({
      include: [
        { model: Client, as: "client" },
        { model: DeviceType, as: "deviceType" },
      ],
    });

    return responseService.success(
      req,
      res,
      "Devices fetched successfully",
      devices,
      200
    );
  } catch (error) {
    console.error("Error in getDevices function:", error.message);
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};

// Controller to paginate Devices
const paginateDevices = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "created_at",
      order = "asc",
      search = "",
      status,
      client_id, // Adding client_id from query parameters
    } = req.query;

    const offset = (page - 1) * limit;

    // Build the sort object
    let sort = [[sortBy, order.toUpperCase()]];

    // Handle sorting by related models like client_name
    if (sortBy === "client") {
      sort = [
        [{ model: Client, as: "client" }, "client_name", order.toUpperCase()],
      ];
    }

    // Implement search, status filter, and client_id filter
    const where = {
      ...(search && {
        [Op.or]: [
          { serial_no: { [Op.like]: `%${search}%` } },
          { mobile_no: { [Op.like]: `%${search}%` } },
          { port_no: { [Op.like]: `%${search}%` } },
          { "$client.client_name$": { [Op.like]: `%${search}%` } },
          { "$deviceType.device_type$": { [Op.like]: `%${search}%` } }, // Search by device_type
        ],
      }),
      ...(status && { status: status === "active" ? true : false }),
      ...(client_id && { client_id }), // Adding client_id filter
    };

    // Fetch paginated devices with related models
    const devices = await Device.findAndCountAll({
      where,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: sort,
      include: [
        {
          model: Client,
          as: "client",
          attributes: ["client_id", "client_name"], // Including client details for search and sorting
        },
        {
          model: DeviceType,
          as: "deviceType", // Make sure deviceType is properly included for searching
          attributes: ["device_type_id", "device_type"], // Include device_type field for search
        },
      ],
      paranoid: false, // Include soft-deleted entries if needed
    });

    const responseData = {
      data: devices.rows,
      totalPages: Math.ceil(devices.count / limit),
      currentPage: parseInt(page, 10),
      totalItems: devices.count,
    };

    // Return success response with paginated data
    return responseService.success(
      req,
      res,
      "Devices fetched successfully",
      responseData
    );
  } catch (error) {
    console.error("Error in paginateDevices function:", error.message);
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};

module.exports = {
  addDevice,
  updateDevice,
  deleteDevice,
  viewDevice,
  getDevices,
  paginateDevices,
};
