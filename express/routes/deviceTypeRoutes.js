const express = require("express");
const router = express.Router();
const deviceTypeController = require("../controllers/deviceTypeController");
const authMiddleware = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/permissionsMiddleware"); // Destructure to get checkPermission

const {
  addDeviceTypeValidation,
  updateDeviceTypeValidation,
  deleteDeviceTypeValidation,
  viewDeviceTypeValidation,
  getDeviceTypesValidation,
  paginateDeviceTypesValidation,
} = require("../validations/deviceTypeValidation");

// Routes for device types
router.post(
  "/addDeviceType",
  authMiddleware,
  checkPermission("device_types.create"), // Check for create device type permission
  addDeviceTypeValidation,
  deviceTypeController.addDeviceType
);

router.post(
  "/updateDeviceType",
  authMiddleware,
  checkPermission("device_types.update"), // Check for update device type permission
  updateDeviceTypeValidation,
  deviceTypeController.updateDeviceType
);

router.post(
  "/deleteDeviceType",
  authMiddleware,
  checkPermission("device_types.delete"), // Check for delete device type permission
  deleteDeviceTypeValidation,
  deviceTypeController.deleteDeviceType
);

router.post(
  "/viewDeviceType",
  authMiddleware,
  checkPermission("device_types.view"), // Check for view device type permission
  viewDeviceTypeValidation,
  deviceTypeController.viewDeviceType
);

router.post(
  "/getDeviceTypes",
  authMiddleware,
  checkPermission("device_types.view"), // Check for view device types permission
  getDeviceTypesValidation,
  deviceTypeController.getDeviceTypes
);

router.post(
  "/paginateDeviceTypes",
  authMiddleware,
  checkPermission("device_types.view"), // Check for view device types permission
  paginateDeviceTypesValidation,
  deviceTypeController.paginateDeviceTypes
);

module.exports = router;
