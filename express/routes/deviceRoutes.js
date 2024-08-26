const express = require("express");
const router = express.Router();
const deviceController = require("../controllers/deviceController");
const authMiddleware = require("../middleware/authMiddleware");
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
  deviceController.addDevice
);

router.post(
  "/updateDevice",
  authMiddleware,
  updateDeviceValidation,
  deviceController.updateDevice
);

router.post(
  "/deleteDevice",
  authMiddleware,
  deleteDeviceValidation,
  deviceController.deleteDevice
);

router.post(
  "/viewDevice",
  authMiddleware,
  viewDeviceValidation,
  deviceController.viewDevice
);

router.post("/getDevices", authMiddleware, deviceController.getDevices);

router.post(
  "/paginateDevices",
  authMiddleware,
  paginateDeviceValidation,
  deviceController.paginateDevices
);

module.exports = router;
