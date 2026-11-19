const { verifyToken } = require('../utils/jwt');
const Admin = require('../models/Admin');

const tokenFrom = (req) => {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7).trim() : null;
};

/** Looks up the admin for a valid token, or returns null. */
async function adminFromRequest(req) {
  const token = tokenFrom(req);
  if (!token) return null;
  try {
    const decoded = verifyToken(token);
    const admin = await Admin.findById(decoded.id);
    return admin && admin.isActive ? admin : null;
  } catch {
    return null;
  }
}

/** Only signed-in, active administrators may continue. */
const protect = async (req, res, next) => {
  const token = tokenFrom(req);
  if (!token) {
    return res.status(401).json({ success: false, message: 'Please sign in to continue.' });
  }
  try {
    const decoded = verifyToken(token);
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Your session has ended. Please sign in again.' });
    }
    if (!admin.isActive) {
      return res.status(403).json({ success: false, message: 'This admin account is inactive.' });
    }
    req.admin = admin;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Your session has ended. Please sign in again.' });
  }
};

/**
 * For public lists: visitors only ever see published items. A signed-in admin may ask for
 * drafts too (the admin screens send status="" for "everything").
 */
const optionalAdmin = async (req, res, next) => {
  req.admin = await adminFromRequest(req);
  next();
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.admin.role)) {
    return res.status(403).json({ success: false, message: 'Your role is not allowed to do this.' });
  }
  next();
};

module.exports = { protect, optionalAdmin, authorize };
