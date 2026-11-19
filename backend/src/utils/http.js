/** Shared helpers for route handlers. */

/** Turns database/validation errors into a clear message with the right HTTP status. */
function sendError(res, err, fallback = 'Something went wrong. Please try again.') {
  if (err && err.name === 'ValidationError') {
    const first = Object.values(err.errors)[0];
    return res.status(400).json({ success: false, message: first ? first.message : 'Please check the form.' });
  }
  if (err && err.name === 'CastError') {
    return res.status(404).json({ success: false, message: 'Not found.' });
  }
  const status = err && err.statusCode ? err.statusCode : 500;
  if (status >= 500) console.error(err);
  return res.status(status).json({ success: false, message: status >= 500 ? fallback : err.message });
}

/** Wraps an async handler so thrown errors become JSON replies. */
const handle = (fn, fallback) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((err) => sendError(res, err, fallback));

/** Copies only the allowed fields that were actually sent. */
const pick = (body, fields) =>
  Object.fromEntries(fields.filter((f) => body && body[f] !== undefined).map((f) => [f, body[f]]));

/** Positive whole number from a query string, capped. */
const limitFrom = (value, fallback, max) => {
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? Math.min(n, max) : fallback;
};

/** This API's own public address, e.g. "https://jmj-api.onrender.com". */
const publicBase = (req) => process.env.PUBLIC_API_URL || `${req.protocol}://${req.get('host')}`;

module.exports = { sendError, handle, pick, limitFrom, publicBase };
