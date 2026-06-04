/**
 * =====================================================
 * GLOBAL ERROR HANDLING MIDDLEWARE
 * =====================================================
 * 
 * File: server/middleware/errorMiddleware.js
 * Purpose: Catches all unhandled errors thrown in route
 *          handlers and returns a standardized JSON error
 *          response. This MUST be the last middleware
 *          registered in app.js.
 * 
 * =====================================================
 */

const { HTTP_STATUS } = require('../config/constants');
const logger = require('../utils/logger');

/**
 * Middleware: 404 Not Found handler.
 * Catches requests that don't match any defined route.
 */
function notFoundHandler(req, res, next) {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

/**
 * Middleware: Global error handler.
 * Catches all errors thrown or passed via next(error).
 * 
 * Express recognizes this as an error handler because
 * it has 4 parameters: (err, req, res, next).
 */
function globalErrorHandler(err, req, res, next) {
  // Log the full error for server-side debugging
  logger.error(`[${req.method}] ${req.originalUrl} → ${err.message}`, {
    stack: err.stack,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  // Determine the status code
  const statusCode = err.statusCode || err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;

  // Build the response
  const response = {
    success: false,
    message: err.message || 'Internal Server Error',
  };

  // Include stack trace only in development
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

module.exports = {
  notFoundHandler,
  globalErrorHandler,
};
