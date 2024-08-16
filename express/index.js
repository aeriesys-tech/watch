const express = require("express");
const bodyParser = require("body-parser");
const db = require("./models");
const routes = require("./routes");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Static file serving 
app.use("/",express.static(path.join(__dirname, "../frontend/build")));

// Routes
app.use("/api", routes);
app.use(
  "/uploads/avatars",
  express.static(path.join(__dirname, "uploads/avatars"))
);

// 404 Error Handling
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// Global Error Handling
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
