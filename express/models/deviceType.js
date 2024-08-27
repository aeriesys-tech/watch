module.exports = (sequelize, DataTypes) => {
  const DeviceType = sequelize.define(
    "DeviceType",
    {
      device_type_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      device_type: {
        type: DataTypes.STRING(100),
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
      tableName: "device_types", // Explicitly set table name
      timestamps: true,
      paranoid: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  DeviceType.associate = (models) => {
    // DeviceType.hasMany(models.Device, {
    //   foreignKey: "device_type_id",
    //   as: "devices",
    // });
    DeviceType.hasMany(models.Device, {
      as: "devices",
      foreignKey: "device_type_id",
    });
  };

  return DeviceType;
};
