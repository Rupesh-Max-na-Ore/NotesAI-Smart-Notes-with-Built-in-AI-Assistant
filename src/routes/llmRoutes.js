const express = require("express");
const router = express.Router();

const {
  summarizeUserNotes,
  summarizeTextController,
  queryNotesController,
  summarizeNote
} = require("../controllers/llmController");

const authMiddleware = require("../middleware/authMiddleware");

// Existing: summarize user's stored notes
router.get("/summarize-notes", authMiddleware, summarizeUserNotes);

// summarize arbitrary text (POST)
router.post("/summarize", authMiddleware, summarizeTextController);

// Optional GET (for quick testing)
router.get("/summarize", authMiddleware, summarizeTextController);

// query notes with LLM understanding
router.post("/query-notes", authMiddleware, queryNotesController);

// summarize a single note by ID
router.post("/summarize-note/:id", authMiddleware, summarizeNote);

module.exports = router;