const Redis = require("ioredis");

let redisClient = null;

if (process.env.REDIS_URL && process.env.REDIS_URL !== "null") {
  try {
    redisClient = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      connectTimeout: 5000,
    });

    redisClient.on("connect", () => {
      console.log("✅ Redis connected");
    });

    redisClient.on("error", (err) => {
      console.error("Redis error:", err.message);
    });
  } catch (err) {
    console.log("⚠️ Redis init failed, disabling:", err.message);
    redisClient = null;
  }
} else {
  console.log("⚠️ Redis disabled (no REDIS_URL)");
}

module.exports = redisClient;