const express = require("express");
const router = express.Router();
const deviceUserController = require("../controllers/deviceUserController");
const authMiddleware = require("../middleware/authMiddleware");
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
  deviceUserController.addDeviceUser
);

router.post(
  "/updateDeviceUser",
  authMiddleware,
  updateDeviceUserValidation,
  deviceUserController.updateDeviceUser
);

router.post(
  "/deleteDeviceUser",
  authMiddleware,
  deleteDeviceUserValidation,
  deviceUserController.deleteDeviceUser
);

router.post(
  "/viewDeviceUser",
  authMiddleware,
  viewDeviceUserValidation,
  deviceUserController.viewDeviceUser
);

router.post(
  "/getDeviceUsers",
  authMiddleware,
  deviceUserController.getDeviceUsers
);

router.post(
  "/paginateDeviceUsers",
  authMiddleware,
  paginateDeviceUsersValidation,
  deviceUserController.paginateDeviceUsers
);

module.exports = router;
