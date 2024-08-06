module.exports = (sequelize, DataTypes) => {
  const Module = sequelize.define(
    "Module",
    {
      module_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      module: {
        type: DataTypes.STRING(100),
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
          unique: true,
          fields: ["module"],
        },
      ],
    }
  );

  Module.associate = (models) => {
    Module.hasMany(models.Ability, {
      foreignKey: "module_id",
      as: "abilities", // Alias to be used in queries
    });
  };

  return Module;
};
