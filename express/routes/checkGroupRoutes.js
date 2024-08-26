const express = require("express");
const router = express.Router();
const checkGroupController = require("../controllers/checkGroupController");
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
  addCheckGroupValidation,
  checkGroupController.addCheckGroup
);

router.post(
  "/updateCheckGroup",
  authMiddleware,
  updateCheckGroupValidation,
  checkGroupController.updateCheckGroup
);

router.post(
  "/deleteCheckGroup",
  authMiddleware,
  deleteCheckGroupValidation,
  checkGroupController.deleteCheckGroup
);

router.post(
  "/viewCheckGroup",
  authMiddleware,
  viewCheckGroupValidation,
  checkGroupController.viewCheckGroup
);

router.post(
  "/getCheckGroups",
  authMiddleware,
  checkGroupController.getCheckGroups
);

router.post(
  "/paginateCheckGroup",
  authMiddleware,
  paginateCheckGroupsValidation,
  checkGroupController.paginateCheckGroups
);

module.exports = router;
