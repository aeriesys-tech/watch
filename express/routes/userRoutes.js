const express = require("express");
const router = express.Router();

const {
  addUserValidation,
  updateUserValidation,
  deleteUserValidation,
  viewUserValidation,
  paginateUsersValidation,
} = require("../validations/userValidation");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/permissionsMiddleware");

router.post(
  "/addUser",
  // authMiddleware,

  // checkPermission("users.create"),
  // addUserValidation,
  userController.addUser
);
router.post(
  "/updateUser",
  authMiddleware,

  checkPermission("users.update"),
  updateUserValidation,
  userController.updateUser
);
router.post(
  "/deleteUser",
  authMiddleware,
  checkPermission("users.delete"),
  deleteUserValidation,
  userController.deleteUser
);
router.post(
  "/viewUser",
  authMiddleware,
  checkPermission("users.view"),
  viewUserValidation,
  userController.viewUser
);
router.post("/getUsers", authMiddleware, userController.getUsers);
router.post(
  "/paginateUsers",
  authMiddleware,
  checkPermission("users.view"),
  paginateUsersValidation,
  userController.paginateUsers
);

module.exports = router;
