const { body } = require("express-validator");
const { Validate } = require("../middleware/validationMiddleware");

// Validation for adding a new device
const addDeviceValidation = (req, res, next) => {
  return Validate([
    body("client_id")
      .notEmpty()
      .withMessage("Client ID is required")
      .isInt()
      .withMessage("Client name is required"),

    body("device_type_id")
      .notEmpty()
      .withMessage("Device Type ID is required")
      .isInt()
      .withMessage("Device Type is required"),

    body("serial_no")
      .notEmpty()
      .withMessage("Serial Number is required")
      .isString()
      .withMessage("Serial Number must be a string")
      .isLength({ max: 50 })
      .withMessage("Serial Number must not exceed 50 characters"),

    body("mobile_no")
      .notEmpty()
      .withMessage("Mobile Number is required")
      .isString()
      .withMessage("Mobile Number must be a string")
      .isLength({ max: 15 })
      .withMessage("Mobile Number must not exceed 10 characters"),

    body("port_no")
      .notEmpty()
      .withMessage("Port Number is required")
      .isString()
      .withMessage("Port Number must be a string")
      .isLength({ max: 10 })
      .withMessage("Port Number must not exceed 10 characters"),
  ])(req, res, next);
};

// Validation for updating a device
const updateDeviceValidation = (req, res, next) => {
  return Validate([
    body("device_id")
      .notEmpty()
      .withMessage("Device ID is required")
      .isInt()
      .withMessage("Device ID must be an integer"),

    body("client_id")
      .optional()
      .isInt()
      .withMessage("Client ID must be an integer"),

    body("device_type_id")
      .optional()
      .isInt()
      .withMessage("Device Type ID must be an integer"),

    body("serial_no")
      .optional()
      .isString()
      .withMessage("Serial Number must be a string")
      .isLength({ max: 50 })
      .withMessage("Serial Number must not exceed 50 characters"),

    body("mobile_no")
      .optional()
      .isString()
      .withMessage("Mobile Number must be a string")
      .isLength({ max: 15 })
      .withMessage("Mobile Number must not exceed 15 characters"),

    body("port_no")
      .optional()
      .isString()
      .withMessage("Port Number must be a string")
      .isLength({ max: 10 })
      .withMessage("Port Number must not exceed 10 characters"),

    body("status")
      .optional()
      .isBoolean()
      .withMessage("Status must be a boolean"),
  ])(req, res, next);
};

// Validation for deleting a device
const deleteDeviceValidation = (req, res, next) => {
  return Validate([
    body("device_id")
      .notEmpty()
      .withMessage("Device ID is required")
      .isInt()
      .withMessage("Device ID must be an integer"),
  ])(req, res, next);
};

// Validation for viewing a device
const viewDeviceValidation = (req, res, next) => {
  return Validate([
    body("device_id")
      .notEmpty()
      .withMessage("Device ID is required")
      .isInt()
      .withMessage("Device ID must be an integer"),
  ])(req, res, next);
};

// Validation for paginating devices
const paginateDeviceValidation = (req, res, next) => {
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
  addDeviceValidation,
  updateDeviceValidation,
  deleteDeviceValidation,
  viewDeviceValidation,
  paginateDeviceValidation,
};
