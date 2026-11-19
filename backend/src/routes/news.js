const News = require('../models/News');
const { contentRouter } = require('./content');

/** /api/v1/news — visitors read published articles; admins manage all. */
module.exports = contentRouter({
  Model: News,
  label: 'News article',
  fields: ['title', 'excerpt', 'content', 'category', 'status', 'image', 'featured'],
});
