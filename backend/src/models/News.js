const mongoose = require('mongoose');
const { attachmentSchema } = require('./attachment');

const CATEGORIES = [
  'announcements', 'celebrations', 'education', 'healthcare', 'social-services',
  'formation', 'environment', 'events', 'bicentenary', 'other',
];

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title.'],
      trim: true,
      minlength: [5, 'The title needs at least 5 characters.'],
      maxlength: [200, 'The title cannot be longer than 200 characters.'],
    },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    excerpt: {
      type: String,
      required: [true, 'Please add a short summary.'],
      trim: true,
      maxlength: [500, 'The summary cannot be longer than 500 characters.'],
    },
    content: {
      type: String,
      required: [true, 'Please add the article text.'],
      minlength: [100, 'The article needs at least 100 characters.'],
    },
    category: { type: String, enum: { values: CATEGORIES, message: 'Unknown category.' }, default: 'announcements' },
    image: { type: String },
    attachments: { type: [attachmentSchema], default: [] },
    featured: { type: Boolean, default: false },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    publishedAt: { type: Date, default: null },
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'news';

// A unique web address from the title: "province-retreat", then "province-retreat-2", ...
newsSchema.pre('save', async function (next) {
  try {
    if (!this.slug || this.isModified('title')) {
      const base = slugify(this.title);
      let candidate = base;
      for (let n = 2; await this.constructor.exists({ slug: candidate, _id: { $ne: this._id } }); n += 1) {
        candidate = `${base}-${n}`;
      }
      this.slug = candidate;
    }
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
      this.publishedAt = new Date();
    }
    next();
  } catch (err) {
    next(err);
  }
});

newsSchema.index({ status: 1, publishedAt: -1 });

module.exports = mongoose.model('News', newsSchema);
module.exports.CATEGORIES = CATEGORIES;
