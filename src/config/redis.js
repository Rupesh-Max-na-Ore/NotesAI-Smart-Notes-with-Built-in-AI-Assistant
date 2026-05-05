const Redis = require("ioredis");

let redisClient = null;

if (process.env.REDIS_URL) {
  redisClient = new Redis(process.env.REDIS_URL);

  redisClient.on("connect", () => {
    console.log("Redis connected");
  });

  redisClient.on("error", (err) => {
    console.error("Redis error:", err.message);
  });
} else {
  console.log("⚠️ Redis disabled (no REDIS_URL)");
}

module.exports = redisClient;