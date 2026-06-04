/**
 * =====================================================
 * STANDARDIZED API RESPONSE UTILITY
 * =====================================================
 * 
 * File: server/utils/response.js
 * Purpose: Provides helper functions to send consistent,
 *          structured JSON responses from any controller.
 * 
 * Response Format:
 *   {
 *     success: true|false,
 *     message: "Human-readable message",
 *     data: { ... } | null,
 *     error: { ... } | null
 *   }
 * 
 * Usage:
 *   const { sendSuccess, sendError } = require('./utils/response');
 *   sendSuccess(res, 200, 'User created', { user });
 *   sendError(res, 404, 'User not found');
 * 
 * =====================================================
 */

/**
 * Sends a successful JSON response.
 * 
 * @param {import('express').Response} res - Express response object
 * @param {number} statusCode - HTTP status code (e.g. 200, 201)
 * @param {string} message - Human-readable success message
 * @param {object|null} data - Response payload (optional)
 */
function sendSuccess(res, statusCode = 200, message = 'Success', data = null) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

/**
 * Sends an error JSON response.
 * 
 * @param {import('express').Response} res - Express response object
 * @param {number} statusCode - HTTP status code (e.g. 400, 500)
 * @param {string} message - Human-readable error message
 * @param {object|null} error - Error details (optional, hidden in production)
 */
function sendError(res, statusCode = 500, message = 'Internal Server Error', error = null) {
  const env = require('../config/env');

  return res.status(statusCode).json({
    success: false,
    message,
    // Only include error details in development
    error: env.IS_DEVELOPMENT ? error : undefined,
  });
}

/**
 * Sends a paginated JSON response.
 * 
 * @param {import('express').Response} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {Array} data - Array of results
 * @param {object} pagination - Pagination metadata
 * @param {number} pagination.page - Current page number
 * @param {number} pagination.limit - Items per page
 * @param {number} pagination.total - Total items count
 */
function sendPaginated(res, statusCode = 200, message = 'Success', data = [], pagination = {}) {
  const { page = 1, limit = 20, total = 0 } = pagination;

  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  });
}

module.exports = {
  sendSuccess,
  sendError,
  sendPaginated,
};
