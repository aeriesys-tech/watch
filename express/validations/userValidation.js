const { body } = require("express-validator");
const { Validate } = require("../middleware/validationMiddleware");

// Validation for adding a new user
const addUserValidation = (req, res, next) => {
  return Validate([
    body("name")
      .isString()
      .withMessage("Name must be a string")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Name is required"),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .trim()
      .isEmail()
      .withMessage("Invalid email format")
      .normalizeEmail(),
    body("username")
      .isString()
      .withMessage("Username must be a string")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Username is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .notEmpty()
      .withMessage("Password is required"),
    body("mobile_no")
      .isString()
      .withMessage("Mobile number must be a string")
      .trim()
      .isMobilePhone("en-IN")
      .withMessage("Enter a valid mobile number")
      .notEmpty()
      .withMessage("Mobile number is required"),
    body("role_id")
      .isInt()
      .withMessage("Role ID must be an integer")
      .notEmpty()
      .withMessage("Role ID is required"),
    body("address")
      .optional()
      .isString()
      .withMessage("Address must be a string")
      .trim()
      .escape(),
    body("avatar")
      .optional()
      .isString()
      .withMessage("Avatar must be a string")
      .trim()
      .escape(),
    body("status")
      .isBoolean()
      .withMessage("Status must be a boolean")
      .optional()
      .withMessage("Status is required"),
  ])(req, res, next);
};

// Validation for updating a user
const updateUserValidation = (req, res, next) => {
  return Validate([
    body("user_id")
      .isInt()
      .withMessage("User ID must be an integer")
      .notEmpty()
      .withMessage("User ID is required"),
    body("name")
      .optional()
      .isString()
      .withMessage("Name must be a string")
      .notEmpty()
      .withMessage("Name is required")
      .trim()
      .escape(),

    body("email")
      .optional()
      .isEmail()
      .withMessage("Invalid email format")
      .normalizeEmail()
      .notEmpty()
      .withMessage("Email is required"),
    body("username")
      .optional()
      .isString()
      .withMessage("Username must be a string")
      .notEmpty()
      .withMessage("Username is required")
      .trim()
      .escape(),

    body("mobile_no")
      .optional()
      .isString()
      .withMessage("Mobile number must be a string")
      .isMobilePhone("en-IN")
      .withMessage("Enter a valid mobile number")
      .notEmpty()
      .withMessage("Mobile number is required")
      .trim(),
    body("role_id")
      .optional()
      .isInt()
      .withMessage("Role ID must be an integer")
      .notEmpty()
      .withMessage("Role ID is required"),
    body("address")
      .optional()
      .isString()
      .withMessage("Address must be a string")
      .trim()
      .escape(),
    body("avatar")
      .optional()
      .isString()
      .withMessage("Avatar must be a string")
      .trim()
      .escape(),
    body("status")
      .optional()
      .isBoolean()
      .withMessage("Status must be a boolean"),
  ])(req, res, next);
};

// Validation for deleting a user
const deleteUserValidation = (req, res, next) => {
  return Validate([
    body("user_id")
      .isInt()
      .withMessage("User ID must be an integer")
      .notEmpty()
      .withMessage("User ID is required"),
  ])(req, res, next);
};

// Validation for viewing a user
const viewUserValidation = (req, res, next) => {
  return Validate([
    body("user_id")
      .isInt()
      .withMessage("User ID must be an integer")
      .notEmpty()
      .withMessage("User ID is required"),
  ])(req, res, next);
};

// Validation for getting users with pagination
const paginateUsersValidation = (req, res, next) => {
  return Validate([
    body("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    body("limit")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Limit must be a positive integer"),
  ])(req, res, next);
};

module.exports = {
  addUserValidation,
  updateUserValidation,
  deleteUserValidation,
  viewUserValidation,
  paginateUsersValidation,
};
