// // services/responseService.js

// const sendResponse = (
//   res,
//   statusCode,
//   success,
//   message,
//   data = null,
//   // count = null,
//   errors = null
// ) => {
//   const response = {
//     success,
//     message,
//   };

//   if (data !== null) response.data = data;
//   //  if (count !== null) response.count = count;

//   if (errors !== null) response.errors = errors;

//   res.status(statusCode).json(response);
// };

// module.exports = {
//   sendResponse,
// };
// services/responseService.js

// const db = require("../models"); // Import your models

// const sendResponse = async (
//   res,
//   statusCode,
//   success,
//   message,
//   data = null,
//   errors = null
// ) => {
//   const response = {
//     success,
//     message,
//   };

//   if (data !== null) response.data = data;
//   if (errors !== null) response.errors = errors;

//   // Get API log details
//   const apiLog = {
//     user_id: res.locals.user ? res.locals.user.id : null, // Assuming you store user info in res.locals
//     api_name: res.req.originalUrl, // API endpoint
//     api_request: JSON.stringify(res.req.body), // Request payload
//     status: statusCode,
//     ip_address: res.req.ip, // Client IP address
//     message: message,
//     response: JSON.stringify(response),
//     timestamp: new Date(),
//   };

//   try {
//     // Store the log in the database
//     await db.ApiLog.create(apiLog);
//   } catch (error) {
//     console.error("Failed to log API request:", error);
//   }

//   res.status(statusCode).json(response);
// };

// module.exports = {
//   sendResponse,
// };
// services/responseService.js

const db = require("../models"); // Import your models

const sendResponse = async (
  res,
  statusCode,
  success,
  message,
  data = null,
  errors = null
) => {
  const response = {
    success,
    message,
  };

  if (data !== null) response.data = data;
  if (errors !== null) response.errors = errors;

  // Get API log details
  const apiLog = {
    user_id: res.locals.user ? res.locals.user.id : null, // Retrieve user ID from res.locals
    api_name: res.req.originalUrl, // API endpoint
    api_request: JSON.stringify(res.req.body), // Request payload
    status: statusCode,
    ip_address: res.req.ip, // Client IP address
    message: message,
    response: JSON.stringify(response),
    timestamp: new Date(),
  };

  try {
    // Store the log in the database
    await db.ApiLog.create(apiLog);
  } catch (error) {
    console.error("Failed to log API request:", error);
  }

  res.status(statusCode).json(response);
};

module.exports = {
  sendResponse,
};
