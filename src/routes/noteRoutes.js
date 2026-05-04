const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  createNote,
  getNotes,
  updateNote,
  searchNotes,
  deleteNote
} = require("../controllers/noteController");

// Protected routes
router.post("/", auth, createNote);
router.get("/", auth, getNotes);
router.put("/:id", auth, updateNote);  
router.get("/search", auth, searchNotes);
router.delete("/:id", auth, deleteNote);

module.exports = router;