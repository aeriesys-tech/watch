const { ApiLog } = require("../models"); // Assuming your ApiLog model is properly set up and exported

const responseService = {
  success: async (req, res, message, data = {}, statusCode = 200) => {
    // Log the response to the ApiLogs table
    await logApiResponse(req, message, statusCode, data);

    // Send the success response to the client
    return res.status(statusCode).json({
      status: "success",
      message,
      data,
    });
  },

  error: async (req, res, message, errors = {}, statusCode = 500) => {
    // Log the error response to the ApiLogs table
    await logApiResponse(req, message, statusCode, errors);

    // Send the error response to the client
    return res.status(statusCode).json({
      status: "error",
      message,
      errors,
    });
  },
};

// Helper function to log the API response
async function logApiResponse(req, message, status, responseData) {
  const { method, originalUrl, ip } = req;
  const user_id = req.user ? req.user.user_id : null; // Assumes req.user is set after authentication
  const apiRequest = JSON.stringify(req.body || {});

  await ApiLog.create({
    user_id,
    api_name: `${method} ${originalUrl}`,
    api_request: apiRequest,
    status,
    ip_address: ip,
    message,
    response: JSON.stringify(responseData),
    timestamp: new Date(),
  });
}

module.exports = responseService;
