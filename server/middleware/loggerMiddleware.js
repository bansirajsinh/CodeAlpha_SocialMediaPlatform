/**
 * =====================================================
 * REQUEST LOGGER MIDDLEWARE
 * =====================================================
 * 
 * File: server/middleware/loggerMiddleware.js
 * Purpose: Logs every incoming HTTP request with method,
 *          URL, status code, and response time.
 * 
 * =====================================================
 */

const logger = require('../utils/logger');

/**
 * Middleware: Logs incoming requests and response timing.
 */
function requestLogger(req, res, next) {
  const start = Date.now();

  // Log when the response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;

    // Color-code by status range
    const level = statusCode >= 400 ? 'warn' : 'info';

    logger[level](
      `${req.method} ${req.originalUrl} → ${statusCode} (${duration}ms)`
    );
  });

  next();
}

module.exports = {
  requestLogger,
};
