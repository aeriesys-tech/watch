module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define(
        "Transaction",
        {
            transaction_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            device_user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "DeviceUser", // Ensure this matches the model name in your setup
                    key: "device_user_id",
                },
            },
            client_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Client", // Ensure this matches the model name in your setup
                    key: "client_id",
                },
            },
            device_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Device", // Ensure this matches the model name in your setup
                    key: "device_id",
                },
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "User", // Ensure this matches the model name in your setup
                    key: "user_id",
                },
            },
            timestamp: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            check_parameter_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "CheckParameter", // Ensure this matches the model name in your setup
                    key: "check_parameter_id",
                },
            },
            value: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true, // Set the default value if needed
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
            tableName: "transactions",
            timestamps: true,
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );

    Transaction.associate = (models) => {
        Transaction.belongsTo(models.DeviceUser, {
            foreignKey: "device_user_id",
            as: "deviceUser",
        });
        Transaction.belongsTo(models.Client, {
            foreignKey: "client_id",
            as: "client",
        });
        Transaction.belongsTo(models.Device, {
            foreignKey: "device_id",
            as: "device",
        });
        Transaction.belongsTo(models.User, {
            foreignKey: "user_id",
            as: "user",
        });
        Transaction.belongsTo(models.CheckParameter, {
            foreignKey: "check_parameter_id",
            as: "checkParameter",
        });
        Transaction.belongsTo(models.UserCheckParameter, {
            foreignKey: "device_user_id", // Ensure this foreign key is correct
            as: "userCheckParameter", // Adjust the alias as per your need
        });
    };

    return Transaction;
};
