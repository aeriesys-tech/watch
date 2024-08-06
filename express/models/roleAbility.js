// module.exports = (sequelize, DataTypes) => {
//   const RoleAbility = sequelize.define(
//     "RoleAbility",
//     {
//       role_id: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//         references: {
//           model: "Role", // Ensure the model name matches the defined model
//           key: "role_id",
//         },
//       },
//       ability_id: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//         references: {
//           model: "Ability", // Ensure the model name matches the defined model
//           key: "ability_id",
//         },
//       },
//       created_at: {
//         type: DataTypes.DATE,
//         allowNull: true,
//       },
//       updated_at: {
//         type: DataTypes.DATE,
//         allowNull: true,
//       },
//     },
//     {
//       timestamps: true,
//       underscored: true,
//     }
//   );

//   RoleAbility.associate = (models) => {
//     RoleAbility.belongsTo(models.Role, {
//       foreignKey: "role_id",
//       as: "role", // Alias to be used in queries
//     });
//     RoleAbility.belongsTo(models.Ability, {
//       foreignKey: "ability_id",
//       as: "ability", // Alias to be used in queries
//     });
//   };

//   return RoleAbility;
// };
// models/RoleAbility.js
module.exports = (sequelize, DataTypes) => {
  const RoleAbility = sequelize.define(
    "RoleAbility",
    {
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Role", // Ensure the model name matches the defined model
          key: "role_id",
        },
      },
      ability_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Ability", // Ensure the model name matches the defined model
          key: "ability_id",
        },
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ["role_id", "ability_id"],
        },
      ],
    }
  );

  RoleAbility.associate = (models) => {
    RoleAbility.belongsTo(models.Role, {
      foreignKey: "role_id",
      as: "role", // Alias used for the association
    });
    RoleAbility.belongsTo(models.Ability, {
      foreignKey: "ability_id",
      as: "ability", // Alias used for the association
    });
  };

  return RoleAbility;
};
