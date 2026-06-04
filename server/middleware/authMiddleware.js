/**
 * =====================================================
 * AUTHENTICATION MIDDLEWARE
 * =====================================================
 * 
 * File: server/middleware/authMiddleware.js
 * Purpose: Protects routes by verifying JWT tokens
 *          in the Authorization header. Attaches decoded
 *          user data to req.user for downstream handlers.
 * 
 * NOTE: This is the boilerplate structure only.
 *       Full authentication logic will be implemented later.
 * 
 * Usage:
 *   const { authenticate } = require('./middleware/authMiddleware');
 *   router.get('/protected', authenticate, controller.method);
 * 
 * =====================================================
 */

const { verifyToken } = require('../utils/jwt');
const { sendError } = require('../utils/response');
const { HTTP_STATUS } = require('../config/constants');

/**
 * Middleware: Authenticate incoming requests via JWT.
 * 
 * Expects: Authorization: Bearer <token>
 * 
 * On success: Attaches decoded payload to req.user
 * On failure: Returns 401 Unauthorized
 */
function authenticate(req, res, next) {
  try {
    // TODO: Implement full authentication logic
    // 1. Extract token from Authorization header
    // 2. Verify token using verifyToken()
    // 3. Attach decoded user data to req.user
    // 4. Call next() to proceed

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    // Attach user payload to request object
    req.user = decoded;

    next();
  } catch (error) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Invalid or expired token.');
  }
}

/**
 * Middleware: Optional authentication.
 * If a valid token is present, attaches user data.
 * If no token is present, continues without error.
 * Useful for routes that behave differently for logged-in users.
 */
function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      req.user = verifyToken(token);
    }
  } catch (error) {
    // Token invalid — continue as unauthenticated
    req.user = null;
  }

  next();
}

module.exports = {
  authenticate,
  optionalAuth,
};
