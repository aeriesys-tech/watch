// controllers/rolePermissionController.js

const db = require("../models");

const assignPermissionToRole = async (req, res) => {
  const { roleId, abilityId } = req.body;

  try {
    const roleAbility = await db.RoleAbility.create({
      role_id: roleId,
      ability_id: abilityId,
    });

    res.status(201).json(roleAbility);
  } catch (error) {
    res.status(500).json({ error: "Error assigning permission to role" });
  }
};

const removePermissionFromRole = async (req, res) => {
  const { roleId, abilityId } = req.body;

  try {
    const roleAbility = await db.RoleAbility.findOne({
      where: {
        role_id: roleId,
        ability_id: abilityId,
      },
    });

    if (!roleAbility) {
      return res
        .status(404)
        .json({ error: "Permission not found for the role" });
    }

    await roleAbility.destroy();

    res
      .status(200)
      .json({ message: "Permission removed from role successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error removing permission from role" });
  }
};

module.exports = { assignPermissionToRole, removePermissionFromRole };
