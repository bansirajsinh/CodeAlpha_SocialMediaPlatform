/**
 * =====================================================
 * AUTH VALIDATOR — Input Validation for Auth Routes
 * =====================================================
 * 
 * File: server/validators/authValidator.js
 * Purpose: Validates registration and login request bodies
 *          using the 'validator' package.
 * 
 * NOTE: Placeholder validation rules.
 *       Full validation logic will be implemented later.
 * 
 * =====================================================
 */

const validator = require('validator');
const { VALIDATION } = require('../config/constants');

/**
 * Validates registration request body.
 * Pushes errors to req.validationErrors[].
 */
function validateRegister(req, res, next) {
  req.validationErrors = [];

  const { username, email, password } = req.body;

  // TODO: Implement comprehensive validation
  // - Username: required, min/max length, alphanumeric
  // - Email: required, valid format
  // - Password: required, min length, complexity

  if (!username || username.trim().length < VALIDATION.USERNAME_MIN_LENGTH) {
    req.validationErrors.push({
      field: 'username',
      message: `Username must be at least ${VALIDATION.USERNAME_MIN_LENGTH} characters`,
    });
  }

  if (!email || !validator.isEmail(email)) {
    req.validationErrors.push({
      field: 'email',
      message: 'A valid email address is required',
    });
  }

  if (!password || password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    req.validationErrors.push({
      field: 'password',
      message: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`,
    });
  }

  next();
}

/**
 * Validates login request body.
 */
function validateLogin(req, res, next) {
  req.validationErrors = [];

  const { email, password } = req.body;

  if (!email || !validator.isEmail(email)) {
    req.validationErrors.push({
      field: 'email',
      message: 'A valid email address is required',
    });
  }

  if (!password) {
    req.validationErrors.push({
      field: 'password',
      message: 'Password is required',
    });
  }

  next();
}

module.exports = {
  validateRegister,
  validateLogin,
};
