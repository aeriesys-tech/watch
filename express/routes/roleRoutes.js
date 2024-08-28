const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");
const authMiddleware = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/permissionsMiddleware"); // Destructure to get checkPermission

const {
  addRoleValidation,
  updateRoleValidation,
  deleteRoleValidation,
  viewRoleValidation,
  getRolesValidation,
  paginateRolesValidation,
} = require("../validations/roleValidation");

// Routes for roles
router.post(
  "/addRole",
  authMiddleware,
  checkPermission("roles.create"), // Check for create role permission
  addRoleValidation,
  roleController.addRole
);

router.post(
  "/updateRole",
  authMiddleware,
  checkPermission("roles.update"), // Check for update role permission
  updateRoleValidation,
  roleController.updateRole
);

router.post(
  "/deleteRole",
  authMiddleware,
  checkPermission("roles.delete"), // Check for delete role permission
  deleteRoleValidation,
  roleController.deleteRole
);

router.post(
  "/viewRole",
  // authMiddleware,
  // checkPermission("roles.view"), // Check for view role permission
  viewRoleValidation,
  roleController.viewRole
);

router.post(
  "/getRoles",
  // authMiddleware,
  // checkPermission("roles.view"), // Check for view roles permission
  getRolesValidation,
  roleController.getRoles
);

router.post(
  "/paginateRoles",
  // authMiddleware,
  // checkPermission("roles.view"), // Check for view roles permission
  paginateRolesValidation,
  roleController.paginateRoles
);

module.exports = router;
