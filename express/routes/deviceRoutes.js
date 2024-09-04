const express = require("express");
const router = express.Router();
const deviceController = require("../controllers/deviceController");
const authMiddleware = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/permissionsMiddleware");
const {
  addDeviceValidation,
  updateDeviceValidation,
  deleteDeviceValidation,
  viewDeviceValidation,
  paginateDeviceValidation,
} = require("../validations/deviceValidation");

// Routes
router.post(
  "/addDevice",
  authMiddleware,
  addDeviceValidation,
  checkPermission("devices.create"),
  deviceController.addDevice
);

router.post(
  "/updateDevice",
  authMiddleware,
  updateDeviceValidation,
  checkPermission("devices.update"),
  deviceController.updateDevice
);

router.post(
  "/deleteDevice",
  authMiddleware,
  deleteDeviceValidation,
  checkPermission("devices.delete"),
  deviceController.deleteDevice
);

router.post(
  "/viewDevice",
  authMiddleware,
  viewDeviceValidation,
  checkPermission("devices.view"),
  deviceController.viewDevice
);

router.post(
  "/getDevices",
  authMiddleware,
  checkPermission("devices.view"),
  deviceController.getDevices
);

router.post(
  "/paginateDevices",
  authMiddleware,
  paginateDeviceValidation,
  checkPermission("devices.view"),
  deviceController.paginateDevices
);

router.post(
  "/getClientDevices",
  authMiddleware,
  checkPermission("devices.view"),
  deviceController.getClientDevices
);


module.exports = router;
