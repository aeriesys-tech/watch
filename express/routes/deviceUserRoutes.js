const express = require("express");
const router = express.Router();
const deviceUserController = require("../controllers/deviceUserController");
const authMiddleware = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/permissionsMiddleware");
const {
  addDeviceUserValidation,
  updateDeviceUserValidation,
  deleteDeviceUserValidation,
  viewDeviceUserValidation,
  paginateDeviceUsersValidation,
} = require("../validations/deviceUserValidation");

// Routes
router.post(
  "/addDeviceUser",
  authMiddleware,
  addDeviceUserValidation,
  checkPermission("device_users.create"),
  deviceUserController.addDeviceUser
);
router.post(
  "/addDeviceUserWithCheckParameters",
  // authMiddleware,
  // addDeviceUserValidation,
  // checkPermission("device_users.create"),
  deviceUserController.addDeviceUserWithCheckParameters
);



router.post(
  "/updateDeviceUser",
  authMiddleware,
  updateDeviceUserValidation,
  checkPermission("device_users.update"),
  deviceUserController.updateDeviceUser
);

router.post(
  "/deleteDeviceUser",
  authMiddleware,
  deleteDeviceUserValidation,
  checkPermission("device_users.delete"),
  deviceUserController.deleteDeviceUser
);

router.post(
  "/viewDeviceUser",
  authMiddleware,
  viewDeviceUserValidation,
  checkPermission("device_users.view"),
  deviceUserController.viewDeviceUser
);

router.post(
  "/getDeviceUsers",
  authMiddleware,
  checkPermission("device_users.view"),
  deviceUserController.getDeviceUsers
);

router.post(
  "/paginateDeviceUsers",
  authMiddleware,
  paginateDeviceUsersValidation,
  checkPermission("device_users.view"),
  deviceUserController.paginateDeviceUsers
);

module.exports = router;
