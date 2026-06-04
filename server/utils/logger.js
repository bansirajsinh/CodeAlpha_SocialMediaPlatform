/**
 * =====================================================
 * LOGGER UTILITY
 * =====================================================
 * 
 * File: server/utils/logger.js
 * Purpose: Provides a lightweight, configurable logging
 *          utility with timestamp and level prefixes.
 * 
 * Levels: ERROR > WARN > INFO > DEBUG
 * 
 * Usage:
 *   const logger = require('./utils/logger');
 *   logger.info('Server started');
 *   logger.error('Something failed', error);
 * 
 * =====================================================
 */

const env = require('../config/env');

// Log level hierarchy (lower number = higher severity)
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

// Current log level from environment
const currentLevel = LOG_LEVELS[env.LOG_LEVEL] ?? LOG_LEVELS.debug;

/**
 * Formats a log message with timestamp, level, and content.
 * @param {string} level - The log level (ERROR, WARN, INFO, DEBUG)
 * @param {string} message - The log message
 * @returns {string} Formatted log string
 */
function formatMessage(level, message) {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
}

const logger = {
  /**
   * Logs an error-level message (always shown).
   * @param {string} message - Error description
   * @param  {...any} args - Additional data to log
   */
  error(message, ...args) {
    if (currentLevel >= LOG_LEVELS.error) {
      console.error(formatMessage('ERROR', message), ...args);
    }
  },

  /**
   * Logs a warning-level message.
   * @param {string} message - Warning description
   * @param  {...any} args - Additional data to log
   */
  warn(message, ...args) {
    if (currentLevel >= LOG_LEVELS.warn) {
      console.warn(formatMessage('WARN', message), ...args);
    }
  },

  /**
   * Logs an info-level message.
   * @param {string} message - Informational message
   * @param  {...any} args - Additional data to log
   */
  info(message, ...args) {
    if (currentLevel >= LOG_LEVELS.info) {
      console.log(formatMessage('INFO', message), ...args);
    }
  },

  /**
   * Logs a debug-level message (most verbose).
   * @param {string} message - Debug message
   * @param  {...any} args - Additional data to log
   */
  debug(message, ...args) {
    if (currentLevel >= LOG_LEVELS.debug) {
      console.log(formatMessage('DEBUG', message), ...args);
    }
  },
};

module.exports = logger;
