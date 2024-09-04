const express = require("express");
const router = express.Router();
const checkGroupController = require("../controllers/checkGroupController");

const { checkPermission } = require("../middleware/permissionsMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const {
  addCheckGroupValidation,
  updateCheckGroupValidation,
  deleteCheckGroupValidation,
  viewCheckGroupValidation,
  paginateCheckGroupsValidation,
} = require("../validations/checkGroupValidation");

// Routes
router.post(
  "/addCheckGroup",
  authMiddleware,
  checkPermission("check_groups.create"),
  addCheckGroupValidation,
  checkGroupController.addCheckGroup
);

router.post(
  "/updateCheckGroup",
  authMiddleware,
  checkPermission("check_groups.update"),
  updateCheckGroupValidation,
  checkGroupController.updateCheckGroup
);

router.post(
  "/deleteCheckGroup",
  authMiddleware,
  checkPermission("check_groups.delete"),
  deleteCheckGroupValidation,
  checkGroupController.deleteCheckGroup
);

router.post(
  "/viewCheckGroup",
  authMiddleware,
  checkPermission("check_groups.view"),
  viewCheckGroupValidation,
  checkGroupController.viewCheckGroup
);

router.post(
  "/getCheckGroups",
  authMiddleware,
  checkPermission("check_groups.view"),
  checkGroupController.getCheckGroups
);

router.post(
  "/paginateCheckGroup",
  authMiddleware,
  checkPermission("check_groups.view"),
  paginateCheckGroupsValidation,
  checkGroupController.paginateCheckGroups
);

module.exports = router;
