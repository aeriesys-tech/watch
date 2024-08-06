const express = require("express");
const router = express.Router();
const keywordController = require("../controllers/keywordController");
const authMiddleware = require("../middleware/authMiddleware"); // Include if authentication is required

// Routes for keywords
router.post("/addKeyword", authMiddleware, keywordController.addKeyword);
router.post("/updateKeyword", authMiddleware, keywordController.updateKeyword);
router.post("/deleteKeyword", authMiddleware, keywordController.deleteKeyword);
router.post("/viewKeyword", authMiddleware, keywordController.viewKeyword);
router.post("/getKeywords", authMiddleware, keywordController.getKeywords);
router.post(
  "/paginateKeywords",
  authMiddleware,
  keywordController.paginateKeywords
);

module.exports = router;
