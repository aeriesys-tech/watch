// routes/rolePermissionRoutes.js

const express = require("express");
const router = express.Router();
const rolePermissionController = require("../controllers/rolePermissionController");
const authMiddleware = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/permissionsMiddleware");

router.post(
  "/togglePermissionForRole",
  // authMiddleware,
  // checkPermission("role_abilities.change"),
  rolePermissionController.togglePermissionForRole
);

module.exports = router;
