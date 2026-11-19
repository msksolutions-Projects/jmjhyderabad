const Notice = require('../models/Notice');
const { contentRouter } = require('./content');

/** /api/v1/notices — visitors read published, unexpired notices; admins manage all. */
module.exports = contentRouter({
  Model: Notice,
  label: 'Notice',
  fields: ['title', 'content', 'category', 'urgency', 'status', 'expiryDate'],
  publicFilter: () => ({ $or: [{ expiryDate: null }, { expiryDate: { $exists: false } }, { expiryDate: { $gte: new Date() } }] }),
});
