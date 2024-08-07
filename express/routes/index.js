const express = require("express");
const router = express.Router();
const roleAbilityRoutes = require("./roleAbilityRoutes");
const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");
const roleRoutes = require("./roleRoutes");
const rolePermissionRoutes = require("./rolePermissionRoutes");

// Use user routes
router.use("/users", userRoutes);
router.use("/roleAbilities", roleAbilityRoutes);
router.use("/auth", authRoutes);
router.use("/roles", roleRoutes);
router.use("/rolePermissions", rolePermissionRoutes);
module.exports = router;
