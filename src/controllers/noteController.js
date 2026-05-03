const Note = require("../models/Note");

const createNote = async (req, res) => {
  try {
    const note = await Note.create({
      userId: req.user.userId,
      content: req.body.content,
    });

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.userId });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createNote, getNotes };