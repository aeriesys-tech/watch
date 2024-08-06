module.exports = (sequelize, DataTypes) => {
  const Ability = sequelize.define(
    "Ability",
    {
      ability_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      module_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Module", // Ensure the model name matches the defined model
          key: "module_id",
        },
      },
      ability: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING(250),
        allowNull: true,
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
          fields: ["module_id", "ability", "description"],
        },
      ],
    }
  );

  Ability.associate = (models) => {
    Ability.belongsTo(models.Module, {
      foreignKey: "module_id",
      as: "module", // Alias to be used in queries
    });
    Ability.hasMany(models.RoleAbility, {
      foreignKey: "ability_id",
      as: "roleAbilities", // Alias to be used in queries
    });
  };

  return Ability;
};
