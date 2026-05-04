const Note = require("../models/Note");
const { summarizeNotes, summarizeText, queryNotes } = require("../services/llmService");

// 1. Summarize ALL user notes
exports.summarizeUserNotes = async (req, res) => {
  try {
    const userId = req.user.id;

    const notes = await Note.find({ user: userId });

    if (!notes.length) {
      return res.status(400).json({ message: "No notes found" });
    }

    const summary = await summarizeNotes(notes, userId);

    res.json({ summary });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "LLM processing failed" });
  }
};


// 2. Summarize arbitrary text (NEW)
exports.summarizeTextController = async (req, res) => {
  try {
    const text = req.body.text || req.query.text;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    const summary = await summarizeText(text);

    res.json({ summary });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Text summarization failed" });
  }
};

// 3. Query notes with LLM understanding
exports.queryNotesController = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ message: "Query required" });
    }

    const notes = await Note.find({ userId: req.user.userId });

    if (!notes.length) {
      return res.status(400).json({ message: "No notes found" });
    }

    const response = await queryNotes(notes, query);

    res.json({ response });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};