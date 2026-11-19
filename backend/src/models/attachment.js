const mongoose = require('mongoose');

/**
 * A file attached to a news article or notice, as returned by POST /api/v1/uploads.
 * Note: a field literally called "type" must be written as { type: String },
 * otherwise Mongoose reads it as the type of the whole object.
 */
const attachmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    url: { type: String, required: true },
    thumbUrl: { type: String },
    type: { type: String },
    kind: { type: String, enum: ['image', 'pdf', 'document'], default: 'document' },
    size: { type: Number },
    publicId: { type: String },
    resourceType: { type: String },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const MAX_ATTACHMENTS = 10;

/** Keeps only known fields of each attachment, at most 10. */
const cleanAttachments = (list) =>
  (Array.isArray(list) ? list : [])
    .filter((a) => a && typeof a.url === 'string' && typeof a.name === 'string')
    .slice(0, MAX_ATTACHMENTS)
    .map(({ name, url, thumbUrl, type, kind, size, publicId, resourceType, uploadedAt }) => ({
      name, url, thumbUrl, type, kind, size, publicId, resourceType, uploadedAt,
    }));

module.exports = { attachmentSchema, cleanAttachments, MAX_ATTACHMENTS };
