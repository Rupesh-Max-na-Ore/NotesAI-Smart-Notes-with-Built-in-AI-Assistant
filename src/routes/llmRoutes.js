const express = require("express");
const router = express.Router();

const {
  summarizeUserNotes,
  summarizeTextController
} = require("../controllers/llmController");

const authMiddleware = require("../middleware/authMiddleware");

// 🔹 Existing: summarize user's stored notes
router.get("/summarize-notes", authMiddleware, summarizeUserNotes);

// 🔹 NEW: summarize arbitrary text (POST)
router.post("/summarize", authMiddleware, summarizeTextController);

// 🔹 Optional GET (for quick testing)
router.get("/summarize", authMiddleware, summarizeTextController);

module.exports = router;