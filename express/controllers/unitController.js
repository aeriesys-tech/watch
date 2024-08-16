const { Unit } = require("../models");
const { Op } = require("sequelize");
const responseService = require("../services/responseService");

// Add a new unit
const addUnit = async (req, res) => {
    try {
        const { unit } = req.body;

        // Check if the unit already exists in the database
        const existingUnit = await Unit.findOne({ where: { unit } });
        if (existingUnit) {
            const errors = { unit: "Unit already exists" };
            return responseService.error(req, res, "Validation Error", errors, 400);
        }

        // Create the new unit if it does not exist
        const newUnit = await Unit.create({ unit });
        return responseService.success(req, res, "Unit created successfully", newUnit, 201);
    } catch (error) {
        console.error("Error in addUnit function:", error.message);
        return responseService.error(req, res, "Internal Server Error", {}, 500);
    }
};

// Update a unit
const updateUnit = async (req, res) => {
    try {
        const { unit_id, unit } = req.body;

        // Check if the new unit name already exists in the database
        const existingUnit = await Unit.findOne({ where: { unit } });
        if (existingUnit && existingUnit.unit_id !== unit_id) {
            const errors = { unit: "Unit already exists" };
            return responseService.error(req, res, "Validation Error", errors, 400);
        }

        // Update the unit
        await Unit.update({ unit }, { where: { unit_id } });

        // Fetch the updated unit
        const updatedUnit = await Unit.findOne({ where: { unit_id } });
        return responseService.success(req, res, "Unit updated successfully", updatedUnit);
    } catch (error) {
        console.error("Error in updateUnit function:", error.message);
        return responseService.error(req, res, "Internal Server Error", {}, 500);
    }
};

// Delete or restore a unit
const deleteUnit = async (req, res) => {
    try {
        const { unit_id } = req.body;

        // Fetch the unit, including those marked as deleted (paranoid: false)
        const unit = await Unit.findOne({ where: { unit_id }, paranoid: false });
        if (!unit) {
            return responseService.error(req, res, "Unit not found", {}, 404);
        }

        if (unit.deleted_at) {
            // Restore the unit
            await unit.restore(); // Restore the record
            unit.status = true; // Update status after restoring
            await unit.save(); // Save the changes
            return responseService.success(req, res, "Unit restored successfully");
        } else {
            // Soft delete the unit
            unit.status = false; // Update status before deleting
            await unit.save(); // Save the status change
            await unit.destroy(); // Soft delete the record
            return responseService.success(req, res, "Unit soft deleted successfully");
        }
    } catch (error) {
        console.error("Error in deleteUnit function:", error.message);
        return responseService.error(req, res, "Internal Server Error", {}, 500);
    }
};

// View a unit
const viewUnit = async (req, res) => {
    try {
        const { unit_id } = req.body;
        const unit = await Unit.findOne({ where: { unit_id } });
        if (!unit) {
            return responseService.error(req, res, "Unit not found", {}, 404);
        }
        return responseService.success(req, res, "Unit retrieved successfully", unit);
    } catch (error) {
        console.error("Error in viewUnit function:", error.message);
        return responseService.error(req, res, "Internal Server Error", {}, 500);
    }
};

// Get all units
const getUnits = async (req, res) => {
    try {
        const units = await Unit.findAll({ paranoid: false });
        return responseService.success(req, res, "Units retrieved successfully", units);
    } catch (error) {
        console.error("Error in getUnits function:", error.message);
        return responseService.error(req, res, "Internal Server Error", {}, 500);
    }
};

// Paginate units
const paginateUnits = async (req, res) => {
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
                    { unit: { [Op.like]: `%${search}%` } },
                    // Add any other fields you want to search by
                ],
            }),
            ...(status && { status: status === "active" ? true : false }),
        };

        const units = await Unit.findAndCountAll({
            where,
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10),
            order: sort,
            paranoid: false,
        });

        const responseData = {
            data: units.rows,
            totalPages: Math.ceil(units.count / limit),
            currentPage: parseInt(page, 10),
            totalItems: units.count,
        };

        return responseService.success(req, res, "Units fetched successfully", responseData);
    } catch (error) {
        console.error("Error in paginateUnits function:", error.message);
        return responseService.error(req, res, "Internal Server Error", {}, 500);
    }
};

module.exports = {
    addUnit,
    updateUnit,
    deleteUnit,
    viewUnit,
    getUnits,
    paginateUnits,
};
