// module.exports = (sequelize, DataTypes) => {
//   const Role = sequelize.define(
//     "Role",
//     {
//       role_id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//       },
//       role: {
//         type: DataTypes.STRING(100),
//         allowNull: false,
//       },
//       status: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: true,
//       },
//       created_at: {
//         type: DataTypes.DATE,
//         allowNull: true,
//       },
//       updated_at: {
//         type: DataTypes.DATE,
//         allowNull: true,
//       },
//       deleted_at: {
//         type: DataTypes.DATE,
//         allowNull: true,
//       },
//     },
//     {
//       timestamps: true,
//       paranoid: true,
//       underscored: true,
//       createdAt: "created_at",
//       updatedAt: "updated_at",
//       deletedAt: "deleted_at",
//     }
//   );

//   Role.associate = (models) => {
//     Role.hasMany(models.User, {
//       foreignKey: "role_id",
//     });
//   };

//   return Role;
// };
// models/Role.js
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
    {
      role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      role: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      indexes: [
        {
          unique: true,
          fields: ["role"],
        },
      ],
    }
  );

  Role.associate = (models) => {
    Role.hasMany(models.User, {
      foreignKey: "role_id",
    });
    Role.hasMany(models.RoleAbility, {
      foreignKey: "role_id",
      as: "roleAbilities", // Alias used for the association
    });
  };

  return Role;
};
