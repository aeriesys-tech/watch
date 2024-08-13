// models/apiLog.js

module.exports = (sequelize, DataTypes) => {
  const ApiLog = sequelize.define("ApiLog", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Null allowed if unauthenticated
    },
    api_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    api_request: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    response: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return ApiLog;
};
