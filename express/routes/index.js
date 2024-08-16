const express = require("express");
const router = express.Router();
const roleAbilityRoutes = require("./roleAbilityRoutes");
const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");
const roleRoutes = require("./roleRoutes");
const rolePermissionRoutes = require("./rolePermissionRoutes");
const deviceTypeRoutes = require("./deviceTypeRoutes");
const unitRoutes = require("./unitRoutes");

// Use user routes
router.use("/users", userRoutes);
router.use("/roleAbilities", roleAbilityRoutes);
router.use("/auth", authRoutes);
router.use("/roles", roleRoutes);
router.use("/rolePermissions", rolePermissionRoutes);
router.use("/deviceType", deviceTypeRoutes);
router.use("/unit", unitRoutes);
module.exports = router;
