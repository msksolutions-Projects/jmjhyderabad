const mongoose = require('mongoose');

/** One photo in the website's Photo Gallery, uploaded through the admin. */
const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title.'],
      trim: true,
      minlength: [2, 'The title needs at least 2 characters.'],
      maxlength: [200, 'The title cannot be longer than 200 characters.'],
    },
    description: { type: String, trim: true, maxlength: [1000, 'The description cannot be longer than 1000 characters.'] },
    /** Album id from the website's gallery (e.g. "jubilee-2025"), a new album name, or empty for "Latest uploads". */
    album: { type: String, trim: true, maxlength: 80, default: '' },
    /** Original file name, used by bulk upload to skip photos that were already uploaded. */
    sourceFile: { type: String, trim: true, maxlength: 300 },
    category: {
      type: String,
      enum: {
        values: ['formation', 'education', 'healthcare', 'social-services', 'events', 'celebrations', 'pilgrimages', 'meetings', 'other'],
        message: 'Unknown category.',
      },
      default: 'events',
    },
    coverImage: {
      url: { type: String, required: true },
      thumbUrl: { type: String },
      width: { type: Number },
      height: { type: Number },
      publicId: { type: String },
      resourceType: { type: String },
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

gallerySchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

gallerySchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Gallery', gallerySchema);
