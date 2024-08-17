const { DeviceType } = require("../models");
const { Op } = require("sequelize");
const responseService = require("../services/responseService");

// Add a new device type
const addDeviceType = async (req, res) => {
    try {
        const { device_type } = req.body;

        // Check if the device type already exists in the database
        const existingDeviceType = await DeviceType.findOne({ where: { device_type } });
        if (existingDeviceType) {
            const errors = { device_type: "Device type already exists" };
            return responseService.error(req, res, "Validation Error", errors, 400);
        }

        // Create the new device type if it does not exist
        const newDeviceType = await DeviceType.create({ device_type });
        return responseService.success(req, res, "Device type created successfully", newDeviceType, 201);
    } catch (error) {
        console.error("Error in addDeviceType function:", error.message);
        return responseService.error(req, res, "Internal server error", null, 500);
    }
};

// Update a device type
const updateDeviceType = async (req, res) => {
    try {
        const { device_type_id, device_type } = req.body;

        // Check if the new device type name already exists in the database
        const existingDeviceType = await DeviceType.findOne({ where: { device_type } });
        if (existingDeviceType && existingDeviceType.device_type_id !== device_type_id) {
            const errors = { device_type: "Device type already exists" };
            return responseService.error(req, res, "Validation Error", errors, 400);
        }

        // Update the device type
        await DeviceType.update({ device_type }, { where: { device_type_id } });

        // Fetch the updated device type
        const updatedDeviceType = await DeviceType.findByPk(device_type_id);
        return responseService.success(req, res, "Device type updated successfully", updatedDeviceType);
    } catch (error) {
        console.error("Error in updateDeviceType function:", error.message);
        return responseService.error(req, res, "Internal server error", null, 500);
    }
};

// Delete or restore a device type
const deleteDeviceType = async (req, res) => {
    try {
        const { device_type_id } = req.body;

        // Fetch the device type, including those marked as deleted (paranoid: false)
        const deviceType = await DeviceType.findByPk(device_type_id, { paranoid: false });
        if (!deviceType) {
            return responseService.error(req, res, "Device type not found", {}, 404);
        }

        console.log(`Current state of device type ${device_type_id}:`, deviceType.toJSON());

        if (deviceType.deleted_at) {
            // Restore the device type
            await deviceType.restore(); // Restore the record
            deviceType.status = true; // Update status after restoring
            await deviceType.save(); // Save the changes
            console.log(`Restored device type with ID ${device_type_id}`);
            return responseService.success(req, res, "Device type restored successfully");
        } else {
            // Soft delete the device type
            deviceType.status = false; // Update status before deleting
            await deviceType.save(); // Save the status change
            await deviceType.destroy(); // Soft delete the record
            console.log(`Soft deleted device type with ID ${device_type_id}`);
            return responseService.success(req, res, "Device type soft deleted successfully");
        }
    } catch (error) {
        console.error("Error in deleteDeviceType function:", error.message);
        return responseService.error(req, res, "Internal server error", null, 500);
    }
};

// View a device type
const viewDeviceType = async (req, res) => {
    try {
        const { device_type_id } = req.body;
        const deviceType = await DeviceType.findByPk(device_type_id);
        if (!deviceType) {
            return responseService.error(req, res, "Device type not found", {}, 404);
        }

        return responseService.success(req, res, "Device type retrieved successfully", deviceType);
    } catch (error) {
        console.error("Error in viewDeviceType function:", error.message);
        return responseService.error(req, res, "Internal server error", null, 500);
    }
};

// Get all device types
const getDeviceTypes = async (req, res) => {
    try {
        const deviceTypes = await DeviceType.findAll({ paranoid: false });
        return responseService.success(req, res, "Device types retrieved successfully", deviceTypes);
    } catch (error) {
        console.error("Error in getDeviceTypes function:", error.message);
        return responseService.error(req, res, "Internal server error", null, 500);
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
                [Op.or]: [{ device_type: { [Op.like]: `%${search}%` } }],
            }),
            ...(status && { status: status === "active" ? true : false }),
        };

        const deviceTypes = await DeviceType.findAndCountAll({
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

        return responseService.success(req, res, "Device types fetched successfully", responseData);
    } catch (error) {
        console.error("Error in paginateDeviceTypes function:", error.message);
        return responseService.error(req, res, "Internal server error", null, 500);
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
