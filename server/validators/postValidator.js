/**
 * =====================================================
 * POST VALIDATOR — Input Validation for Post Routes
 * =====================================================
 * 
 * File: server/validators/postValidator.js
 * NOTE: Placeholder validation rules.
 * 
 * =====================================================
 */

const { VALIDATION } = require('../config/constants');

function validateCreatePost(req, res, next) {
  req.validationErrors = [];

  const { content } = req.body;

  if (!content || content.trim().length === 0) {
    req.validationErrors.push({
      field: 'content',
      message: 'Post content is required',
    });
  }

  if (content && content.length > VALIDATION.POST_CONTENT_MAX_LENGTH) {
    req.validationErrors.push({
      field: 'content',
      message: `Post content must not exceed ${VALIDATION.POST_CONTENT_MAX_LENGTH} characters`,
    });
  }

  // TODO: Add visibility validation, etc.

  next();
}

module.exports = {
  validateCreatePost,
};
