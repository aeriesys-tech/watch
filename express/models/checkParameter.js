module.exports = (sequelize, DataTypes) => {
  const CheckParameter = sequelize.define(
    "CheckParameter",
    {
      check_parameter_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      device_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "device_types",
          key: "device_type_id",
        },
      },
      check_group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "check_groups",
          key: "check_group_id",
        },
      },
      parameter_code: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      parameter_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      unit_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "units",
          key: "unit_id",
        },
      },
      icon: {
        type: DataTypes.STRING(100),
        allowNull: true,
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
      tableName: "check_parameters",
      timestamps: true,
      paranoid: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  CheckParameter.associate = (models) => {
    CheckParameter.belongsTo(models.DeviceType, {
      foreignKey: "device_type_id",
      as: "deviceType",
    });
    CheckParameter.belongsTo(models.CheckGroup, {
      foreignKey: "check_group_id",
      as: "checkGroup",
    });
    CheckParameter.belongsTo(models.Unit, {
      foreignKey: "unit_id",
      as: "unit",
    });
    CheckParameter.hasMany(models.UserCheckParameter, {
      foreignKey: "check_parameter_id",
      as: "checkParameter",
    });
    CheckParameter.hasMany(models.Transaction, {
      foreignKey: "check_parameter_id",
      as: "transaction",
    });
  };

  return CheckParameter;
};
