const { CheckGroup } = require("../models");
const { Op } = require("sequelize");
const responseService = require("../services/responseService");

// Add a new check group
const addCheckGroup = async (req, res) => {
  try {
    const { check_group } = req.body;

    // Check if the check group already exists in the database
    const existingCheckGroup = await CheckGroup.findOne({
      where: { check_group },
    });
    if (existingCheckGroup) {
      const errors = { check_group: "Check Group already exists" };
      return responseService.error(req, res, "Validation Error", errors, 400);
    }

    // Create the new check group if it does not exist
    const newCheckGroup = await CheckGroup.create({ check_group });
    return responseService.success(
      req,
      res,
      "Check Group created successfully",
      newCheckGroup,
      201
    );
  } catch (error) {
    console.error("Error in addCheckGroup function:", error.message);
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};

// Update a check group
const updateCheckGroup = async (req, res) => {
  try {
    const { check_group_id, check_group } = req.body;

    // Check if the new check group name already exists in the database
    const existingCheckGroup = await CheckGroup.findOne({
      where: { check_group },
    });
    if (
      existingCheckGroup &&
      existingCheckGroup.check_group_id !== check_group_id
    ) {
      const errors = { check_group: "Check Group already exists" };
      return responseService.error(req, res, "Validation Error", errors, 400);
    }

    // Update the check group
    await CheckGroup.update({ check_group }, { where: { check_group_id } });

    // Fetch the updated check group
    const updatedCheckGroup = await CheckGroup.findByPk(check_group_id);
    return responseService.success(
      req,
      res,
      "Check Group updated successfully",
      updatedCheckGroup
    );
  } catch (error) {
    console.error("Error in updateCheckGroup function:", error.message);
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};

// Delete or restore a check group
const deleteCheckGroup = async (req, res) => {
  try {
    const { check_group_id } = req.body;

    // Fetch the check group, including those marked as deleted (paranoid: false)
    const checkGroup = await CheckGroup.findByPk(check_group_id, {
      paranoid: false,
    });
    if (!checkGroup) {
      return responseService.error(req, res, "Check Group not found", {}, 404);
    }

    if (checkGroup.deleted_at) {
      // Restore the check group
      await checkGroup.restore(); // Restore the record
      checkGroup.status = true; // Update status after restoring
      await checkGroup.save(); // Save the changes
      return responseService.success(
        req,
        res,
        "Check Group restored successfully"
      );
    } else {
      // Soft delete the check group
      checkGroup.status = false; // Update status before deleting
      await checkGroup.save(); // Save the status change
      await checkGroup.destroy(); // Soft delete the record
      return responseService.success(
        req,
        res,
        "Check Group soft deleted successfully"
      );
    }
  } catch (error) {
    console.error("Error in deleteCheckGroup function:", error.message);
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};

// View a check group
const viewCheckGroup = async (req, res) => {
  try {
    const { check_group_id } = req.body;
    const checkGroup = await CheckGroup.findByPk(check_group_id);
    if (!checkGroup) {
      return responseService.error(req, res, "Check Group not found", {}, 404);
    }
    return responseService.success(
      req,
      res,
      "Check Group retrieved successfully",
      checkGroup
    );
  } catch (error) {
    console.error("Error in viewCheckGroup function:", error.message);
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};

// Get all check groups
const getCheckGroups = async (req, res) => {
  try {
    const checkGroups = await CheckGroup.findAll({ paranoid: false });
    return responseService.success(
      req,
      res,
      "Check Groups retrieved successfully",
      checkGroups
    );
  } catch (error) {
    console.error("Error in getCheckGroups function:", error.message);
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};

// Paginate check groups
const paginateCheckGroups = async (req, res) => {
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
        [Op.or]: [{ check_group: { [Op.like]: `%${search}%` } }],
      }),
      ...(status && { status: status === "active" ? true : false }),
    };

    const checkGroups = await CheckGroup.findAndCountAll({
      where,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: sort,
      paranoid: false,
    });

    const responseData = {
      data: checkGroups.rows,
      totalPages: Math.ceil(checkGroups.count / limit),
      currentPage: parseInt(page, 10),
      totalItems: checkGroups.count,
    };

    return responseService.success(
      req,
      res,
      "Check Groups fetched successfully",
      responseData
    );
  } catch (error) {
    console.error("Error in paginateCheckGroups function:", error.message);
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};

module.exports = {
  addCheckGroup,
  updateCheckGroup,
  deleteCheckGroup,
  viewCheckGroup,
  getCheckGroups,
  paginateCheckGroups,
};
