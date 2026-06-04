/**
 * =====================================================
 * COMMENT VALIDATOR — Input Validation for Comment Routes
 * =====================================================
 * 
 * File: server/validators/commentValidator.js
 * NOTE: Placeholder validation rules.
 * 
 * =====================================================
 */

const { VALIDATION } = require('../config/constants');

function validateCreateComment(req, res, next) {
  req.validationErrors = [];

  const { content } = req.body;

  if (!content || content.trim().length === 0) {
    req.validationErrors.push({
      field: 'content',
      message: 'Comment content is required',
    });
  }

  if (content && content.length > VALIDATION.COMMENT_CONTENT_MAX_LENGTH) {
    req.validationErrors.push({
      field: 'content',
      message: `Comment must not exceed ${VALIDATION.COMMENT_CONTENT_MAX_LENGTH} characters`,
    });
  }

  next();
}

module.exports = {
  validateCreateComment,
};
