const rateLimit = require("express-rate-limit");

// PURE MEMORY LIMITER (no Redis at all)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

console.log("⚠️ Rate limiter using MEMORY (Redis disabled)");

module.exports = limiter;