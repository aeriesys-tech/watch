const { body } = require("express-validator");
const { Validate } = require("../middleware/validationMiddleware");

// Validation for adding a new user check parameter
const addUserCheckParameterValidation = (req, res, next) => {
    return Validate([
        body("device_user_id")
            .isInt()
            .withMessage("Device User ID must be an integer")
            .notEmpty()
            .withMessage("Device User ID is required"),
        body("check_parameter_ids")
            .isArray()
            .withMessage("Check Parameter IDs must be an array")
            .custom((value) => {
                // Ensure all elements in the array are integers
                return value.every(id => Number.isInteger(id));
            })
            .withMessage("Each Check Parameter ID must be an integer"),
    ])(req, res, next);
};

// Validation for updating a user check parameter
const updateUserCheckParameterValidation = (req, res, next) => {
    return Validate([
        body("user_check_parameter_id")
            .isInt()
            .withMessage("User Check Parameter ID must be an integer")
            .notEmpty()
            .withMessage("User Check Parameter ID is required"),
        body("device_user_id")
            .optional()
            .isInt()
            .withMessage("Device User ID must be an integer"),
        body("check_parameter_id")
            .optional()
            .isInt()
            .withMessage("Check Parameter ID must be an integer"),
    ])(req, res, next);
};

// Validation for deleting a user check parameter
const deleteUserCheckParameterValidation = (req, res, next) => {
    return Validate([
        body("user_check_parameter_id")
            .isInt()
            .withMessage("User Check Parameter ID must be an integer")
            .notEmpty()
            .withMessage("User Check Parameter ID is required"),
    ])(req, res, next);
};

// Validation for viewing a user check parameter
const viewUserCheckParameterValidation = (req, res, next) => {
    return Validate([
        body("user_check_parameter_id")
            .isInt()
            .withMessage("User Check Parameter ID must be an integer")
            .notEmpty()
            .withMessage("User Check Parameter ID is required"),
    ])(req, res, next);
};

// Validation for getting all user check parameters
const getUserCheckParametersValidation = (req, res, next) => {
    return Validate([])(req, res, next); // No specific validation needed
};

// Validation for paginating user check parameters
const paginateUserCheckParametersValidation = (req, res, next) => {
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
    addUserCheckParameterValidation,
    updateUserCheckParameterValidation,
    deleteUserCheckParameterValidation,
    viewUserCheckParameterValidation,
    getUserCheckParametersValidation,
    paginateUserCheckParametersValidation,
};
