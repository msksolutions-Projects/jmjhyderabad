const mongoose = require('mongoose');

/** An enquiry sent through the website's Contact form; read in the admin "Messages" inbox. */
const contactMessageSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true },
    fullName: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    phone: { type: String, trim: true, maxlength: 20 },
    subject: { type: String, required: true, trim: true, minlength: 3, maxlength: 200 },
    message: { type: String, required: true, trim: true, minlength: 20, maxlength: 5000 },
    status: { type: String, enum: ['new', 'read', 'replied', 'archived', 'spam'], default: 'new' },
  },
  { timestamps: true },
);

contactMessageSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
