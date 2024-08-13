const db = require("../models");
const { Op } = require("sequelize");
const { sendResponse } = require("../services/responseService");

// Add a new role
const addRole = async (req, res) => {
  try {
    const { role } = req.body;

    // Check if the role already exists in the database
    const existingRole = await db.Role.findOne({ where: { role } });
    if (existingRole) {
      return sendResponse(res, 400, false, "Role already exists", null, {
        role: "Role already exists",
      });
    }

    // Create the new role if it does not exist
    const newRole = await db.Role.create({ role });
    sendResponse(res, 200, true, "Role created successfully", newRole);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// Update a role
const updateRole = async (req, res) => {
  try {
    const { role_id, role } = req.body;

    // Check if the new role name already exists in the database
    const existingRole = await db.Role.findOne({ where: { role } });
    if (existingRole && existingRole.role_id !== role_id) {
      return sendResponse(res, 400, false, "Role already exists", null, {
        role: "Role already exists",
      });
    }

    // Update the role
    await db.Role.update({ role }, { where: { role_id } });

    // Fetch the updated role
    const updatedRole = await db.Role.findOne({ where: { role_id } });

    sendResponse(res, 200, true, "Role updated successfully", updatedRole);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// Delete a role

const deleteRole = async (req, res) => {
  try {
    const { role_id } = req.body;

    // Fetch the role, including those marked as deleted (paranoid: false)
    const role = await db.Role.findOne({ where: { role_id }, paranoid: false });
    if (!role) {
      return sendResponse(res, 404, false, "Role not found");
    }

    // Log the current state of the role
    console.log(`Current state of role ${role_id}:`, role.toJSON());

    if (role.deleted_at) {
      // Restore the role
      await role.restore(); // Restore the record
      role.status = true; // Update status after restoring
      await role.save(); // Save the changes
      console.log(`Restored role with ID ${role_id}`);
      return sendResponse(res, 200, true, "Role restored successfully");
    } else {
      // Soft delete the role
      role.status = false; // Update status before deleting
      await role.save(); // Save the status change
      await role.destroy(); // Soft delete the record
      console.log(`Soft deleted role with ID ${role_id}`);
      return sendResponse(res, 200, true, "Role soft deleted successfully");
    }
  } catch (error) {
    console.error("Error in deleteRole function:", error);
    return sendResponse(res, 500, false, error.message);
  }
};

// View a role
const viewRole = async (req, res) => {
  try {
    const { role_id } = req.body;
    const role = await db.Role.findOne({ where: { role_id } });
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all roles
const getRoles = async (req, res) => {
  try {
    const roles = await db.Role.findAll({ paranoid: false });
    return sendResponse(res, 200, true, "Roles retrieved successfully", roles);
  } catch (error) {
    console.error("Error in getRoles function:", error);
    return sendResponse(res, 500, false, error.message);
  }
};

const paginateRoles = async (req, res) => {
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
          { role: { [Op.like]: `%${search}%` } },
          // Add any other fields you want to search by
        ],
      }),
      ...(status && { status: status === "active" ? true : false }),
    };

    const roles = await db.Role.findAndCountAll({
      where,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: sort,
      paranoid: false,
    });

    const responseData = {
      data: roles.rows,
      totalPages: Math.ceil(roles.count / limit),
      currentPage: parseInt(page, 10),
      totalItems: roles.count,
    };

    sendResponse(res, 200, true, "Roles fetched successfully", responseData);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

module.exports = {
  addRole,
  updateRole,
  deleteRole,
  viewRole,
  getRoles,
  paginateRoles,
};
