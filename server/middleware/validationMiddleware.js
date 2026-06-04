/**
 * =====================================================
 * VALIDATION MIDDLEWARE
 * =====================================================
 * 
 * File: server/middleware/validationMiddleware.js
 * Purpose: Provides a generic middleware factory for
 *          running validator functions before controller
 *          logic executes.
 * 
 * NOTE: Specific validation rules live in server/validators/.
 *       This middleware runs those rules and collects errors.
 * 
 * Usage:
 *   const { validate } = require('./middleware/validationMiddleware');
 *   const { registerRules } = require('./validators/authValidator');
 *   router.post('/register', registerRules, validate, controller.register);
 * 
 * =====================================================
 */

const { sendError } = require('../utils/response');
const { HTTP_STATUS } = require('../config/constants');

/**
 * Middleware: Collects validation errors from req.validationErrors
 * and returns a 422 response if any exist.
 * 
 * Individual validators should push errors to req.validationErrors[].
 */
function validate(req, res, next) {
  // TODO: Implement validation error collection logic
  // This placeholder simply passes through for now.

  const errors = req.validationErrors || [];

  if (errors.length > 0) {
    return sendError(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, 'Validation failed', {
      errors,
    });
  }

  next();
}

module.exports = {
  validate,
};
