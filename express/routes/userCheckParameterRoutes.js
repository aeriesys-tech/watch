const express = require("express");
const router = express.Router();
const userCheckParameterController = require("../controllers/userCheckParameterController");
const authMiddleware = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/permissionsMiddleware");

const {
    addUserCheckParameterValidation,
    updateUserCheckParameterValidation,
    deleteUserCheckParameterValidation,
    viewUserCheckParameterValidation,
    getUserCheckParametersValidation,
    paginateUserCheckParametersValidation,
} = require("../validations/userCheckParameterValidation");

// Routes for user check parameters
router.post(
    "/addUserCheckParameter",
    authMiddleware,
    checkPermission("user_check_parameters.create"), // Check for create user check parameter permission
    addUserCheckParameterValidation,
    userCheckParameterController.addUserCheckParameter
);

router.post(
    "/updateUserCheckParameter",
    authMiddleware,
    checkPermission("user_check_parameters.update"), // Check for update user check parameter permission
    updateUserCheckParameterValidation,
    userCheckParameterController.updateUserCheckParameter
);

router.post(
    "/deleteUserCheckParameter",
    authMiddleware,
    checkPermission("user_check_parameters.delete"), // Check for delete user check parameter permission
    deleteUserCheckParameterValidation,
    userCheckParameterController.deleteUserCheckParameter
);

router.post(
    "/viewUserCheckParameter",
    authMiddleware,
    checkPermission("user_check_parameters.view"), // Check for view user check parameter permission
    viewUserCheckParameterValidation,
    userCheckParameterController.viewUserCheckParameter
);

router.post(
    "/getUserCheckParameters",
    authMiddleware,
    checkPermission("user_check_parameters.view"), // Check for view user check parameters permission
    getUserCheckParametersValidation,
    userCheckParameterController.getUserCheckParameters
);

router.post(
    "/paginateUserCheckParameters",
    authMiddleware,
    checkPermission("user_check_parameters.view"), // Check for view user check parameters permission
    paginateUserCheckParametersValidation,
    userCheckParameterController.paginateUserCheckParameters
);

module.exports = router;
