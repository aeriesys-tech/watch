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
          model: "modules", // Table name in lowercase
          key: "module_id",
        },
        onDelete: "SET NULL", // Handle deletion of referenced rows
        onUpdate: "CASCADE", // Handle updates to referenced rows
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
      as: "module",
    });
    Ability.hasMany(models.RoleAbility, {
      foreignKey: "ability_id",
      as: "roleAbilities",
    });
  };

  return Ability;
};
