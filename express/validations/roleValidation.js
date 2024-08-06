const { body } = require("express-validator");
const { Validate } = require("../middleware/validationMiddleware");

// Validation for adding a new role
const addRoleValidation = (req, res, next) => {
  return Validate([
    body("role")
      .isString()
      .withMessage("Role name must be a string")
      .trim()
      .notEmpty()
      .withMessage("Role name is required"),
    body("status")
      .isBoolean()
      .withMessage("Status must be a boolean")
      .notEmpty()
      .withMessage("Status is required"),
  ])(req, res, next);
};

// Validation for updating a role
const updateRoleValidation = (req, res, next) => {
  return Validate([
    body("role_id")
      .isInt()
      .withMessage("Role ID must be an integer")
      .notEmpty()
      .withMessage("Role ID is required"),
    body("role")
      .optional()
      .isString()
      .withMessage("Role name must be a string")
      .trim(),
    body("status")
      .optional()
      .isBoolean()
      .withMessage("Status must be a boolean"),
  ])(req, res, next);
};

// Validation for deleting a role
const deleteRoleValidation = (req, res, next) => {
  return Validate([
    body("role_id")
      .isInt()
      .withMessage("Role ID must be an integer")
      .notEmpty()
      .withMessage("Role ID is required"),
  ])(req, res, next);
};

// Validation for viewing a role
const viewRoleValidation = (req, res, next) => {
  return Validate([
    body("role_id")
      .isInt()
      .withMessage("Role ID must be an integer")
      .notEmpty()
      .withMessage("Role ID is required"),
  ])(req, res, next);
};

// Validation for getting all roles
const getRolesValidation = (req, res, next) => {
  return Validate([])(req, res, next); // No specific validation needed
};

// Validation for paginating roles
const paginateRolesValidation = (req, res, next) => {
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
  addRoleValidation,
  updateRoleValidation,
  deleteRoleValidation,
  viewRoleValidation,
  getRolesValidation,
  paginateRolesValidation,
};
