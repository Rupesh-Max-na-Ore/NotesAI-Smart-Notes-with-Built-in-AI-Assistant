const Note = require("../models/Note");

// CREATE NOTE

const createNote = async (req, res) => {
  try {
    const { title = "", content = "" } = req.body;

    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const note = await Note.create({
      userId: req.userId,
      title,
      content,
    });

    res.status(201).json(note);
  } catch (err) {
    console.error("Create Note Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};


// GET ALL NOTES
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId });
    res.json(notes);
  } catch (err) {
    console.error("GET NOTES ERROR:", err);
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

    let notes;

    if (mode === "exact") {
      // exact phrase match
      const regex = new RegExp(`\\b${q}\\b`, "i");

      notes = await Note.find({
        userId: req.userId,
        $or: [
          { title: regex },
          { content: regex },
          { tags: regex },
        ],
      });
    } else {
      // fuzzy / loose match
      const words = q.split(" ").filter(Boolean);

      notes = await Note.find({
        userId: req.userId,
        $or: [
          { title: { $in: words.map(w => new RegExp(w, "i")) } },
          { content: { $in: words.map(w => new RegExp(w, "i")) } },
          { tags: { $in: words.map(w => new RegExp(w, "i")) } },
        ],
      });
    }

    res.json(notes);
  } catch (err) {
    console.error("Search error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    res.json(note);
  } catch (err) {
    console.error("Update Note Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId, // 🔒 ensures user can only delete own notes
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ message: "Note deleted" });
  } catch (err) {
    console.error("Delete Note Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createNote, getNotes, searchNotes, updateNote, deleteNote };