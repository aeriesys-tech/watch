// module.exports = (sequelize, DataTypes) => {
//     const UserCheckParameter = sequelize.define(
//         "UserCheckParameter",
//         {
//             user_check_parameter_id: {
//                 type: DataTypes.INTEGER,
//                 primaryKey: true,
//                 autoIncrement: true,
//             },
//             device_user_id: {
//                 type: DataTypes.INTEGER,
//                 allowNull: false,
//                 references: {
//                     model: "DeviceUser",
//                     key: "device_user_id",
//                 },
//             },
//             check_parameter_id: {
//                 type: DataTypes.INTEGER,
//                 allowNull: false,
//                 references: {
//                     model: "CheckParameter",
//                     key: "check_parameter_id",
//                 },
//             },
//             created_at: {
//                 type: DataTypes.DATE,
//                 allowNull: true,
//             },
//             updated_at: {
//                 type: DataTypes.DATE,
//                 allowNull: true,
//             },
//         },
//         {
//             tableName: "user_check_parameters",
//             timestamps: true,
//             underscored: true,
//             createdAt: "created_at",
//             updatedAt: "updated_at",
//         }
//     );

//     UserCheckParameter.associate = (models) => {
//         UserCheckParameter.belongsTo(models.DeviceUser, {
//             foreignKey: "device_user_id",
//             as: "deviceUsers",
//         });
//         UserCheckParameter.belongsTo(models.CheckParameter, {
//             foreignKey: "check_parameter_id",
//             as: "checkParameter",
//         });
//         // Association with Transaction
//         UserCheckParameter.hasMany(models.Transaction, {
//             foreignKey: "device_user_id",
//             as: "transaction",
//         });

//     };

//     return UserCheckParameter;
// };
module.exports = (sequelize, DataTypes) => {
    const UserCheckParameter = sequelize.define(
        "UserCheckParameter",
        {
            user_check_parameter_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            device_user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "DeviceUser",
                    key: "device_user_id",
                },
            },
            check_parameter_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "CheckParameter",
                    key: "check_parameter_id",
                },
            },
            status: {
                type: DataTypes.BOOLEAN, // Changed to BOOLEAN
                allowNull: false,
                defaultValue: true, // Default status is 'active' (true)
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
            tableName: "user_check_parameters",
            timestamps: true,
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );

    UserCheckParameter.associate = (models) => {
        UserCheckParameter.belongsTo(models.DeviceUser, {
            foreignKey: "device_user_id",
            as: "deviceUsers",
        });
        UserCheckParameter.belongsTo(models.CheckParameter, {
            foreignKey: "check_parameter_id",
            as: "checkParameter",
        });
        // Association with Transaction
        UserCheckParameter.hasMany(models.Transaction, {
            foreignKey: "device_user_id",
            as: "transaction",
        });
    };

    return UserCheckParameter;
};
