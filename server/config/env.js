/**
 * =====================================================
 * ENVIRONMENT CONFIGURATION — Centralized Env Loader
 * =====================================================
 * 
 * File: server/config/env.js
 * Purpose: Loads and validates all environment variables
 *          from the .env file and exports them as a
 *          single configuration object.
 * 
 * Benefits:
 *   - Single source of truth for all env variables
 *   - Type coercion (strings → numbers/booleans)
 *   - Default values for optional variables
 *   - Early validation to catch misconfigurations
 * 
 * Usage:
 *   const env = require('./config/env');
 *   console.log(env.PORT); // 3000
 * 
 * =====================================================
 */

const dotenv = require('dotenv');
const path = require('path');

// Load the .env file from the project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// -----------------------------------------------------
// Exported configuration object
// -----------------------------------------------------
const env = {
  // --- Server ---
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 3000,

  // --- Database ---
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT, 10) || 3306,
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'social_media_app',
  DB_CONNECTION_LIMIT: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10,

  // --- JWT ---
  JWT_SECRET: process.env.JWT_SECRET || 'default_dev_secret_change_me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',

  // --- Bcrypt ---
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,

  // --- File Uploads ---
  UPLOAD_MAX_SIZE: parseInt(process.env.UPLOAD_MAX_SIZE, 10) || 5 * 1024 * 1024, // 5MB
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'public/assets/uploads',

  // --- CORS ---
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // --- Logging ---
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',

  // --- Computed / Derived ---
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV !== 'production',
};

// -----------------------------------------------------
// Validate critical environment variables
// -----------------------------------------------------
/**
 * Ensures that all required environment variables are set.
 * Logs warnings for missing optional variables in development.
 * Throws in production if critical values are missing.
 */
function validateEnv() {
  const required = ['DB_HOST', 'DB_USER', 'DB_NAME'];

  const missing = required.filter((key) => !env[key]);

  if (missing.length > 0) {
    const message = `❌ [ENV] Missing required environment variables: ${missing.join(', ')}`;
    if (env.IS_PRODUCTION) {
      throw new Error(message);
    } else {
      console.warn(message);
    }
  }

  // Warn if JWT secret is still the default in production
  if (env.IS_PRODUCTION && env.JWT_SECRET === 'default_dev_secret_change_me') {
    throw new Error('❌ [ENV] JWT_SECRET must be set to a secure value in production');
  }
}

// Run validation on module load
validateEnv();

module.exports = env;
