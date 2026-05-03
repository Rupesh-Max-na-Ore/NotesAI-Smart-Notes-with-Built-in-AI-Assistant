const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createNote,
  getNotes,
} = require("../controllers/noteController");

router.use(authMiddleware);

router.post("/", createNote);
router.get("/", getNotes);

module.exports = router;