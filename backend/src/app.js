/**
 * The JMJ Hyderabad Province API (Express app). Started by server.js; also used directly by the tests.
 *
 * Public (visitors): read published news, notices and gallery photos; send the contact form.
 * Admins (signed in): create, edit and delete news, notices and photos; upload files; read messages.
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { UPLOAD_DIR } = require('./utils/storage');

const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news');
const noticeRoutes = require('./routes/notices');
const galleryRoutes = require('./routes/gallery');
const uploadRoutes = require('./routes/uploads');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');

/** Websites allowed to use this API: the defaults plus CORS_ORIGINS (comma-separated). */
const allowedOrigins = () =>
  [
    'http://localhost:5173',
    'http://localhost:4173',
    'https://jmjhyderabad.vercel.app',
    process.env.FRONTEND_URL_PROD,
    ...(process.env.CORS_ORIGINS || '').split(','),
  ]
    .map((o) => (o || '').trim().replace(/\/$/, ''))
    .filter(Boolean);

function createApp() {
  const app = express();

  // Render, Vercel and similar hosts sit behind one proxy: needed so each visitor gets their own rate limit.
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  // Uploaded files (local mode) are shown on the website, which runs on another address.
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

  const origins = allowedOrigins();
  app.use(
    cors({
      origin: (origin, cb) => cb(null, !origin || origins.includes(origin)),
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      maxAge: 86400,
    }),
  );

  // General limit for visitors. Signed-in admins (e.g. bulk photo uploads) are not counted here;
  // sign-in and the contact form have their own stricter limits.
  app.use(
    '/api/',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 600,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
      skip: (req) => (req.headers.authorization || '').startsWith('Bearer '),
      message: { success: false, message: 'Too many requests. Please try again in a few minutes.' },
    }),
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ limit: '1mb', extended: true }));
  app.use(mongoSanitize());
  if (process.env.NODE_ENV !== 'test') app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  // Files stored on this server's disk (only when Cloudinary is not configured, i.e. local testing).
  app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '30d', fallthrough: false }));

  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/news', newsRoutes);
  app.use('/api/v1/notices', noticeRoutes);
  app.use('/api/v1/gallery', galleryRoutes);
  app.use('/api/v1/uploads', uploadRoutes);
  app.use('/api/v1/contact', contactRoutes);
  app.use('/api/v1/admin', adminRoutes);

  app.get('/api/v1/health', (req, res) => {
    res.json({ status: 'OK', message: 'JMJ Hyderabad API is running', timestamp: new Date().toISOString() });
  });
  app.get('/', (req, res) => res.json({ status: 'OK', api: '/api/v1' }));

  app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'This file is too large.' });
    }
    if (err && err.type === 'entity.too.large') {
      return res.status(413).json({ success: false, message: 'The request is too large.' });
    }
    const status = err && err.statusCode ? err.statusCode : err && err.status ? err.status : 500;
    if (status >= 500) console.error('Error:', err);
    res.status(status).json({ success: false, message: status >= 500 ? 'Internal server error' : err.message });
  });

  return app;
}

module.exports = { createApp, allowedOrigins };
