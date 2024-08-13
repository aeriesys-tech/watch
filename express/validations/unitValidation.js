const { body } = require("express-validator");
const { Validate } = require("../middleware/validationMiddleware");

// Validation for adding a new unit
const addUnitValidation = (req, res, next) => {
    return Validate([
        body("unit")
            .isString()
            .withMessage("Unit name must be a string")
            .trim()
            .notEmpty()
            .withMessage("Unit name is required"),
    ])(req, res, next);
};

// Validation for updating a unit
const updateUnitValidation = (req, res, next) => {
    return Validate([
        body("unit_id")
            .isInt()
            .withMessage("Unit ID must be an integer")
            .notEmpty()
            .withMessage("Unit ID is required"),
        body("unit")
            .optional()
            .isString()
            .withMessage("Unit name must be a string")
            .trim(),
    ])(req, res, next);
};

// Validation for deleting a unit
const deleteUnitValidation = (req, res, next) => {
    return Validate([
        body("unit_id")
            .isInt()
            .withMessage("Unit ID must be an integer")
            .notEmpty()
            .withMessage("Unit ID is required"),
    ])(req, res, next);
};

// Validation for viewing a unit
const viewUnitValidation = (req, res, next) => {
    return Validate([
        body("unit_id")
            .isInt()
            .withMessage("Unit ID must be an integer")
            .notEmpty()
            .withMessage("Unit ID is required"),
    ])(req, res, next);
};

// Validation for getting all units
const getUnitsValidation = (req, res, next) => {
    return Validate([])(req, res, next); // No specific validation needed
};

// Validation for paginating units
const paginateUnitsValidation = (req, res, next) => {
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
    addUnitValidation,
    updateUnitValidation,
    deleteUnitValidation,
    viewUnitValidation,
    getUnitsValidation,
    paginateUnitsValidation,
};
