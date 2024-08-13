const db = require("../models");
const { Op } = require("sequelize");
const { sendResponse } = require("../services/responseService");

// Add a new device type
const addDeviceType = async (req, res) => {
    try {
        const { device_type } = req.body;

        // Check if the device type already exists in the database
        const existingDeviceType = await db.DeviceType.findOne({ where: { device_type } });
        if (existingDeviceType) {
            return sendResponse(res, 400, false, "Device type already exists", null, {
                device_type: "Device type already exists",
            });
        }

        // Create the new device type if it does not exist
        const newDeviceType = await db.DeviceType.create({ device_type });
        sendResponse(res, 200, true, "Device type created successfully", newDeviceType);
    } catch (error) {
        sendResponse(res, 500, false, error.message);
    }
};

// Update a device type
const updateDeviceType = async (req, res) => {
    try {
        const { device_type_id, device_type } = req.body;

        // Check if the new device type name already exists in the database
        const existingDeviceType = await db.DeviceType.findOne({ where: { device_type } });
        if (existingDeviceType && existingDeviceType.device_type_id !== device_type_id) {
            return sendResponse(res, 400, false, "Device type already exists", null, {
                device_type: "Device type already exists",
            });
        }

        // Update the device type
        await db.DeviceType.update({ device_type }, { where: { device_type_id } });

        // Fetch the updated device type
        const updatedDeviceType = await db.DeviceType.findOne({ where: { device_type_id } });

        sendResponse(res, 200, true, "Device type updated successfully", updatedDeviceType);
    } catch (error) {
        sendResponse(res, 500, false, error.message);
    }
};

// Delete a device type
const deleteDeviceType = async (req, res) => {
    try {
        const { device_type_id } = req.body;

        // Fetch the device type, including those marked as deleted (paranoid: false)
        const deviceType = await db.DeviceType.findOne({ where: { device_type_id }, paranoid: false });
        if (!deviceType) {
            return sendResponse(res, 404, false, "Device type not found");
        }

        // Log the current state of the device type
        console.log(`Current state of device type ${device_type_id}:`, deviceType.toJSON());

        if (deviceType.deleted_at) {
            // Restore the device type
            await deviceType.restore(); // Restore the record
            deviceType.status = true; // Update status after restoring
            await deviceType.save(); // Save the changes
            console.log(`Restored device type with ID ${device_type_id}`);
            return sendResponse(res, 200, true, "Device type restored successfully");
        } else {
            // Soft delete the device type
            deviceType.status = false; // Update status before deleting
            await deviceType.save(); // Save the status change
            await deviceType.destroy(); // Soft delete the record
            console.log(`Soft deleted device type with ID ${device_type_id}`);
            return sendResponse(res, 200, true, "Device type soft deleted successfully");
        }
    } catch (error) {
        console.error("Error in deleteDeviceType function:", error);
        return sendResponse(res, 500, false, error.message);
    }
};

// View a device type
const viewDeviceType = async (req, res) => {
    try {
        const { device_type_id } = req.body;
        const deviceType = await db.DeviceType.findOne({ where: { device_type_id } });
        res.json(deviceType);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all device types
const getDeviceTypes = async (req, res) => {
    try {
        const deviceTypes = await db.DeviceType.findAll({ paranoid: false });
        return sendResponse(res, 200, true, "Device types retrieved successfully", deviceTypes);
    } catch (error) {
        console.error("Error in getDeviceTypes function:", error);
        return sendResponse(res, 500, false, error.message);
    }
};

// Paginate device types
const paginateDeviceTypes = async (req, res) => {
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
                    { device_type: { [Op.like]: `%${search}%` } },
                    // Add any other fields you want to search by
                ],
            }),
            ...(status && { status: status === "active" ? true : false }),
        };

        const deviceTypes = await db.DeviceType.findAndCountAll({
            where,
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10),
            order: sort,
            paranoid: false,
        });

        const responseData = {
            data: deviceTypes.rows,
            totalPages: Math.ceil(deviceTypes.count / limit),
            currentPage: parseInt(page, 10),
            totalItems: deviceTypes.count,
        };

        sendResponse(res, 200, true, "Device types fetched successfully", responseData);
    } catch (error) {
        sendResponse(res, 500, false, error.message);
    }
};

module.exports = {
    addDeviceType,
    updateDeviceType,
    deleteDeviceType,
    viewDeviceType,
    getDeviceTypes,
    paginateDeviceTypes,
};
