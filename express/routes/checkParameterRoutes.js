const express = require("express");
const router = express.Router();
const checkParametersController = require("../controllers/checkParameterController");
const authMiddleware = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/permissionsMiddleware");
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
  checkPermission("check_parameters.create"),
  addCheckParametersValidation,
  checkParametersController.addCheckParameter
);

router.post(
  "/updateCheckParameters",
  authMiddleware,
  checkPermission("check_parameters.update"),
  updateCheckParametersValidation,
  checkParametersController.updateCheckParameter
);

router.post(
  "/deleteCheckParameters",
  authMiddleware,
  checkPermission("check_parameters.delete"),
  deleteCheckParametersValidation,
  checkParametersController.deleteCheckParameter
);

router.post(
  "/viewCheckParameters",
  authMiddleware,
  checkPermission("check_parameters.view"),
  viewCheckParametersValidation,
  checkParametersController.viewCheckParameter
);

router.post(
  "/getCheckParameters",
  authMiddleware,
  checkPermission("check_parameters.view"),
  checkParametersController.getCheckParameters
);

router.post(
  "/paginateCheckParameters",
  authMiddleware,
  checkPermission("check_parameters.view"),
  paginateCheckParametersValidation,
  checkParametersController.paginateCheckParameters
);

module.exports = router;
