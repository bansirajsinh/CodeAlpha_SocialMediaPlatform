/**
 * =====================================================
 * JWT UTILITY — Token Generation & Verification
 * =====================================================
 * 
 * File: server/utils/jwt.js
 * Purpose: Provides helper functions for creating and
 *          verifying JSON Web Tokens (JWT) used for
 *          user authentication.
 * 
 * Usage:
 *   const { generateToken, verifyToken } = require('./utils/jwt');
 *   const token = generateToken({ userId: 1 });
 *   const decoded = verifyToken(token);
 * 
 * NOTE: Actual authentication logic will be implemented
 *       later. These are utility wrappers only.
 * 
 * =====================================================
 */

const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Generates a signed JWT token.
 * 
 * @param {object} payload - Data to encode in the token (e.g., { userId, username })
 * @returns {string} Signed JWT token string
 */
function generateToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

/**
 * Verifies and decodes a JWT token.
 * 
 * @param {string} token - JWT token string to verify
 * @returns {object} Decoded payload if token is valid
 * @throws {JsonWebTokenError} If token is invalid or expired
 */
function verifyToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}

module.exports = {
  generateToken,
  verifyToken,
};
