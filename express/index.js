// const express = require("express");
// const bodyParser = require("body-parser");
// const db = require("./models");
// const routes = require("./routes");
// const cors = require("cors");
// require("dotenv").config();
// const path = require("path");

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // Static file serving
// app.use("/", express.static(path.join(__dirname, "../react/build")));

// // Routes
// app.use("/api", routes);
// app.use(
//   "/uploads/avatars",
//   express.static(path.join(__dirname, "uploads/avatars"))
// );

// // 404 Error Handling
// app.use((req, res, next) => {
//   res.status(404).json({ message: "Not Found" });
// });

// // Global Error Handling
// app.use((err, req, res, next) => {
//   console.error("Global Error Handler:", err.message);
//   res.status(500).json({ error: "Internal Server Error" });
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
const express = require("express");
const bodyParser = require("body-parser");
const db = require("./models");
const routes = require("./routes");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const { createTCPServer, closeTCPServer } = require("./utils/tcpServer");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Static file serving
app.use("/", express.static(path.join(__dirname, "../react/build")));

// Routes
app.use("/api", routes);
app.use("/uploads/avatars", express.static(path.join(__dirname, "uploads/avatars")));

// 404 Error Handling
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// Global Error Handling
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

// Initialize TCP servers for existing device users
async function initializeDeviceUserServers() {
  try {
    const deviceUsers = await db.DeviceUser.findAll(); // Fetch all existing device users

    // Optionally, close previous servers if needed
    deviceUsers.forEach(deviceUser => {
      const port = 8080 + deviceUser.device_user_id; // Calculate port based on device user ID
      closeTCPServer(port); // Close any existing server on this port
    });

    // Create TCP servers for new device users
    deviceUsers.forEach(deviceUser => {
      const port = 8080 + deviceUser.device_user_id; // Calculate port based on device user ID
      createTCPServer(port);
    });
  } catch (error) {
    console.error("Error initializing TCP servers:", error.message);
  }
}

// Start initialization of TCP servers and Express app
initializeDeviceUserServers();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
