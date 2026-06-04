/**
 * =====================================================
 * FILE UPLOAD MIDDLEWARE (Multer)
 * =====================================================
 * 
 * File: server/middleware/uploadMiddleware.js
 * Purpose: Configures Multer for handling file uploads
 *          (profile pictures, post images, message attachments).
 * 
 * NOTE: This is the configuration boilerplate only.
 *       Upload endpoints will be implemented later.
 * 
 * =====================================================
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { UPLOAD } = require('../config/constants');
const env = require('../config/env');

// Ensure upload directory exists
const uploadDirAbsolute = path.resolve(__dirname, '../../', env.UPLOAD_DIR);
if (!fs.existsSync(uploadDirAbsolute)) {
  fs.mkdirSync(uploadDirAbsolute, { recursive: true });
}

// -----------------------------------------------------
// Storage Configuration
// -----------------------------------------------------
// Files are stored on disk in the uploads directory
// with a unique filename to prevent collisions.
// -----------------------------------------------------
const storage = multer.diskStorage({
  /**
   * Determines the upload destination directory.
   */
  destination: (req, file, cb) => {
    const uploadPath = path.resolve(__dirname, '../../', env.UPLOAD_DIR);
    cb(null, uploadPath);
  },

  /**
   * Generates a unique filename using timestamp + random string.
   * Preserves the original file extension.
   */
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// -----------------------------------------------------
// File Filter — Only allow image files
// -----------------------------------------------------
function fileFilter(req, file, cb) {
  if (UPLOAD.ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Only JPEG, PNG, GIF, and WebP are allowed.`), false);
  }
}

// -----------------------------------------------------
// Multer Instances
// -----------------------------------------------------

/**
 * Upload handler for a single image file.
 * Field name: 'image'
 */
const uploadSingle = multer({
  storage,
  fileFilter,
  limits: { fileSize: UPLOAD.MAX_FILE_SIZE },
}).single('image');

/**
 * Upload handler for multiple image files.
 * Field name: 'images', max 4 files per request.
 */
const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: { fileSize: UPLOAD.MAX_FILE_SIZE },
}).array('images', UPLOAD.MAX_FILES_PER_POST);

/**
 * Upload handler for profile picture.
 * Field name: 'profilePicture'
 */
const uploadProfilePicture = multer({
  storage,
  fileFilter,
  limits: { fileSize: UPLOAD.MAX_FILE_SIZE },
}).single('profilePicture');

/**
 * Upload handler for profile fields (avatar and cover).
 */
const uploadProfileFields = multer({
  storage,
  fileFilter,
  limits: { fileSize: UPLOAD.MAX_FILE_SIZE },
}).fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'cover', maxCount: 1 },
]);

module.exports = {
  uploadSingle,
  uploadMultiple,
  uploadProfilePicture,
  uploadProfileFields,
};

