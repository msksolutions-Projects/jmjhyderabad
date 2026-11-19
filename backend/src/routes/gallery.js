/**
 * /api/v1/gallery — photos added through the admin.
 * Visitors see published photos; admins upload, edit details and delete.
 */
const express = require('express');
const { protect, optionalAdmin } = require('../middleware/auth');
const { imageUpload } = require('../middleware/upload');
const { storeFile, removeFile } = require('../utils/storage');
const { handle, pick, limitFrom, publicBase } = require('../utils/http');
const Gallery = require('../models/Gallery');

const router = express.Router();
const STATUSES = ['draft', 'published', 'archived'];
const FIELDS = ['title', 'description', 'album', 'category', 'status'];
const notFound = (res) => res.status(404).json({ success: false, message: 'Photo not found.' });

// List (visitors: published only; the website asks for up to 5000)
router.get(
  '/',
  optionalAdmin,
  handle(async (req, res) => {
    const limit = limitFrom(req.query.limit, 200, 5000);
    const query = {};
    if (req.admin) {
      if (req.query.status && STATUSES.includes(req.query.status)) query.status = req.query.status;
    } else {
      query.status = 'published';
    }
    if (req.query.category) query.category = String(req.query.category);
    if (req.query.album) query.album = String(req.query.album);
    const items = await Gallery.find(query).sort({ createdAt: -1 }).limit(limit);
    res.json({ success: true, count: items.length, data: items });
  }),
);

// Upload one photo (the bulk uploader sends photos one at a time)
router.post(
  '/',
  protect,
  imageUpload.single('image'),
  handle(async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'Please choose a photo to upload.' });
    const data = pick(req.body, [...FIELDS, 'sourceFile']);
    if (!STATUSES.includes(data.status)) data.status = 'published';
    const item = new Gallery({ ...data, title: (data.title || req.file.originalname).slice(0, 200), author: req.admin._id });
    await item.validate(['title', 'description', 'album', 'category']); // check the form before storing the file
    const stored = await storeFile(req.file, 'jmj-gallery', publicBase(req));
    item.coverImage = stored;
    try {
      await item.save();
    } catch (err) {
      await removeFile(stored.publicId, stored.resourceType);
      throw err;
    }
    res.status(201).json({ success: true, message: 'Photo uploaded.', data: item });
  }, 'The photo could not be uploaded. Please try again.'),
);

// Edit details (the photo itself stays the same)
router.put(
  '/:id',
  protect,
  handle(async (req, res) => {
    const item = await Gallery.findById(req.params.id);
    if (!item) return notFound(res);
    const data = pick(req.body, FIELDS);
    if (data.status !== undefined && !STATUSES.includes(data.status)) delete data.status;
    Object.assign(item, data);
    await item.save();
    res.json({ success: true, message: 'Photo updated.', data: item });
  }),
);

// Delete the photo and its stored file
router.delete(
  '/:id',
  protect,
  handle(async (req, res) => {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    if (!item) return notFound(res);
    if (item.coverImage) await removeFile(item.coverImage.publicId, item.coverImage.resourceType);
    res.json({ success: true, message: 'Photo deleted.' });
  }),
);

module.exports = router;
