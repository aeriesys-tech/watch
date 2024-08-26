const { body } = require("express-validator");
const { Validate } = require("../middleware/validationMiddleware");

// Validation for adding a new check group
const addCheckGroupValidation = (req, res, next) => {
  return Validate([
    body("check_group")
      .isString()
      .withMessage("Check Group name must be a string")
      .trim()
      .notEmpty()
      .withMessage("Check Group name is required"),
  ])(req, res, next);
};

// Validation for updating a check group
const updateCheckGroupValidation = (req, res, next) => {
  return Validate([
    body("check_group_id")
      .isInt()
      .withMessage("Check Group ID must be an integer")
      .notEmpty()
      .withMessage("Check Group ID is required"),
    body("check_group")
      .optional()
      .isString()
      .withMessage("Check Group name must be a string")
      .notEmpty()
      .withMessage("Check Group name is required")
      .trim(),
  ])(req, res, next);
};

// Validation for deleting a check group
const deleteCheckGroupValidation = (req, res, next) => {
  return Validate([
    body("check_group_id")
      .isInt()
      .withMessage("Check Group ID must be an integer")
      .notEmpty()
      .withMessage("Check Group ID is required"),
  ])(req, res, next);
};

// Validation for viewing a check group
const viewCheckGroupValidation = (req, res, next) => {
  return Validate([
    body("check_group_id")
      .isInt()
      .withMessage("Check Group ID must be an integer")
      .notEmpty()
      .withMessage("Check Group ID is required"),
  ])(req, res, next);
};

// Validation for getting all check groups (No specific validation needed)
const getCheckGroupsValidation = (req, res, next) => {
  return Validate([])(req, res, next);
};

// Validation for paginating check groups
const paginateCheckGroupsValidation = (req, res, next) => {
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
  addCheckGroupValidation,
  updateCheckGroupValidation,
  deleteCheckGroupValidation,
  viewCheckGroupValidation,
  getCheckGroupsValidation,
  paginateCheckGroupsValidation,
};
