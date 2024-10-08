const express = require("express");
const router = express.Router();
const roleAbilityRoutes = require("./roleAbilityRoutes");
const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");
const roleRoutes = require("./roleRoutes");
const rolePermissionRoutes = require("./rolePermissionRoutes");
const deviceTypeRoutes = require("./deviceTypeRoutes");
const unitRoutes = require("./unitRoutes");
const checkGroupRoutes = require("./checkGroupRoutes");
const clientRoutes = require("./clientRoutes");
const clientUserRoutes = require("./clientUserRoutes");
const checkParameterRoutes = require("./checkParameterRoutes");
const deviceRoutes = require("./deviceRoutes");
const deviceUserRoutes = require("./deviceUserRoutes");
const subscriberRoutes = require("./subscriberRoutes");
const userCheckParameterRoutes = require("./userCheckParameterRoutes")

// Use user routes
router.use("/users", userRoutes);
router.use("/roleAbilities", roleAbilityRoutes);
router.use("/auth", authRoutes);
router.use("/roles", roleRoutes);
router.use("/rolePermissions", rolePermissionRoutes);
router.use("/deviceType", deviceTypeRoutes);
router.use("/unit", unitRoutes);
router.use("/checkGroup", checkGroupRoutes);
router.use("/client", clientRoutes);
router.use("/clientUser", clientUserRoutes);
router.use("/checkParamter", checkParameterRoutes);
router.use("/device", deviceRoutes);
router.use("/deviceUser", deviceUserRoutes);
router.use("/subscriber", subscriberRoutes);
router.use("/userCheckParameter", userCheckParameterRoutes);

module.exports = router;
