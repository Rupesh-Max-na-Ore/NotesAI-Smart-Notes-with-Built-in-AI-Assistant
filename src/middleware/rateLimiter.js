const rateLimit = require("express-rate-limit");

let limiter;

// Use Redis ONLY if explicitly configured
if (process.env.REDIS_URL) {
  const { RedisStore } = require("rate-limit-redis");
  const Redis = require("ioredis");

  const redisClient = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 1,
  });

  limiter = rateLimit({
    store: new RedisStore({
      sendCommand: (...args) => redisClient.call(...args),
    }),
    windowMs: 15 * 60 * 1000,
    max: 100,
  });

  console.log("✅ Rate limiter using Redis");

} else {
  // Fallback: in-memory (safe for demo)
  limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  });

  console.log("⚠️ Rate limiter using memory (no Redis)");
}

module.exports = limiter;