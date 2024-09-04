// // models/apiLog.js

// module.exports = (sequelize, DataTypes) => {
//   const ApiLog = sequelize.define("ApiLog", {
//     user_id: {
//       type: DataTypes.INTEGER,
//       allowNull: true, // Null allowed if unauthenticated
//     },
//     api_name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     api_request: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     status: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     ip_address: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     message: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     response: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     timestamp: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//     },
//   });

//   return ApiLog;
// };


// // models/apiLog.js

// module.exports = (sequelize, DataTypes) => {
//   const ApiLog = sequelize.define("ApiLog", {
//     user_id: {
//       type: DataTypes.INTEGER,
//       allowNull: true, // Null allowed if unauthenticated
//     },
//     api_name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     api_request: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     status: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     ip_address: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     message: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     response: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     timestamp: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//     },
//   });

//   return ApiLog;
// };


'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ApiLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ApiLog.init({
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
  }, {
    sequelize,
    modelName: 'ApiLog',
    tableName: 'api_logs',
    timestamps: false,
    indexes: [
      {
        name: 'api_logs',  // Optional: custom name for the index
        fields: ['user_id', 'api_name', 'status', 'ip_address'],    // The column(s) to index
      }
    ]
  });
  return ApiLog;
};