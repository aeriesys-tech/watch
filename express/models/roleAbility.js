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
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "roles", // Adjust to the pluralized table name
          key: "role_id",
        },
      },
      ability_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "abilities", // Adjust to the pluralized table name
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
      as: "role",
    });
    RoleAbility.belongsTo(models.Ability, {
      foreignKey: "ability_id",
      as: "ability",
    });
  };

  return RoleAbility;
};
