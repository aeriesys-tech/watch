const { body } = require("express-validator");
const { Validate } = require("../middleware/validationMiddleware");

// Validation for adding a new device user
const addDeviceUserValidation = (req, res, next) => {
  return Validate([
    body("client_id")
      .notEmpty()
      .withMessage("Client is required")
      .bail()
      .isInt()
      .withMessage("Client ID must be an integer"),

    body("device_id")
      .notEmpty()
      .withMessage("Device  is required")
      .bail()
      .isInt()
      .withMessage("Device ID must be an integer"),

    body("user_id")
      .notEmpty()
      .withMessage("User  is required")
      .bail()
      .isInt()
      .withMessage("User ID must be an integer"),

    body("from_date_time")
      .notEmpty()
      .withMessage("From Date Time is required")
      .bail()
      .isISO8601()
      .withMessage("From Date Time must be a valid date"),

    body("to_date_time")
      .notEmpty()
      .withMessage("To Date Time  is required")
      .bail()
      .isISO8601()
      .withMessage("FTo Date Time must be a valid date"),
  ])(req, res, next);
};

// Validation for updating a device user
const updateDeviceUserValidation = (req, res, next) => {
  return Validate([
    body("device_user_id")
      .notEmpty()
      .withMessage("Device User  is required")
      .bail()
      .isInt()
      .withMessage("Device User ID must be an integer"),

    body("client_id")
      .optional()
      .notEmpty()
      .withMessage("Client is required")
      .bail()
      .isInt()
      .withMessage("Client ID must be an integer"),

    body("device_id")
      .optional()
      .notEmpty()
      .withMessage("Device is required")
      .bail()
      .isInt()
      .withMessage("Device ID must be an integer"),

    body("user_id")
      .optional()
      .notEmpty()
      .withMessage("User is required")
      .bail()
      .isInt()
      .withMessage("User ID must be an integer"),

    body("from_date_time")
      .notEmpty()
      .withMessage("From Date Time is required")
      .bail()
      .isISO8601()
      .withMessage("From Date Time must be a valid date"),

    body("to_date_time")
      .notEmpty()
      .withMessage("To Date Time  is required")
      .bail()
      .isISO8601()
      .withMessage("FTo Date Time must be a valid date"),
  ])(req, res, next);
};

// Validation for deleting a device user
const deleteDeviceUserValidation = (req, res, next) => {
  return Validate([
    body("device_user_id")
      .isInt()
      .withMessage("Device User ID must be an integer")
      .notEmpty()
      .withMessage("Device User ID is required"),
  ])(req, res, next);
};

// Validation for viewing a device user
const viewDeviceUserValidation = (req, res, next) => {
  return Validate([
    body("device_user_id")
      .isInt()
      .withMessage("Device User ID must be an integer")
      .notEmpty()
      .withMessage("Device User ID is required"),
  ])(req, res, next);
};

// Validation for paginating device users
const paginateDeviceUsersValidation = (req, res, next) => {
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
  addDeviceUserValidation,
  updateDeviceUserValidation,
  deleteDeviceUserValidation,
  viewDeviceUserValidation,
  paginateDeviceUsersValidation,
};
