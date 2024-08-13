const db = require("../models");
const fs = require("fs");
const path = require("path");

const { sendResponse } = require("../services/responseService");

// Import modules, abilities, and role abilities from JSON
const importAbilities = async (req, res) => {
  let moduleDataList = req.body;

  if (!moduleDataList.length) {
    // Check if body is empty
    const filePath = path.join(__dirname, "../data/abilities.json");

    try {
      // Read the file
      const fileData = fs.readFileSync(filePath);
      moduleDataList = JSON.parse(fileData);
    } catch (error) {
      console.error("Error reading or parsing JSON file:", error);
      return sendResponse(res, 500, "Error reading or parsing JSON file");
    }
  }

  try {
    for (const moduleData of moduleDataList) {
      // Find or create module
      let module = await db.Module.findOne({
        where: { module: moduleData.module },
      });
      if (!module) {
        module = await db.Module.create({ module: moduleData.module });
      }

      for (const abilityData of moduleData.abilities) {
        // Find or create ability
        let ability = await db.Ability.findOne({
          where: { ability: abilityData.ability },
        });
        if (!ability) {
          ability = await db.Ability.create({
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
          await db.RoleAbility.findOrCreate({
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

    sendResponse(res, 200, "Abilities imported successfully");
  } catch (error) {
    console.error("Error importing abilities:", error);
    sendResponse(res, 500, "Internal Server Error");
  }
};

// Change the status of the role ability
const changeAbility = async (req, res) => {
  const { role_ability_id, status } = req.body;
  try {
    const roleAbility = await db.RoleAbility.findByPk(role_ability_id);
    if (roleAbility) {
      roleAbility.status = status;
      await roleAbility.save();
      res
        .status(200)
        .json({ message: "Role ability status changed successfully" });
    } else {
      res.status(404).json({ error: "Role ability not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all abilities with role ability status
// const getAbilities = async (req, res) => {
//   try {
//     const abilities = await db.Ability.findAll({
//       include: [
//         {
//           model: db.Module,
//           as: "module",
//         },
//         // {
//         //   model: db.RoleAbility,
//         //   as: "roleAbilities",
//         // },
//       ],
//     });
//     res.status(200).json(abilities);
//   } catch (error) {
//     console.error("Error fetching abilities:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

const getAbilities = async (req, res) => {
  const { role_id } = req.query; // Expecting role_id to be passed as a query parameter

  try {
    // Fetch all abilities and populate the module data
    const abilities = await db.Ability.findAll({
      attributes: {
        exclude: ["created_at", "updated_at"],
      },
      include: [
        {
          model: db.Module,
          as: "module",
          attributes: {
            exclude: ["created_at", "updated_at"],
          },
        },
      ],
    });

    // Log fetched abilities for debugging
    console.log("Fetched abilities:", abilities);

    // Prepare to collect role abilities status if role_id is provided
    let roleAbilitiesStatus = {};
    if (role_id) {
      const roleAbilities = await db.RoleAbility.findAll({
        where: { role_id },
      });

      // Log fetched role abilities for debugging
      console.log("Fetched role abilities:", roleAbilities);

      roleAbilities.forEach((ra) => {
        // Ensure accurate comparison by converting to string
        if (ra.ability_id) {
          roleAbilitiesStatus[ra.ability_id.toString()] = true;
        }
      });
    }

    // Group abilities by modules
    const groupedByModules = abilities.reduce((acc, ability) => {
      if (!ability.ability_id || !ability.module || !ability.module.module_id) {
        console.error("Invalid ability data:", ability);
        return acc;
      }

      const moduleName = ability.module.module;

      // Prepare ability object including status
      const abilityData = {
        _id: ability.ability_id.toString(), // Ensure consistent ID format
        ability: ability.ability,
        description: ability.description,
        status: roleAbilitiesStatus[ability.ability_id.toString()] || false, // Check status
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

    // Log grouped abilities by modules for debugging
    console.log("Grouped by modules:", groupedByModules);

    const modulesArray = Object.values(groupedByModules);

    res.status(200).json({
      success: true,
      count: modulesArray.length,
      data: modulesArray,
    });
  } catch (error) {
    console.error("Error fetching abilities:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  importAbilities,
  changeAbility,
  getAbilities,
};
