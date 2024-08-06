const db = require("../models");
const { Op } = require("sequelize");

// Add a new role
const addRole = async (req, res) => {
  try {
    const { role, status } = req.body;

    // Check if the role already exists in the database
    const existingRole = await db.Role.findOne({ where: { role } });
    if (existingRole) {
      return res.status(400).json({
        message: "role already exists",
        errors: { role: "Role already exists" },
      });
    }

    // Create the new role if it does not exist
    const newRole = await db.Role.create({ role, status });
    res.json(newRole);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a role
const updateRole = async (req, res) => {
  try {
    const { role_id, role, status } = req.body;

    // Check if the new role name already exists in the database
    const existingRole = await db.Role.findOne({ where: { role } });
    if (existingRole && existingRole.role_id !== role_id) {
      return res
        .status(400)
        .json({
          message: "Role already exists",
          errors: { role: "Role already exists" },
        });
    }

    // Update the role
    await db.Role.update({ role, status }, { where: { role_id } });

    // Fetch the updated role
    const updatedRole = await db.Role.findOne({ where: { role_id } });

    res.json(updatedRole);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a role
// const deleteRole = async (req, res) => {
//   try {
//     const { role_id } = req.body;
//     await db.Role.destroy({ where: { role_id } });
//     res.json({ message: "Role deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };/
const deleteRole = async (req, res) => {
  try {
    const { role_id } = req.body;

    // Fetch the role, including those marked as deleted (paranoid: false)
    const role = await db.Role.findOne({ where: { role_id }, paranoid: false });
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Log the current state of the role
    console.log(`Current state of role ${role_id}:`, role.toJSON());

    if (role.deleted_at) {
      // Restore the role
      await role.restore(); // Restore the record
      role.status = true; // Update status after restoring
      await role.save(); // Save the changes
      console.log(`Restored role with ID ${role_id}`);
      return res.json({ message: "Role restored successfully" });
    } else {
      // Soft delete the role
      role.status = false; // Update status before deleting
      await role.save(); // Save the status change
      await role.destroy(); // Soft delete the record
      console.log(`Soft deleted role with ID ${role_id}`);
      return res.json({ message: "Role soft deleted successfully" });
    }
  } catch (error) {
    console.error("Error in deleteRole function:", error);
    res.status(500).json({ error: error.message });
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
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Paginate roles
// const paginateRoles = async (req, res) => {
//   try {
//     const { page = 1, limit = 10 } = req.body;
//     const offset = (page - 1) * limit;
//     const roles = await db.Role.findAndCountAll({
//       paranoid: false,
//       limit,
//       offset,
//     });
//     res.json({
//       data: roles.rows,
//       totalPages: Math.ceil(roles.count / limit),
//       currentPage: page,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

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

    res.json({
      data: roles.rows,
      totalPages: Math.ceil(roles.count / limit),
      currentPage: parseInt(page, 10),
      totalItems: roles.count,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
