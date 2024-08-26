module.exports = (sequelize, DataTypes) => {
  const DeviceUser = sequelize.define(
    "DeviceUser",
    {
      device_user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "clients",
          key: "client_id",
        },
      },
      device_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "devices",
          key: "device_id",
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      from_date_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      to_date_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
      tableName: "device_users",
      timestamps: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  DeviceUser.associate = (models) => {
    DeviceUser.belongsTo(models.Client, {
      foreignKey: "client_id",
      as: "client",
    });
    DeviceUser.belongsTo(models.Device, {
      foreignKey: "device_id",
      as: "device",
    });
    DeviceUser.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
  };

  return DeviceUser;
};
