// routes/rolePermissionRoutes.js

const express = require("express");
const router = express.Router();
const rolePermissionController = require("../controllers/rolePermissionController");
const authMiddleware = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/permissionsMiddleware");

// Route to assign permission to role
router.post(
  "/assignPermissionToRole",
  authMiddleware,
  //   checkPermission("permissions.assign"),
  rolePermissionController.assignPermissionToRole
);

router.post(
  "/removePermissionFromRole",
  authMiddleware,
  //   checkPermission("permissions.remove"),
  rolePermissionController.removePermissionFromRole
);

module.exports = router;
