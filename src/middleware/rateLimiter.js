const rateLimit = require("express-rate-limit");

let limiter;

if (process.env.NODE_ENV === "test") {
  limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  });
} else {
  const { RedisStore } = require("rate-limit-redis");
  const Redis = require("ioredis");

  const redisClient = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
  });

  limiter = rateLimit({
    store: new RedisStore({
      sendCommand: (...args) => redisClient.call(...args),
    }),
    windowMs: 15 * 60 * 1000,
    max: 100,
  });
}

module.exports = limiter;