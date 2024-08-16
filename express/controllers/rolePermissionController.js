const { RoleAbility } = require("../models");
const responseService = require("../services/responseService");

const togglePermissionForRole = async (req, res) => {
  const { roleId, abilityId } = req.body;

  try {
    const roleAbility = await RoleAbility.findOne({
      where: {
        role_id: roleId,
        ability_id: abilityId,
      },
    });

    if (roleAbility) {
      // Permission exists, remove it
      await roleAbility.destroy();
      return responseService.success(req, res, "Permission removed from role successfully", null, 200);
    } else {
      // Permission doesn't exist, assign it
      const newRoleAbility = await RoleAbility.create({
        role_id: roleId,
        ability_id: abilityId,
      });
      return responseService.success(req, res, "Permission assigned to role successfully", newRoleAbility, 201);
    }
  } catch (error) {
    console.error("Error managing permission for role:", error.message);
    return responseService.error(req, res, "Error managing permission for role", {}, 500);
  }
};

module.exports = { togglePermissionForRole };
