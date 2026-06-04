/**
 * =====================================================
 * USER VALIDATOR — Input Validation for User Routes
 * =====================================================
 * 
 * File: server/validators/userValidator.js
 * NOTE: Placeholder validation rules.
 * 
 * =====================================================
 */

const { VALIDATION } = require('../config/constants');

function validateUpdateProfile(req, res, next) {
  req.validationErrors = [];

  const { bio } = req.body;

  if (bio && bio.length > VALIDATION.BIO_MAX_LENGTH) {
    req.validationErrors.push({
      field: 'bio',
      message: `Bio must not exceed ${VALIDATION.BIO_MAX_LENGTH} characters`,
    });
  }

  // TODO: Add more profile update validations

  next();
}

module.exports = {
  validateUpdateProfile,
};
