const Note = require("../models/Note");

// CREATE NOTE
const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.create({
      userId: req.user.userId,
      title: title || "",
      content,
    });

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL NOTES
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SEARCH NOTES: supports both exact and loose search based on "mode" query param
const searchNotes = async (req, res) => {
  try {
    const { q, mode } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Query required" });
    }

    let query;

    if (mode === "exact") {
      // exact phrase
      query = {
        userId: req.user.userId,
        $text: { $search: `"${q}"` },
      };
    } else {
      // loose match (default)
      query = {
        userId: req.user.userId,
        $text: { $search: q },
      };
    }

    const notes = await Note.find(query).sort({ score: { $meta: "textScore" } });

    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createNote, getNotes, searchNotes };