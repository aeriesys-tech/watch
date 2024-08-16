const { Module, Ability, RoleAbility } = require("../models");
const fs = require("fs");
const path = require("path");
const responseService = require("../services/responseService");

// Import modules, abilities, and role abilities from JSON
const importAbilities = async (req, res) => {
  let moduleDataList = req.body;

  if (!moduleDataList.length) {
    const filePath = path.join(__dirname, "../data/abilities.json");

    try {
      const fileData = fs.readFileSync(filePath);
      moduleDataList = JSON.parse(fileData);
    } catch (error) {
      console.error("Error reading or parsing JSON file:", error.message);
      return responseService.error(req, res, "Error reading or parsing JSON file", {}, 500);
    }
  }

  try {
    for (const moduleData of moduleDataList) {
      // Find or create module
      let module = await Module.findOne({
        where: { module: moduleData.module },
      });
      if (!module) {
        module = await Module.create({ module: moduleData.module });
      }

      for (const abilityData of moduleData.abilities) {
        // Find or create ability
        let ability = await Ability.findOne({
          where: { ability: abilityData.ability },
        });
        if (!ability) {
          ability = await Ability.create({
            ability: abilityData.ability,
            description: abilityData.description,
            module_id: module.module_id,
          });
        } else {
          ability.description = abilityData.description;
          ability.module_id = module.module_id;
          await ability.save();
        }

        // Update or create role abilities if role_id is provided
        if (abilityData.role_id) {
          await RoleAbility.findOrCreate({
            where: {
              role_id: abilityData.role_id,
              ability_id: ability.ability_id,
            },
            defaults: {
              role_id: abilityData.role_id,
              ability_id: ability.ability_id,
            },
          });
        }
      }
    }

    return responseService.success(req, res, "Abilities imported successfully", null, 200);
  } catch (error) {
    console.error("Error importing abilities:", error.message);
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};

// Change the status of the role ability
const changeAbility = async (req, res) => {
  const { role_ability_id, status } = req.body;
  try {
    const roleAbility = await RoleAbility.findByPk(role_ability_id);
    if (roleAbility) {
      roleAbility.status = status;
      await roleAbility.save();
      return responseService.success(req, res, "Role ability status changed successfully", roleAbility, 200);
    } else {
      return responseService.error(req, res, "Role ability not found", {}, 404);
    }
  } catch (error) {
    console.error("Error in changeAbility function:", error.message);
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};

// Get all abilities with role ability status
const getAbilities = async (req, res) => {
  const { role_id } = req.query;

  try {
    const abilities = await Ability.findAll({
      attributes: {
        exclude: ["created_at", "updated_at"],
      },
      include: [
        {
          model: Module,
          as: "module",
          attributes: {
            exclude: ["created_at", "updated_at"],
          },
        },
      ],
    });

    console.log("Fetched abilities:", abilities);

    let roleAbilitiesStatus = {};
    if (role_id) {
      const roleAbilities = await RoleAbility.findAll({
        where: { role_id },
      });

      console.log("Fetched role abilities:", roleAbilities);

      roleAbilities.forEach((ra) => {
        if (ra.ability_id) {
          roleAbilitiesStatus[ra.ability_id.toString()] = true;
        }
      });
    }

    const groupedByModules = abilities.reduce((acc, ability) => {
      if (!ability.ability_id || !ability.module || !ability.module.module_id) {
        console.error("Invalid ability data:", ability);
        return acc;
      }

      const moduleName = ability.module.module;

      const abilityData = {
        _id: ability.ability_id.toString(),
        ability: ability.ability,
        description: ability.description,
        status: roleAbilitiesStatus[ability.ability_id.toString()] || false,
      };

      if (!acc[moduleName]) {
        acc[moduleName] = {
          module_id: ability.module.module_id.toString(),
          module_name: moduleName,
          abilities: [],
        };
      }

      acc[moduleName].abilities.push(abilityData);

      return acc;
    }, {});

    console.log("Grouped by modules:", groupedByModules);

    const modulesArray = Object.values(groupedByModules);

    return responseService.success(req, res, "Abilities fetched successfully", {
      success: true,
      count: modulesArray.length,
      data: modulesArray,
    });
  } catch (error) {
    console.error("Error fetching abilities:", error.message);
    return responseService.error(req, res, "Internal Server Error", {}, 500);
  }
};

module.exports = {
  importAbilities,
  changeAbility,
  getAbilities,
};
