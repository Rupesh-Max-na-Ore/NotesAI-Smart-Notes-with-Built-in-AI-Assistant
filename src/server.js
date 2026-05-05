require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// ---------- INIT FUNCTION ----------
async function startServer() {
  try {
    // 1. Connect MongoDB
    await connectDB();
    console.log('MongoDB connected');

    // 2. Start server
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