const express = require("express");
const router = express.Router();
const roleAbilityController = require("../controllers/roleAbilityController");
const authMiddleware = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/permissionsMiddleware");

// Routes for role abilities
router.post(
  "/importAbilities",
  // authMiddleware,
  // checkPermission("role_abilities.import"),
  roleAbilityController.importAbilities
);
router.post(
  "/changeAbility",
  authMiddleware,
  roleAbilityController.changeAbility
);
router.post(
  "/getAbilities",
  // authMiddleware,
  // checkPermission("role_abilities.view"),
  roleAbilityController.getAbilities
);

module.exports = router;
