module.exports = (sequelize, DataTypes) => {
  const UserToken = sequelize.define(
    "UserToken",
    {
      user_token_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      token: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      expire_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      timestamps: true, // This automatically creates `created_at` and `updated_at`
      underscored: true, // This will create columns like `created_at` and `updated_at`
      indexes: [
        {
          fields: ["user_id"],
        },
        {
          fields: ["token"],
        },
      ],
    }
  );

  UserToken.associate = (models) => {
    UserToken.belongsTo(models.User, {
      foreignKey: "user_id",
    });
  };

  return UserToken;
};
