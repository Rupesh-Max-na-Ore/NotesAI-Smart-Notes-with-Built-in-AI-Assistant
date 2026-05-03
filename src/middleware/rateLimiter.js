const rateLimit = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const Redis = require("ioredis");

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
    host: "127.0.0.1",
    port: 6379,
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