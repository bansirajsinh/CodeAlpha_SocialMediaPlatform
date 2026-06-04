/**
 * =====================================================
 * APPLICATION ENTRY POINT
 * =====================================================
 * 
 * File: server/index.js
 * Purpose: The main entry point for the application.
 *          Responsible for:
 *          1. Loading environment configuration
 *          2. Testing the database connection
 *          3. Starting the HTTP server
 *          4. Handling process-level errors gracefully
 * 
 * Run:
 *   npm start      → node server/index.js
 *   npm run dev    → nodemon server/index.js
 * 
 * =====================================================
 */

// --- Load environment variables FIRST ---
const env = require('./config/env');

// --- Import application ---
const app = require('./app');
const { testConnection } = require('./config/db');
const logger = require('./utils/logger');

// =====================================================
// START THE SERVER
// =====================================================
/**
 * Initializes the database connection and starts
 * the Express HTTP server.
 */
async function startServer() {
  try {
    // Step 1: Test database connectivity
    logger.info('Connecting to MySQL database...');
    await testConnection();

    // Step 2: Start listening for HTTP requests
    const server = app.listen(env.PORT, () => {
      console.log('');
      console.log('=====================================================');
      console.log('  📱 SOCIAL MEDIA PLATFORM — SERVER STARTED');
      console.log('=====================================================');
      console.log(`  🌍 Environment : ${env.NODE_ENV}`);
      console.log(`  🚀 Server      : http://localhost:${env.PORT}`);
      console.log(`  📡 API Base    : http://localhost:${env.PORT}/api`);
      console.log(`  💾 Database    : ${env.DB_NAME}@${env.DB_HOST}:${env.DB_PORT}`);
      console.log(`  📁 Static Files: /public`);
      console.log('=====================================================');
      console.log('');
    });

    // Graceful shutdown on SIGTERM (e.g., Docker stop, Heroku shutdown)
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        logger.info('Server closed.');
        process.exit(0);
      });
    });

    // Graceful shutdown on SIGINT (e.g., Ctrl+C)
    process.on('SIGINT', () => {
      logger.info('SIGINT received. Shutting down gracefully...');
      server.close(() => {
        logger.info('Server closed.');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('❌ Failed to start the server:', error.message);
    process.exit(1);
  }
}

// =====================================================
// GLOBAL ERROR HANDLERS
// =====================================================

/**
 * Catches unhandled promise rejections (e.g., forgotten .catch()).
 * Prevents the process from crashing silently.
 */
process.on('unhandledRejection', (reason, promise) => {
  logger.error('⚠️  Unhandled Promise Rejection:', reason);
  // In production, you may want to exit:
  // process.exit(1);
});

/**
 * Catches uncaught synchronous exceptions.
 * These are critical and usually indicate a bug.
 */
process.on('uncaughtException', (error) => {
  logger.error('🔴 Uncaught Exception:', error.message);
  logger.error(error.stack);
  // Exit immediately — the process is in an undefined state
  process.exit(1);
});

// =====================================================
// LAUNCH
// =====================================================
startServer();
