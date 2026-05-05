const Redis = require("ioredis");

if (!process.env.REDIS_URL) {
  console.log("Redis disabled");
}

const redis = new Redis({
  host: process.env.REDIS_HOST || "redis",
  port: process.env.REDIS_PORT || 6379,
});

// Redis event listeners
redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err) => {
  console.error("Redis error:", err.message);
});

module.exports = redis;