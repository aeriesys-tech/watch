module.exports = (sequelize, DataTypes) => {
  const Keyword = sequelize.define(
    "Keyword",
    {
      keyword_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      language_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "languages",
          key: "language_id",
        },
        allowNull: true,
      },
      keyword: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      regional_keyword: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      underscored: true,
    }
  );

  Keyword.associate = (models) => {
    Keyword.belongsTo(models.Language, {
      foreignKey: "language_id",
      as: "language",
    });
  };

  return Keyword;
};
