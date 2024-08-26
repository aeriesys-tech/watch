module.exports = (sequelize, DataTypes) => {
  const ClientUser = sequelize.define(
    "ClientUser",
    {
      client_user_id: {
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
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
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
      tableName: "client_users",
      timestamps: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  ClientUser.associate = (models) => {
    ClientUser.belongsTo(models.Client, {
      foreignKey: "client_id",
      as: "client",
    });
    ClientUser.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
  };

  return ClientUser;
};
