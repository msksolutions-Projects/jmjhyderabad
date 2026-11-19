const mongoose = require('mongoose');
const { attachmentSchema } = require('./attachment');

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title.'],
      trim: true,
      minlength: [5, 'The title needs at least 5 characters.'],
      maxlength: [200, 'The title cannot be longer than 200 characters.'],
    },
    content: {
      type: String,
      required: [true, 'Please add the notice text.'],
      minlength: [50, 'The notice needs at least 50 characters.'],
    },
    category: {
      type: String,
      enum: {
        values: ['general', 'holiday', 'event', 'meeting', 'urgent', 'maintenance', 'academic', 'administrative'],
        message: 'Unknown category.',
      },
      default: 'general',
    },
    urgency: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    publishedAt: { type: Date, default: null },
    expiryDate: { type: Date },
    attachments: { type: [attachmentSchema], default: [] },
  },
  { timestamps: true },
);

noticeSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

noticeSchema.index({ status: 1, publishedAt: -1 });

module.exports = mongoose.model('Notice', noticeSchema);
