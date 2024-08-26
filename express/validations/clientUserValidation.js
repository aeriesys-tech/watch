const { body } = require("express-validator");
const { Validate } = require("../middleware/validationMiddleware");

// Validation for adding a new ClientUser
const addClientUserValidation = (req, res, next) => {
  return Validate([
    body("client_id")
      .isInt({ gt: 0 })
      .withMessage("Client ID must be a positive integer")
      .notEmpty()
      .withMessage("Client name is required"),

    body("user_id")
      .isInt({ gt: 0 })
      .withMessage("User ID must be a positive integer")
      .notEmpty()
      .withMessage("User name is required"),
  ])(req, res, next);
};

// Validation for updating a ClientUser
const updateClientUserValidation = (req, res, next) => {
  return Validate([
    body("client_user_id")
      .isInt({ gt: 0 })
      .withMessage("Client User ID must be a positive integer")
      .notEmpty()
      .withMessage("Client User ID is required"),

    body("client_id")
      .optional()
      .isInt({ gt: 0 })
      .withMessage("Client ID must be a positive integer")
      .notEmpty()
      .withMessage("Client name is required"),

    body("user_id")
      .optional()
      .isInt({ gt: 0 })
      .withMessage("User ID must be a positive integer")
      .notEmpty()
      .withMessage("User name is required"),
  ])(req, res, next);
};

// Validation for deleting a ClientUser
const deleteClientUserValidation = (req, res, next) => {
  return Validate([
    body("client_user_id")
      .isInt({ gt: 0 })
      .withMessage("Client User ID must be a positive integer")
      .notEmpty()
      .withMessage("Client User ID is required"),
  ])(req, res, next);
};

// Validation for viewing a ClientUser
const viewClientUserValidation = (req, res, next) => {
  return Validate([
    body("client_user_id")
      .isInt({ gt: 0 })
      .withMessage("Client User ID must be a positive integer")
      .notEmpty()
      .withMessage("Client User ID is required"),
  ])(req, res, next);
};

// Validation for paginating ClientUsers
const paginateClientUsersValidation = (req, res, next) => {
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
  addClientUserValidation,
  updateClientUserValidation,
  deleteClientUserValidation,
  viewClientUserValidation,
  paginateClientUsersValidation,
};
