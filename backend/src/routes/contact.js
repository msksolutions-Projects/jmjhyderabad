/**
 * /api/v1/contact
 * - POST (anyone): the website's Contact form. Saved for the admin "Messages" inbox.
 * - GET / PATCH / DELETE (admins only): read, mark and delete messages.
 */
const express = require('express');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const { protect } = require('../middleware/auth');
const { handle, limitFrom } = require('../utils/http');
const ContactMessage = require('../models/ContactMessage');

const router = express.Router();
const STATUSES = ['new', 'read', 'replied', 'archived', 'spam'];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[\d\s+()-]{6,20}$/;

// At most 5 messages per visitor every 15 minutes.
const sendLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many messages have been sent. Please wait a moment and try again.' },
});

const text = (v) => (typeof v === 'string' ? v.trim() : '');

router.post(
  '/',
  sendLimit,
  handle(async (req, res) => {
    const body = req.body || {};
    const reference = `JMJ-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
    // Hidden "hp_check" field: people never fill it in, spam robots do. Pretend success, store nothing.
    if (text(body.hp_check)) return res.status(201).json({ ok: true, reference });

    const msg = {
      fullName: text(body.fullName),
      email: text(body.email).toLowerCase(),
      phone: text(body.phone),
      subject: text(body.subject),
      message: text(body.message),
    };
    const problem =
      (msg.fullName.length < 2 || msg.fullName.length > 120) ? 'Please enter your full name.'
        : !EMAIL.test(msg.email) || msg.email.length > 200 ? 'Enter a valid email address.'
          : msg.phone && !PHONE.test(msg.phone) ? 'Enter a valid phone number.'
            : (msg.subject.length < 3 || msg.subject.length > 200) ? 'Please add a short subject.'
              : (msg.message.length < 20 || msg.message.length > 5000) ? 'Please write a message of 20 to 5000 characters.'
                : null;
    if (problem) return res.status(400).json({ success: false, message: problem });

    await ContactMessage.create({ ...msg, reference });
    res.status(201).json({ ok: true, reference });
  }, 'We could not send your message. Please try again, or call the office directly.'),
);

router.get(
  '/',
  protect,
  handle(async (req, res) => {
    const query = {};
    if (req.query.status && STATUSES.includes(req.query.status)) query.status = req.query.status;
    const [items, unread] = await Promise.all([
      ContactMessage.find(query).sort({ createdAt: -1 }).limit(limitFrom(req.query.limit, 100, 1000)),
      ContactMessage.countDocuments({ status: 'new' }),
    ]);
    res.json({ success: true, count: items.length, unread, data: items });
  }),
);

router.patch(
  '/:id',
  protect,
  handle(async (req, res) => {
    const status = req.body && req.body.status;
    if (!STATUSES.includes(status)) return res.status(400).json({ success: false, message: 'Unknown status.' });
    const item = await ContactMessage.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Message not found.' });
    res.json({ success: true, data: item });
  }),
);

router.delete(
  '/:id',
  protect,
  handle(async (req, res) => {
    const item = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Message not found.' });
    res.json({ success: true, message: 'Message deleted.' });
  }),
);

module.exports = router;
