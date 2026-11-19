/**
 * /api/v1/uploads — attachments for news and notices (admins only).
 * POST stores one file and returns its details; the editor then saves them with the article.
 * DELETE removes a file that was uploaded but not kept (e.g. the editor was cancelled).
 */
const express = require('express');
const { protect } = require('../middleware/auth');
const { fileUpload } = require('../middleware/upload');
const { storeFile, removeFile, kindOf } = require('../utils/storage');
const { handle, publicBase } = require('../utils/http');

const router = express.Router();

router.post(
  '/',
  protect,
  fileUpload.single('file'),
  handle(async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'Please choose a file to upload.' });
    const kind = kindOf(req.file.mimetype, req.file.originalname);
    const stored = await storeFile(req.file, kind === 'image' ? 'jmj-attachments' : 'jmj-documents', publicBase(req));
    res.status(201).json({
      success: true,
      data: {
        name: req.file.originalname.slice(0, 200),
        url: stored.url,
        thumbUrl: stored.thumbUrl,
        type: req.file.mimetype,
        kind,
        size: req.file.size,
        publicId: stored.publicId,
        resourceType: stored.resourceType,
        uploadedAt: new Date().toISOString(),
      },
    });
  }, 'The file could not be uploaded. Please try again.'),
);

router.delete(
  '/',
  protect,
  handle(async (req, res) => {
    const { publicId, resourceType } = req.body || {};
    if (typeof publicId !== 'string' || !publicId) {
      return res.status(400).json({ success: false, message: 'Which file should be deleted?' });
    }
    await removeFile(publicId, typeof resourceType === 'string' ? resourceType : undefined);
    res.json({ success: true, message: 'File deleted.' });
  }),
);

module.exports = router;
