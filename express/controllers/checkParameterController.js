const { Op } = require("sequelize");
const responseService = require("../services/responseService");
const { CheckParameter, DeviceType, CheckGroup, Unit } = require("../models");
// Add a new check parameter
const addCheckParameter = async (req, res) => {
  try {
    const {
      device_type_id,
      check_group_id,
      parameter_code,
      parameter_name,
      unit_id,
      icon,
      status,
    } = req.body;

    // Check if the parameter_code or parameter_name already exists in the database
    const existingCheckParameter = await CheckParameter.findOne({
      where: {
        [Op.or]: [{ parameter_code }, { parameter_name }],
      },
    });

    if (existingCheckParameter) {
      const errors = {};
      if (existingCheckParameter.parameter_code === parameter_code) {
        errors.parameter_code =
          "Check parameter with the same code already exists";
      }
      if (existingCheckParameter.parameter_name === parameter_name) {
        errors.parameter_name =
          "Check parameter with the same name already exists";
      }
      return responseService.error(req, res, "Validation Error", errors, 400);
    }

    // Create the new check parameter
    const newCheckParameter = await CheckParameter.create({
      device_type_id,
      check_group_id,
      parameter_code,
      parameter_name,
      unit_id,
      icon,
      status,
    });

    return responseService.success(
      req,
      res,
      "Check parameter created successfully",
      newCheckParameter,
      201
    );
  } catch (error) {
    console.error("Error in addCheckParameter function:", error.message);
    return responseService.error(req, res, "Internal server error", null, 500);
  }
};

// Update a check parameter
const updateCheckParameter = async (req, res) => {
  try {
    const {
      check_parameter_id,
      device_type_id,
      check_group_id,
      parameter_code,
      parameter_name,
      unit_id,
      icon,
      status,
    } = req.body;

    // Validate if check_parameter_id is provided
    if (!check_parameter_id) {
      return responseService.error(
        req,
        res,
        "Check parameter ID is required",
        { check_parameter_id: "Check parameter ID is required" },
        400
      );
    }

    // Check if the parameter_code or parameter_name already exists in the database and belongs to a different parameter
    const existingCheckParameter = await CheckParameter.findOne({
      where: {
        [Op.or]: [{ parameter_code }, { parameter_name }],
        check_parameter_id: { [Op.ne]: check_parameter_id }, // Exclude the current parameter from the check
      },
    });

    if (existingCheckParameter) {
      const errors = {};
      if (existingCheckParameter.parameter_code === parameter_code) {
        errors.parameter_code =
          "Check parameter with the same code already exists";
      }
      if (existingCheckParameter.parameter_name === parameter_name) {
        errors.parameter_name =
          "Check parameter with the same name already exists";
      }
      return responseService.error(req, res, "Validation Error", errors, 400);
    }

    // Perform the update
    const [rowsUpdated] = await CheckParameter.update(
      {
        device_type_id,
        check_group_id,
        parameter_code,
        parameter_name,
        unit_id,
        icon,
        status,
      },
      { where: { check_parameter_id } }
    );

    if (rowsUpdated === 0) {
      return responseService.error(
        req,
        res,
        "Check parameter not found",
        { check_parameter: "Check parameter not found" },
        404
      );
    }

    // Fetch the updated check parameter
    const updatedCheckParameter = await CheckParameter.findByPk(
      check_parameter_id
    );

    return responseService.success(
      req,
      res,
      "Check parameter updated successfully",
      updatedCheckParameter
    );
  } catch (error) {
    console.error("Error in updateCheckParameter function:", error.message);
    return responseService.error(req, res, "Internal server error", null, 500);
  }
};

// Soft delete or restore a check parameter
const deleteCheckParameter = async (req, res) => {
  try {
    const { check_parameter_id } = req.body;

    // Validate if check_parameter_id is provided
    if (!check_parameter_id) {
      return responseService.error(
        req,
        res,
        "Check parameter ID is required",
        { check_parameter_id: "Check parameter ID is required" },
        400
      );
    }

    // Fetch the check parameter, including those marked as deleted (paranoid: false)
    const checkParameter = await CheckParameter.findByPk(check_parameter_id, {
      paranoid: false,
    });
    if (!checkParameter) {
      return responseService.error(
        req,
        res,
        "Check parameter not found",
        {},
        404
      );
    }

    if (checkParameter.deleted_at) {
      // Restore the check parameter
      await checkParameter.restore(); // Restore the record
      checkParameter.status = true; // Update status after restoring
      await checkParameter.save(); // Save the changes
      return responseService.success(
        req,
        res,
        "Check parameter restored successfully",
        checkParameter
      );
    } else {
      // Soft delete the check parameter
      checkParameter.status = false; // Update status before deleting
      await checkParameter.save(); // Save the status change
      await checkParameter.destroy(); // Soft delete the record
      return responseService.success(
        req,
        res,
        "Check parameter soft deleted successfully",
        checkParameter
      );
    }
  } catch (error) {
    console.error("Error in deleteCheckParameter function:", error.message);
    return responseService.error(req, res, "Internal server error", null, 500);
  }
};

// View a check parameter
const viewCheckParameter = async (req, res) => {
  try {
    const { check_parameter_id } = req.body;

    // Validate if check_parameter_id is provided
    if (!check_parameter_id) {
      return responseService.error(
        req,
        res,
        "Check parameter ID is required",
        { check_parameter_id: "Check parameter ID is required" },
        400
      );
    }

    const checkParameter = await CheckParameter.findByPk(check_parameter_id);

    if (!checkParameter) {
      return responseService.error(
        req,
        res,
        "Check parameter not found",
        {},
        404
      );
    }

    return responseService.success(
      req,
      res,
      "Check parameter retrieved successfully",
      checkParameter
    );
  } catch (error) {
    console.error("Error in viewCheckParameter function:", error.message);
    return responseService.error(req, res, "Internal server error", null, 500);
  }
};

// Get all check parameters
const getCheckParameters = async (req, res) => {
  try {
    const checkParameters = await CheckParameter.findAll({ paranoid: false });
    return responseService.success(
      req,
      res,
      "Check Parameters retrieved successfully",
      checkParameters
    );
  } catch (error) {
    console.error("Error in getCheckParameters function:", error.message);
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};
// Paginate check parameters
const paginateCheckParameters = async (req, res) => {
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
          { parameter_code: { [Op.like]: `%${search}%` } },
          { parameter_name: { [Op.like]: `%${search}%` } },
          { "$deviceType.device_type$": { [Op.like]: `%${search}%` } }, // Search by device type
          { "$checkGroup.check_group$": { [Op.like]: `%${search}%` } }, // Search by check group name
          { "$unit.unit$": { [Op.like]: `%${search}%` } }, // Search by unit name
        ],
      }),
      ...(status && { status: status === "active" ? true : false }),
    };

    // Fetch paginated check parameters with related models
    const checkParameters = await CheckParameter.findAndCountAll({
      where,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: sort,
      include: [
        {
          model: DeviceType,
          as: "deviceType",
          attributes: ["device_type_id", "device_type"], // Include device_type for search
        },
        {
          model: CheckGroup,
          as: "checkGroup",
          attributes: ["check_group_id", "check_group"], // Include check_group for search
        },
        {
          model: Unit,
          as: "unit",
          attributes: ["unit_id", "unit"], // Include unit for search
        },
      ],
      paranoid: false,
    });

    const responseData = {
      data: checkParameters.rows,
      totalPages: Math.ceil(checkParameters.count / limit),
      currentPage: parseInt(page, 10),
      totalItems: checkParameters.count,
    };

    return responseService.success(
      req,
      res,
      "Check Parameters fetched successfully",
      responseData
    );
  } catch (error) {
    console.error("Error in paginateCheckParameters function:", error); // Log detailed error
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};

module.exports = {
  addCheckParameter,
  updateCheckParameter,
  deleteCheckParameter,
  viewCheckParameter,
  getCheckParameters,
  paginateCheckParameters,
};
