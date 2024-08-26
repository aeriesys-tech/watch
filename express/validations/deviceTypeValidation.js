const { body } = require("express-validator");
const { Validate } = require("../middleware/validationMiddleware");

// Validation for adding a new device type
const addDeviceTypeValidation = (req, res, next) => {
  return Validate([
    body("device_type")
      .isString()
      .withMessage("Device type name must be a string")
      .trim()
      .notEmpty()
      .withMessage("Device type name is required"),
  ])(req, res, next);
};

// Validation for updating a device type
const updateDeviceTypeValidation = (req, res, next) => {
  return Validate([
    body("device_type_id")
      .isInt()
      .withMessage("Device type ID must be an integer")
      .notEmpty()
      .withMessage("Device type ID is required"),
    body("device_type")
      .optional()
      .isString()
      .withMessage("Device type name must be a string")
      .notEmpty()
      .withMessage("Device type name is required")
      .trim(),
  ])(req, res, next);
};

// Validation for deleting a device type
const deleteDeviceTypeValidation = (req, res, next) => {
  return Validate([
    body("device_type_id")
      .isInt()
      .withMessage("Device type ID must be an integer")
      .notEmpty()
      .withMessage("Device type  is required"),
  ])(req, res, next);
};

// Validation for viewing a device type
const viewDeviceTypeValidation = (req, res, next) => {
  return Validate([
    body("device_type_id")
      .isInt()
      .withMessage("Device type ID must be an integer")
      .notEmpty()
      .withMessage("Device type  is required"),
  ])(req, res, next);
};

// Validation for getting all device types
const getDeviceTypesValidation = (req, res, next) => {
  return Validate([])(req, res, next); // No specific validation needed
};

// Validation for paginating device types
const paginateDeviceTypesValidation = (req, res, next) => {
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
  addDeviceTypeValidation,
  updateDeviceTypeValidation,
  deleteDeviceTypeValidation,
  viewDeviceTypeValidation,
  getDeviceTypesValidation,
  paginateDeviceTypesValidation,
};
