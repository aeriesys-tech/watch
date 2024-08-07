const express = require("express");
const bodyParser = require("body-parser");
const db = require("./models");
const routes = require("./routes");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection and synchronization

db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database connected and synced without dropping tables");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
    process.exit(1); // Exit the process with failure code if database connection fails
  });

// Routes
app.use("/api", routes);

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
