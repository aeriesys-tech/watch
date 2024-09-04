module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define(
    "Client",
    {
      client_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      client_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      client_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      contact_person: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      mobile_no: {
        type: DataTypes.STRING(15),
        allowNull: true,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      logo: {
        type: DataTypes.STRING(50),
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
      tableName: "clients",
      timestamps: true,
      paranoid: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  // Define associations
  Client.associate = (models) => {
    Client.hasMany(models.Device, { as: "devices", foreignKey: "client_id" });
    Client.hasMany(models.ClientUser, {
      as: "clientUsers",
      foreignKey: "client_id",
    });
  };

  return Client;
};
