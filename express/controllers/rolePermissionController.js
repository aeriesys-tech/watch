const db = require("../models");
const { sendResponse } = require("../services/responseService");

const togglePermissionForRole = async (req, res) => {
  const { roleId, abilityId } = req.body;

  try {
    const roleAbility = await db.RoleAbility.findOne({
      where: {
        role_id: roleId,
        ability_id: abilityId,
      },
    });

    if (roleAbility) {
      // Permission exists, remove it
      await roleAbility.destroy();
      sendResponse(res, 200, true, "Permission removed from role successfully");
    } else {
      // Permission doesn't exist, assign it
      const newRoleAbility = await db.RoleAbility.create({
        role_id: roleId,
        ability_id: abilityId,
      });
      sendResponse(res, 201, true, "Permission assigned to role successfully", {
        newRoleAbility,
      });
    }
  } catch (error) {
    sendResponse(res, 500, false, "Error managing permission for role");
  }
};

module.exports = { togglePermissionForRole };
