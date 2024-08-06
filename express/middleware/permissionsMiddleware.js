const db = require("../models");

const checkPermission = (requiredAbility) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id; // Assuming req.user is set after authentication middleware

      // Fetch user's roles and their abilities
      const user = await db.User.findOne({
        where: { user_id: userId },
        include: [
          {
            model: db.Role,
            include: [
              {
                model: db.RoleAbility,
                as: "roleAbilities",
                include: [
                  {
                    model: db.Ability,
                    as: "ability",
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!user || !user.Role || !user.Role.roleAbilities) {
        return res
          .status(403)
          .json({ message: "Access Denied: No roles found for the user" });
      }

      // Check if any of the roles have the required ability
      const hasPermission = user.Role.roleAbilities.some(
        (roleAbility) => roleAbility.ability.ability === requiredAbility
      );

      if (!hasPermission) {
        return res.status(403).json({
          message:
            "Access Denied: You do not have permission to perform this action",
        });
      }

      next();
    } catch (error) {
      console.error("Permission check error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
};

module.exports = { checkPermission };
