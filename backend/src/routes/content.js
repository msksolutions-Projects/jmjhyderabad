/**
 * Shared list / read / create / update / delete routes for News and Notices.
 *
 * Visitors: read published items only.
 * Signed-in admins: everything, including drafts; create, edit and delete.
 */
const express = require('express');
const { protect, optionalAdmin } = require('../middleware/auth');
const { handle, pick, limitFrom } = require('../utils/http');
const { cleanAttachments } = require('../models/attachment');
const { removeFile } = require('../utils/storage');

const STATUSES = ['draft', 'published', 'archived'];

function contentRouter({ Model, label, fields, publicFilter = () => ({}) }) {
  const router = express.Router();
  const notFound = (res) => res.status(404).json({ success: false, message: `${label} not found.` });

  /** Body of a create/update request, limited to the fields the admin screen can edit. */
  const bodyOf = (req) => {
    const data = pick(req.body, fields);
    if (req.body && req.body.attachments !== undefined) data.attachments = cleanAttachments(req.body.attachments);
    if (data.status !== undefined && !STATUSES.includes(data.status)) data.status = 'draft';
    return data;
  };

  /** Files that were attached before but are no longer: delete them from storage. */
  const removeDropped = (before = [], after = []) => {
    const keep = new Set(after.map((a) => a.url));
    before.filter((a) => !keep.has(a.url)).forEach((a) => removeFile(a.publicId, a.resourceType));
  };

  // List
  router.get(
    '/',
    optionalAdmin,
    handle(async (req, res) => {
      const limit = limitFrom(req.query.limit, 50, 500);
      const query = {};
      if (req.admin) {
        // Admin screens send status="" for "all"; otherwise filter by the given status.
        if (req.query.status && STATUSES.includes(req.query.status)) query.status = req.query.status;
      } else {
        Object.assign(query, { status: 'published' }, publicFilter());
      }
      if (req.query.category) query.category = String(req.query.category);
      const sort = req.admin ? { createdAt: -1 } : { publishedAt: -1, createdAt: -1 };
      const items = await Model.find(query).sort(sort).limit(limit).populate('author', 'name');
      res.json({ success: true, count: items.length, data: items });
    }),
  );

  // Read one (visitors: published only)
  router.get(
    '/:id',
    optionalAdmin,
    handle(async (req, res) => {
      const item = await Model.findById(req.params.id).populate('author', 'name');
      if (!item || (!req.admin && item.status !== 'published')) return notFound(res);
      res.json({ success: true, data: item });
    }),
  );

  // Create
  router.post(
    '/',
    protect,
    handle(async (req, res) => {
      const item = new Model({ ...bodyOf(req), author: req.admin._id });
      await item.save();
      res.status(201).json({ success: true, message: `${label} saved.`, data: item });
    }),
  );

  // Edit
  router.put(
    '/:id',
    protect,
    handle(async (req, res) => {
      const item = await Model.findById(req.params.id);
      if (!item) return notFound(res);
      const before = item.attachments ? item.attachments.map((a) => a.toObject()) : [];
      const data = bodyOf(req);
      Object.assign(item, data);
      await item.save();
      if (data.attachments) removeDropped(before, data.attachments);
      res.json({ success: true, message: `${label} updated.`, data: item });
    }),
  );

  // Delete (and its attached files)
  router.delete(
    '/:id',
    protect,
    handle(async (req, res) => {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) return notFound(res);
      (item.attachments || []).forEach((a) => removeFile(a.publicId, a.resourceType));
      res.json({ success: true, message: `${label} deleted.` });
    }),
  );

  return router;
}

module.exports = { contentRouter };
