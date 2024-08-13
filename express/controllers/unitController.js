const db = require("../models");
const { Op } = require("sequelize");
const { sendResponse } = require("../services/responseService");

// Add a new unit
const addUnit = async (req, res) => {
    try {
        const { unit } = req.body;

        // Check if the unit already exists in the database
        const existingUnit = await db.Unit.findOne({ where: { unit } });
        if (existingUnit) {
            return sendResponse(res, 400, false, "Unit already exists", null, {
                unit: "Unit already exists",
            });
        }

        // Create the new unit if it does not exist
        const newUnit = await db.Unit.create({ unit });
        sendResponse(res, 200, true, "Unit created successfully", newUnit);
    } catch (error) {
        sendResponse(res, 500, false, error.message);
    }
};

// Update a unit
const updateUnit = async (req, res) => {
    try {
        const { unit_id, unit } = req.body;

        // Check if the new unit name already exists in the database
        const existingUnit = await db.Unit.findOne({ where: { unit } });
        if (existingUnit && existingUnit.unit_id !== unit_id) {
            return sendResponse(res, 400, false, "Unit already exists", null, {
                unit: "Unit already exists",
            });
        }

        // Update the unit
        await db.Unit.update({ unit }, { where: { unit_id } });

        // Fetch the updated unit
        const updatedUnit = await db.Unit.findOne({ where: { unit_id } });

        sendResponse(res, 200, true, "Unit updated successfully", updatedUnit);
    } catch (error) {
        sendResponse(res, 500, false, error.message);
    }
};

// Delete a unit
const deleteUnit = async (req, res) => {
    try {
        const { unit_id } = req.body;

        // Fetch the unit, including those marked as deleted (paranoid: false)
        const unit = await db.Unit.findOne({ where: { unit_id }, paranoid: false });
        if (!unit) {
            return sendResponse(res, 404, false, "Unit not found");
        }

        if (unit.deleted_at) {
            // Restore the unit
            await unit.restore(); // Restore the record
            unit.status = true; // Update status after restoring
            await unit.save(); // Save the changes
            return sendResponse(res, 200, true, "Unit restored successfully");
        } else {
            // Soft delete the unit
            unit.status = false; // Update status before deleting
            await unit.save(); // Save the status change
            await unit.destroy(); // Soft delete the record
            return sendResponse(res, 200, true, "Unit soft deleted successfully");
        }
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
};

// View a unit
const viewUnit = async (req, res) => {
    try {
        const { unit_id } = req.body;
        const unit = await db.Unit.findOne({ where: { unit_id } });
        res.json(unit);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all units
const getUnits = async (req, res) => {
    try {
        const units = await db.Unit.findAll({ paranoid: false });
        return sendResponse(res, 200, true, "Units retrieved successfully", units);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
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

        const units = await db.Unit.findAndCountAll({
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

        sendResponse(res, 200, true, "Units fetched successfully", responseData);
    } catch (error) {
        sendResponse(res, 500, false, error.message);
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
