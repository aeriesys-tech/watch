const express = require("express");
const router = express.Router();
const roleAbilityController = require("../controllers/roleAbilityController");
const authMiddleware = require("../middleware/authMiddleware");

// Routes for role abilities
router.post(
  "/importAbilities",
  authMiddleware,
  roleAbilityController.importAbilities
);
router.post(
  "/changeAbility",
  authMiddleware,
  roleAbilityController.changeAbility
);
router.post(
  "/getAbilities",
  authMiddleware,
  roleAbilityController.getAbilities
);

module.exports = router;
