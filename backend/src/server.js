require('dotenv').config();
const mongoose = require('mongoose');
const { createApp } = require('./app');

// Refuse to start without the two essential settings, rather than running insecurely.
const missing = ['MONGODB_URI', 'JWT_SECRET'].filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`❌ Missing setting(s): ${missing.join(', ')}. Add them to .env (local) or the host's Environment settings.`);
  process.exit(1);
}
if (process.env.JWT_SECRET.length < 32) {
  console.error('❌ JWT_SECRET is too short. Use at least 32 random characters.');
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    createApp().listen(PORT, () => {
      console.log(`🚀 API running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
