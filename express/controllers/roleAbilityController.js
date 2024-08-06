const db = require("../models");
const fs = require("fs");
const path = require("path");

// Import modules, abilities, and role abilities from JSON
const importAbilities = async (req, res) => {
  let moduleDataList = req.body;
  if (!moduleDataList.length) {
    // Check if body is empty
    // Path to your JSON file
    const filePath = path.join(__dirname, "../data/abilities.json");
    // Read the file
    const fileData = fs.readFileSync(filePath);
    moduleDataList = JSON.parse(fileData);
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

    res.status(200).json({ message: "Abilities imported successfully" });
  } catch (error) {
    console.error("Error importing abilities:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
const getAbilities = async (req, res) => {
  try {
    const abilities = await db.Ability.findAll({
      include: [
        {
          model: db.Module,
          as: "module",
        },
        {
          model: db.RoleAbility,
          as: "roleAbilities",
        },
      ],
    });
    res.status(200).json(abilities);
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
