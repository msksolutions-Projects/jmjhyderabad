const multer = require('multer');
const { IMAGE_TYPES } = require('../utils/storage');

// Files are kept in memory and passed straight on to storage (Cloudinary in production).
const storage = multer.memoryStorage();

const DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
];

const filter = (allowed, message) => (req, file, cb) => {
  if (allowed.includes(file.mimetype)) return cb(null, true);
  const err = new Error(message);
  err.statusCode = 400;
  cb(err, false);
};

/** Gallery photos: images only, 10 MB each. */
const imageUpload = multer({
  storage,
  fileFilter: filter(IMAGE_TYPES, 'Only image files are allowed (JPG, PNG, WebP or GIF).'),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
});

/** News and notice attachments: images, PDF and Office documents, 15 MB each (matches the admin screen). */
const fileUpload = multer({
  storage,
  fileFilter: filter([...IMAGE_TYPES, ...DOCUMENT_TYPES], 'This file type is not allowed. Use PDF, Word, Excel, PowerPoint, text or an image.'),
  limits: { fileSize: 15 * 1024 * 1024, files: 1 },
});

module.exports = { imageUpload, fileUpload };
