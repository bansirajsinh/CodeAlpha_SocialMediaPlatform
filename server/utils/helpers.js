/**
 * =====================================================
 * HELPER FUNCTIONS
 * =====================================================
 * 
 * File: server/utils/helpers.js
 * Purpose: Shared utility functions used across the
 *          application for common operations.
 * 
 * =====================================================
 */

/**
 * Extracts pagination parameters from a request query string.
 * Applies defaults and enforces maximum limits.
 * 
 * @param {object} query - Express req.query object
 * @returns {{ page: number, limit: number, offset: number }}
 */
function getPagination(query) {
  const { PAGINATION } = require('../config/constants');

  let page = parseInt(query.page, 10) || PAGINATION.DEFAULT_PAGE;
  let limit = parseInt(query.limit, 10) || PAGINATION.DEFAULT_LIMIT;

  // Enforce boundaries
  page = Math.max(1, page);
  limit = Math.min(Math.max(1, limit), PAGINATION.MAX_LIMIT);

  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Sanitizes a string by trimming whitespace and removing
 * potentially dangerous HTML tags.
 * 
 * @param {string} str - The input string
 * @returns {string} Sanitized string
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/<[^>]*>/g, '');
}

/**
 * Generates a slug from a string (for URL-friendly identifiers).
 * 
 * @param {string} text - The input text
 * @returns {string} URL-friendly slug
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with hyphens
    .replace(/[^\w-]+/g, '')    // Remove non-word characters
    .replace(/--+/g, '-')       // Replace multiple hyphens with single
    .replace(/^-+/, '')         // Trim leading hyphens
    .replace(/-+$/, '');        // Trim trailing hyphens
}

/**
 * Extracts hashtags from post content.
 * 
 * @param {string} content - The post content string
 * @returns {string[]} Array of hashtag strings (with #)
 */
function extractHashtags(content) {
  if (!content) return [];
  const matches = content.match(/#[\w]+/g);
  return matches ? [...new Set(matches)] : [];
}

module.exports = {
  getPagination,
  sanitizeString,
  slugify,
  extractHashtags,
};
