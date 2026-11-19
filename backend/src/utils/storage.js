/**
 * File storage for uploaded photos and documents.
 *
 * - Production: Cloudinary (set CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET).
 *   Images are stored as images (with a resized thumbnail URL); PDFs and Office files
 *   are stored as "raw" files so Cloudinary delivers them as normal downloads.
 * - Local development / tests: when Cloudinary is not configured, files are written to
 *   ./uploads and served by this API at /uploads/... . Hosts such as Render wipe this
 *   folder on every restart, so Cloudinary is required in production.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;

const UPLOAD_DIR = path.resolve(__dirname, '../../uploads');

const hasCloudinary = () =>
  Boolean(process.env.CLOUDINARY_NAME && process.env.CLOUDINARY_KEY && process.env.CLOUDINARY_SECRET);

function configure() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true,
  });
}

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

/** "pdf" | "image" | "document", as the website's attachment list expects. */
const kindOf = (mimetype, name = '') => {
  if (IMAGE_TYPES.includes(mimetype)) return 'image';
  if (mimetype === 'application/pdf' || /\.pdf$/i.test(name)) return 'pdf';
  return 'document';
};

/** Safe, readable file name part: "Circular No 5.pdf" -> "circular-no-5". */
const baseName = (name) =>
  path
    .basename(name, path.extname(name))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'file';

const randomId = () => crypto.randomBytes(5).toString('hex');

/** Cloudinary thumbnail: same picture, at most 600 px wide, automatic format and quality. */
const cloudinaryThumb = (url) => url.replace('/upload/', '/upload/c_limit,w_600,f_auto,q_auto/');

function uploadToCloudinary(file, folder) {
  configure();
  const kind = kindOf(file.mimetype, file.originalname);
  const ext = path.extname(file.originalname).toLowerCase();
  const isImage = kind === 'image';
  const options = isImage
    ? { folder, resource_type: 'image', public_id: `${baseName(file.originalname)}-${randomId()}` }
    : // Raw files keep their extension in the id, so the download has the right type.
      { folder, resource_type: 'raw', public_id: `${baseName(file.originalname)}-${randomId()}${ext}` };

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve({
        url: result.secure_url,
        thumbUrl: isImage ? cloudinaryThumb(result.secure_url) : undefined,
        width: result.width,
        height: result.height,
        publicId: result.public_id,
        resourceType: result.resource_type,
      });
    });
    stream.end(file.buffer);
  });
}

async function uploadToDisk(file, folder, publicBase) {
  const dir = path.join(UPLOAD_DIR, folder);
  await fs.promises.mkdir(dir, { recursive: true });
  const name = `${baseName(file.originalname)}-${randomId()}${path.extname(file.originalname).toLowerCase()}`;
  await fs.promises.writeFile(path.join(dir, name), file.buffer);
  const url = `${publicBase}/uploads/${folder}/${name}`;
  return { url, thumbUrl: kindOf(file.mimetype) === 'image' ? url : undefined, publicId: `${folder}/${name}`, resourceType: 'local' };
}

/**
 * Stores one uploaded file (from multer's memory storage).
 * @param publicBase address of this API, e.g. "https://jmj-api.onrender.com" (used for local files only)
 */
async function storeFile(file, folder, publicBase) {
  if (hasCloudinary()) return uploadToCloudinary(file, folder);
  if (process.env.NODE_ENV === 'production') {
    throw Object.assign(new Error('File uploads are not set up on the server yet (Cloudinary settings are missing).'), {
      statusCode: 503,
    });
  }
  return uploadToDisk(file, folder, publicBase);
}

/** Deletes a stored file. Never throws: a missing file must not block deleting the record. */
async function removeFile(publicId, resourceType) {
  if (!publicId) return;
  try {
    if (resourceType === 'local') {
      const target = path.resolve(UPLOAD_DIR, publicId);
      if (target.startsWith(UPLOAD_DIR + path.sep)) await fs.promises.unlink(target);
      return;
    }
    if (!hasCloudinary()) return;
    configure();
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType === 'raw' ? 'raw' : 'image' });
  } catch (err) {
    console.error('File delete failed:', err.message);
  }
}

module.exports = { storeFile, removeFile, kindOf, hasCloudinary, UPLOAD_DIR, IMAGE_TYPES };
