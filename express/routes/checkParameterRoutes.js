const express = require("express");
const router = express.Router();
const checkParametersController = require("../controllers/checkParameterController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  addCheckParametersValidation,
  updateCheckParametersValidation,
  deleteCheckParametersValidation,
  viewCheckParametersValidation,
  paginateCheckParametersValidation,
} = require("../validations/checkParamterValidation");

// Routes
router.post(
  "/addCheckParameters",
  authMiddleware,
  addCheckParametersValidation,
  checkParametersController.addCheckParameter
);

router.post(
  "/updateCheckParameters",
  authMiddleware,
  updateCheckParametersValidation,
  checkParametersController.updateCheckParameter
);

router.post(
  "/deleteCheckParameters",
  authMiddleware,
  deleteCheckParametersValidation,
  checkParametersController.deleteCheckParameter
);

router.post(
  "/viewCheckParameters",
  authMiddleware,
  viewCheckParametersValidation,
  checkParametersController.viewCheckParameter
);

router.post(
  "/getCheckParameters",
  authMiddleware,
  checkParametersController.getCheckParameters
);

router.post(
  "/paginateCheckParameters",
  authMiddleware,
  paginateCheckParametersValidation,
  checkParametersController.paginateCheckParameters
);

module.exports = router;
