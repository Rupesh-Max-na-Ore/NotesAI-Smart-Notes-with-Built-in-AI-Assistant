const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const rateLimiter = require("./middleware/rateLimiter");
const llmRoutes = require("./routes/llmRoutes");


const app = express();

app.use(cors());
app.use(express.json());
app.use(rateLimiter);

app.use("/api/auth", authRoutes);

app.use("/api/notes", noteRoutes);

app.use("/api/llm", llmRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

module.exports = app;