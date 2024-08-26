module.exports = (sequelize, DataTypes) => {
  const Device = sequelize.define(
    "Device",
    {
      device_id: {
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
      device_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "device_types",
          key: "device_type_id",
        },
      },
      serial_no: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      mobile_no: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
      },
      port_no: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
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
      tableName: "devices",
      timestamps: true,
      paranoid: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  Device.associate = (models) => {
    Device.belongsTo(models.Client, {
      foreignKey: "client_id",
      as: "client",
    });
    Device.belongsTo(models.DeviceType, {
      foreignKey: "device_type_id",
      as: "deviceType",
    });
  };

  return Device;
};
