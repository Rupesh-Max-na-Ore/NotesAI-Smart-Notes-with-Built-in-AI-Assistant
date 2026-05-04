const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createNote,
  getNotes,
  searchNotes,
} = require("../controllers/noteController");

router.use(authMiddleware);

router.post("/", createNote);
router.get("/", getNotes);

// supports both exact and loose search based on "mode" query param
router.get("/search", searchNotes);

module.exports = router;