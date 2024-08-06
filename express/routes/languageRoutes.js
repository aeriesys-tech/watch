const express = require("express");
const router = express.Router();
const languageController = require("../controllers/languageController");
const authMiddleware = require("../middleware/authMiddleware"); // Include if authentication is required

// Routes for languages
router.post("/addLanguage", authMiddleware, languageController.addLanguage);
router.post(
  "/updateLanguage",
  authMiddleware,
  languageController.updateLanguage
);
router.post(
  "/deleteLanguage",
  authMiddleware,
  languageController.deleteLanguage
);
router.post("/viewLanguage", authMiddleware, languageController.viewLanguage);
router.post("/getLanguages", authMiddleware, languageController.getLanguages);
router.post(
  "/paginateLanguages",
  authMiddleware,
  languageController.paginateLanguages
);

module.exports = router;
