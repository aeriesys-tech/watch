const { body } = require("express-validator");
const { Validate } = require("../middleware/validationMiddleware");

// Validation for adding a new client
const addClientValidation = (req, res, next) => {
  return Validate([
    body("client_name")
      .trim()
      .notEmpty()
      .withMessage("Client name is required")
      .isString()
      .withMessage("Client name must be a string"),

    body("client_code")
      .trim()
      .notEmpty()
      .withMessage("Client code is required")
      .isString()
      .withMessage("Client code must be a string"),

    body("email")
      .notEmpty()
      .withMessage("Client email is required")
      .bail() // Stops running validations if the previous one failed
      .isEmail()
      .withMessage("Client email must be valid")
      .normalizeEmail(),

    body("contact_person")
      .trim()
      .notEmpty()
      .withMessage("Contact person is required")
      .isString()
      .withMessage("Contact person must be a string"),

    body("mobile_no")
      .trim()
      .notEmpty()
      .withMessage("Mobile number is required")
      .bail() // Stops running validations if the previous one failed
      .isString()
      .withMessage("Mobile number must be a string")
      .isMobilePhone("en-IN")
      .withMessage("Enter a valid mobile number"),

    body("logo")
      .optional()
      .isString()
      .withMessage("Logo must be a string")
      .trim()
      .escape(),

    body("status")
      .optional()
      .isBoolean()
      .withMessage("Status must be a boolean"),
  ])(req, res, next);
};

// Validation for updating a client
const updateClientValidation = (req, res, next) => {
  return Validate([
    body("client_id")
      .notEmpty()
      .withMessage("Client ID is required")
      .bail() // Stops running validations if the previous one failed
      .isInt()
      .withMessage("Client ID must be an integer"),

    body("client_code")
      .notEmpty()
      .withMessage("Client code is required")
      .bail() // Stops running validations if the previous one failed
      .isString()
      .withMessage("Client code must be a string"),

    body("client_name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Client name cannot be empty")
      .bail() // Stops running validations if the previous one failed
      .isString()
      .withMessage("Client name must be a string"),

    body("email")
      .optional()
      .notEmpty()
      .withMessage("Client email cannot be empty")
      .bail() // Stops running validations if the previous one failed
      .isEmail()
      .withMessage("Client email must be valid")
      .normalizeEmail(),

    body("contact_person")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Contact person cannot be empty")
      .bail() // Stops running validations if the previous one failed
      .isString()
      .withMessage("Contact person must be a string"),

    body("mobile_no")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Mobile number cannot be empty")
      .bail() // Stops running validations if the previous one failed
      .isString()
      .withMessage("Mobile number must be a string")
      .isMobilePhone("en-IN")
      .withMessage("Enter a valid mobile number"),

    body("logo")
      .optional()
      .isString()
      .withMessage("Logo must be a string")
      .trim()
      .escape(),

    body("status")
      .optional()
      .isBoolean()
      .withMessage("Status must be a boolean"),
  ])(req, res, next);
};

// Validation for deleting a client
const deleteClientValidation = (req, res, next) => {
  return Validate([
    body("client_id")
      .isInt()
      .withMessage("Client ID must be an integer")
      .notEmpty()
      .withMessage("Client ID is required"),
  ])(req, res, next);
};

// Validation for viewing a client
const viewClientValidation = (req, res, next) => {
  return Validate([
    body("client_id")
      .isInt()
      .withMessage("Client ID must be an integer")
      .notEmpty()
      .withMessage("Client ID is required"),
  ])(req, res, next);
};

// Validation for paginating clients
const paginateClientsValidation = (req, res, next) => {
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
  addClientValidation,
  updateClientValidation,
  deleteClientValidation,
  viewClientValidation,
  paginateClientsValidation,
};
