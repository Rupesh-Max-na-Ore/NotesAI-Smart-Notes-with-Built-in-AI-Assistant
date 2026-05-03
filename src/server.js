require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const redis = require('redis');

const PORT = process.env.PORT || 5000;

// ---------- REDIS CLIENT ----------
const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

// Redis event listeners
redisClient.on('error', (err) => {
  console.error('Redis Error:', err);
});

redisClient.on('connect', () => {
  console.log('Redis connecting...');
});

redisClient.on('ready', () => {
  console.log('Redis connected');
});

// ---------- INIT FUNCTION ----------
async function startServer() {
  try {
    // 1. Connect MongoDB
    await connectDB();
    console.log('MongoDB connected');

    // 2. Connect Redis
    await redisClient.connect();

    // 3. Start server ONLY AFTER dependencies are ready
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Startup error:', error);
    process.exit(1);
  }
}

// ---------- START ----------
startServer();