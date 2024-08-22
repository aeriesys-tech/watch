const { RoleAbility } = require("../models");
const responseService = require("../services/responseService");

const togglePermissionForRole = async (req, res) => {
  const permissions = req.body; // Assuming this is the array of permissions

  try {
    // Loop through each permission object in the array
    for (const permission of permissions) {
      const { roleId, abilityId, status } = permission;

      const roleAbility = await RoleAbility.findOne({
        where: {
          role_id: roleId,
          ability_id: abilityId,
        },
      });

      if (roleAbility && !status) {
        // Permission exists and the status is false, remove it
        await roleAbility.destroy();
      } else if (!roleAbility && status) {
        // Permission doesn't exist and the status is true, assign it
        await RoleAbility.create({
          role_id: roleId,
          ability_id: abilityId,
        });
      }
    }

    return responseService.success(
      req,
      res,
      "Permissions updated successfully",
      null,
      200
    );
  } catch (error) {
    console.error("Error managing permissions for role:", error.message);
    return responseService.error(
      req,
      res,
      "Error managing permissions for role",
      {},
      500
    );
  }
};

module.exports = { togglePermissionForRole };
