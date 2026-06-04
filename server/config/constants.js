/**
 * =====================================================
 * APPLICATION CONSTANTS
 * =====================================================
 * 
 * File: server/config/constants.js
 * Purpose: Centralizes all magic numbers, status codes,
 *          enum values, and configuration constants used
 *          throughout the application.
 * 
 * Benefits:
 *   - Eliminates magic numbers/strings in business logic
 *   - Single place to update shared values
 *   - Self-documenting via descriptive constant names
 * 
 * =====================================================
 */

// -----------------------------------------------------
// HTTP Status Codes
// -----------------------------------------------------
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// -----------------------------------------------------
// Pagination Defaults
// -----------------------------------------------------
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

// -----------------------------------------------------
// User Account Status
// -----------------------------------------------------
const ACCOUNT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  DELETED: 'deleted',
};

// -----------------------------------------------------
// Post Visibility Levels
// -----------------------------------------------------
const POST_VISIBILITY = {
  PUBLIC: 'public',
  FOLLOWERS_ONLY: 'followers_only',
  PRIVATE: 'private',
};

// -----------------------------------------------------
// Post Types
// -----------------------------------------------------
const POST_TYPE = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  SHARED: 'shared',
};

// -----------------------------------------------------
// Notification Types
// -----------------------------------------------------
const NOTIFICATION_TYPE = {
  LIKE: 'like',
  COMMENT: 'comment',
  FOLLOW: 'follow',
  MENTION: 'mention',
  SHARE: 'share',
};

// -----------------------------------------------------
// Follow / Relationship Status
// -----------------------------------------------------
const FOLLOW_STATUS = {
  FOLLOWING: 'following',
  BLOCKED: 'blocked',
  MUTED: 'muted',
};

// -----------------------------------------------------
// Activity Log Types
// -----------------------------------------------------
const ACTIVITY_TYPE = {
  LOGIN: 'login',
  POST: 'post',
  LIKE: 'like',
  COMMENT: 'comment',
  FOLLOW: 'follow',
  MESSAGE: 'message',
};

// -----------------------------------------------------
// File Upload Constraints
// -----------------------------------------------------
const UPLOAD = {
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5 MB
  MAX_FILES_PER_POST: 4,
};

// -----------------------------------------------------
// Validation Limits
// -----------------------------------------------------
const VALIDATION = {
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 100,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  BIO_MAX_LENGTH: 500,
  POST_CONTENT_MAX_LENGTH: 5000,
  COMMENT_CONTENT_MAX_LENGTH: 2000,
  MESSAGE_CONTENT_MAX_LENGTH: 5000,
};

module.exports = {
  HTTP_STATUS,
  PAGINATION,
  ACCOUNT_STATUS,
  POST_VISIBILITY,
  POST_TYPE,
  NOTIFICATION_TYPE,
  FOLLOW_STATUS,
  ACTIVITY_TYPE,
  UPLOAD,
  VALIDATION,
};
