const { check, validationResult } = require("express-validator");
const { Validate } = require("../middleware/validationMiddleware");

// Validation for login
const loginValidation = (req, res, next) => {
  return Validate([
    check("email").isEmail().withMessage("Enter a valid email address"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ])(req, res, next);
};
// Validation for updating profile
const updateProfileValidation = (req, res, next) => {
  return Validate([
    check("name").optional().isString().withMessage("Name must be a string"),
    check("username")
      .optional()
      .isString()
      .withMessage("Username must be a string"),
    check("mobile_no")
      .optional()
      .isMobilePhone()
      .withMessage("Enter a valid mobile number"),
    check("address")
      .optional()
      .isString()
      .withMessage("Address must be a string"),
    check("avatar")
      .optional()
      .isString()
      .withMessage("Avatar must be a string"),
  ])(req, res, next);
};

// Validation for updating password
const updatePasswordValidation = (req, res, next) => {
  return Validate([
    check("oldPassword")
      .isLength({ min: 6 })
      .withMessage("Old password must be at least 6 characters long"),
    check("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters long"),
    check("confirmPassword")
      .isLength({ min: 6 })
      .withMessage("Confirm password must be at least 6 characters long"),
  ])(req, res, next);
};

// Validation for forgot password
const forgotPasswordValidation = (req, res, next) => {
  return Validate([
    check("email").isEmail().withMessage("Enter a valid email address"),
  ])(req, res, next);
};

// Validation for reset password
const resetPasswordValidation = (req, res, next) => {
  return Validate([
    check("email").isEmail().withMessage("Enter a valid email address"),
    check("otp")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be a 6-digit number"),
    check("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters long"),
    check("confirmPassword")
      .isLength({ min: 6 })
      .withMessage("Confirm password must be at least 6 characters long"),
  ])(req, res, next);
};

// Middleware to check for validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().reduce((acc, error) => {
      acc[error.param] = error.msg;
      return acc;
    }, {});

    return res.status(400).json({
      message: "Validation Error",
      errors: formattedErrors,
    });
  }
  next();
};

module.exports = {
  loginValidation,
  updateProfileValidation,
  updatePasswordValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  validate,
};
