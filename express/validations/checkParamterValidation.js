const { body } = require("express-validator");
const { Validate } = require("../middleware/validationMiddleware");

// Validation for adding new check parameters
const addCheckParametersValidation = (req, res, next) => {
  return Validate([
    body("device_type_id")
      .notEmpty()
      .withMessage("Device Type  is required")
      .isInt()
      .withMessage("Please select a device type"),

    body("check_group_id")
      .notEmpty()
      .withMessage("Check Group  is required")
      .isInt()
      .withMessage("Please select a check group"),

    body("parameter_code")
      .trim()
      .notEmpty()
      .withMessage("Parameter Code is required")
      .isString()
      .withMessage("Parameter Code must be a string")
      .isLength({ max: 100 })
      .withMessage("Parameter Code must not exceed 100 characters"),

    body("parameter_name")
      .trim()
      .notEmpty()
      .withMessage("Parameter Name is required")
      .isString()
      .withMessage("Parameter Name must be a string")
      .isLength({ max: 100 })
      .withMessage("Parameter Name must not exceed 100 characters"),

    body("unit_id")
      .notEmpty()
      .withMessage("Unit  is required")
      .isInt()
      .withMessage("Please select a unit"),

    body("icon")
      .optional()
      .trim()
      .isString()
      .withMessage("Icon must be a string")
      .isLength({ max: 100 })
      .withMessage("Icon must not exceed 100 characters"),

    body("status")
      .optional()
      .isBoolean()
      .withMessage("Status must be a boolean"),
  ])(req, res, next);
};

// Validation for updating check parameters
const updateCheckParametersValidation = (req, res, next) => {
  return Validate([
    body("parameter_code")
      .trim()
      .notEmpty()
      .withMessage("Parameter Code is required")
      .isString()
      .withMessage("Parameter Code must be a string")
      .isLength({ max: 100 })
      .withMessage("Parameter Code must not exceed 100 characters"),

    body("parameter_name")
      .trim()
      .notEmpty()
      .withMessage("Parameter Name is required")
      .isString()
      .withMessage("Parameter Name must be a string")
      .isLength({ max: 100 })
      .withMessage("Parameter Name must not exceed 100 characters"),
    body("check_parameter_id")
      .notEmpty()
      .withMessage("Check Parameter ID is required")
      .isInt()
      .withMessage("Check Parameter ID must be an integer"),

    body("device_type_id")
      .optional()
      .isInt()
      .withMessage("Please select a device type"),

    body("check_group_id")
      .optional()
      .isInt()
      .withMessage("Please select a check group"),

    body("parameter_code")
      .optional()
      .trim()
      .isString()
      .withMessage("Parameter Code must be a string")
      .isLength({ max: 100 })
      .withMessage("Parameter Code must not exceed 100 characters"),

    body("parameter_name")
      .optional()
      .trim()
      .isString()
      .withMessage("Parameter Name must be a string")
      .isLength({ max: 100 })
      .withMessage("Parameter Name must not exceed 100 characters"),

    body("unit_id").optional().isInt().withMessage("Please select a unit"),

    body("icon")
      .optional()
      .trim()
      .isString()
      .withMessage("Icon must be a string")
      .isLength({ max: 100 })
      .withMessage("Icon must not exceed 100 characters"),

    body("status")
      .optional()
      .isBoolean()
      .withMessage("Status must be a boolean"),
  ])(req, res, next);
};

// Validation for deleting check parameters
const deleteCheckParametersValidation = (req, res, next) => {
  return Validate([
    body("check_parameter_id")
      .notEmpty()
      .withMessage("Check Parameter ID is required")
      .isInt()
      .withMessage("Check Parameter ID must be an integer"),
  ])(req, res, next);
};

// Validation for viewing check parameters
const viewCheckParametersValidation = (req, res, next) => {
  return Validate([
    body("check_parameter_id")
      .notEmpty()
      .withMessage("Check Parameter ID is required")
      .isInt()
      .withMessage("Check Parameter ID must be an integer"),
  ])(req, res, next);
};

// Validation for paginating check parameters
const paginateCheckParametersValidation = (req, res, next) => {
  return Validate([
    body("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page number must be an integer greater than 0"),

    body("limit")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Limit must be an integer greater than 0"),
  ])(req, res, next);
};

module.exports = {
  addCheckParametersValidation,
  updateCheckParametersValidation,
  deleteCheckParametersValidation,
  viewCheckParametersValidation,
  paginateCheckParametersValidation,
};
