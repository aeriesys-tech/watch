const { Role } = require("../models");
const { Op } = require("sequelize");
const responseService = require("../services/responseService");

// Add a new role
const addRole = async (req, res) => {
  try {
    const { role } = req.body;

    // Check if the role already exists in the database
    const existingRole = await Role.findOne({ where: { role } });
    if (existingRole) {
      const errors = { role: "Role already exists" };
      return responseService.error(req, res, "Validation Error", errors, 400);
    }

    // Create the new role if it does not exist
    const newRole = await Role.create({ role });
    return responseService.success(req, res, "Role created successfully", newRole, 201);
  } catch (error) {
    console.error("Error in addRole function:", error.message);
    return responseService.error(req, res, "Internal server error", null, 500);
  }
};

// Update a role
const updateRole = async (req, res) => {
  try {
    const { role_id, role } = req.body;

    // Check if the new role name already exists in the database
    const existingRole = await Role.findOne({ where: { role } });
    if (existingRole && existingRole.role_id !== role_id) {
      const errors = { role: "Role already exists" };
      return responseService.error(req, res, "Validation Error", errors, 400);
    }

    // Update the role
    await Role.update({ role }, { where: { role_id } });

    // Fetch the updated role
    const updatedRole = await Role.findOne({ where: { role_id } });
    return responseService.success(req, res, "Role updated successfully", updatedRole);
  } catch (error) {
    console.error("Error in updateRole function:", error.message);
    return responseService.error(req, res, "Internal server error", null, 500);
  }
};

// Delete or restore a role
const deleteRole = async (req, res) => {
  try {
    const { role_id } = req.body;

    // Fetch the role, including those marked as deleted (paranoid: false)
    const role = await Role.findOne({ where: { role_id }, paranoid: false });
    if (!role) {
      return responseService.error(req, res, "Role not found", {}, 404);
    }

    // Log the current state of the role
    console.log(`Current state of role ${role_id}:`, role.toJSON());

    if (role.deleted_at) {
      // Restore the role
      await role.restore(); // Restore the record
      role.status = true; // Update status after restoring
      await role.save(); // Save the changes
      console.log(`Restored role with ID ${role_id}`);
      return responseService.success(req, res, "Role restored successfully");
    } else {
      // Soft delete the role
      role.status = false; // Update status before deleting
      await role.save(); // Save the status change
      await role.destroy(); // Soft delete the record
      console.log(`Soft deleted role with ID ${role_id}`);
      return responseService.success(req, res, "Role soft deleted successfully");
    }
  } catch (error) {
    console.error("Error in deleteRole function:", error.message);
    return responseService.error(req, res, "Internal server error", null, 500);
  }
};

// View a role
const viewRole = async (req, res) => {
  try {
    const { role_id } = req.body;
    const role = await Role.findOne({ where: { role_id } });
    if (!role) {
      return responseService.error(req, res, "Role not found", {}, 404);
    }

    return responseService.success(req, res, "Role retrieved successfully", role);
  } catch (error) {
    console.error("Error in viewRole function:", error.message);
    return responseService.error(req, res, "Internal server error", null, 500);
  }
};

// Get all roles
const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({ paranoid: false });
    return responseService.success(req, res, "Roles retrieved successfully", roles);
  } catch (error) {
    console.error("Error in getRoles function:", error.message);
    return responseService.error(req, res, "Internal server error", null, 500);
  }
};

// Paginate roles
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
        [Op.or]: [{ role: { [Op.like]: `%${search}%` } }],
      }),
      ...(status && { status: status === "active" ? true : false }),
    };

    const roles = await Role.findAndCountAll({
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

    return responseService.success(req, res, "Roles fetched successfully", responseData);
  } catch (error) {
    console.error("Error in paginateRoles function:", error.message);
    return responseService.error(req, res, "Internal server error", null, 500);
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
