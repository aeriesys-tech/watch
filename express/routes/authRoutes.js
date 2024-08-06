const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  loginValidation,
  updateProfileValidation,
  updatePasswordValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require("../validations/authValidation");
const { Validate } = require("../middleware/validationMiddleware");

router.post(
  "/login",

  loginValidation,
  authController.login
);
router.post(
  "/updateProfile",
  updateProfileValidation,
  authMiddleware,
  authController.updateProfile
);
router.post(
  "/updatePassword",
  updatePasswordValidation,
  authMiddleware,
  authController.updatePassword
);
router.post(
  "/forgotPassword",
  forgotPasswordValidation,
  authController.forgotPassword
);
router.post(
  "/resetPassword",
  resetPasswordValidation,
  authController.resetPassword
);
router.post("/me", authMiddleware, authController.me);
router.post("/logout", authMiddleware, authController.logout);

module.exports = router;
