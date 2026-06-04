/**
 * =====================================================
 * DATABASE CONFIGURATION — MySQL Connection Pool
 * =====================================================
 * 
 * File: server/config/db.js
 * Purpose: Establishes and exports a MySQL connection pool
 *          using the mysql2/promise driver for async/await support.
 * 
 * Features:
 *   - Connection pooling for concurrent request handling
 *   - Promise-based API for clean async/await usage
 *   - Auto-reconnect via pool lifecycle management
 *   - Configurable pool size via environment variables
 *   - Production-ready error handling and logging
 * 
 * Usage:
 *   const pool = require('./config/db');
 *   const [rows] = await pool.query('SELECT * FROM users');
 * 
 * =====================================================
 */

const mysql = require('mysql2/promise');
const env = require('./env');

// -----------------------------------------------------
// Create the connection pool
// -----------------------------------------------------
// A pool manages multiple connections and automatically
// handles acquisition, release, and reconnection.
// This is significantly more efficient than creating a
// new connection for every database query.
// -----------------------------------------------------
const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,

  // --- Pool Settings ---
  waitForConnections: true,               // Queue requests when all connections are busy
  connectionLimit: env.DB_CONNECTION_LIMIT, // Maximum number of connections in the pool
  queueLimit: 0,                           // Unlimited queued connection requests (0 = no limit)

  // --- Connection Settings ---
  charset: 'utf8mb4',                      // Full Unicode support (emojis, etc.)
  timezone: '+00:00',                      // Use UTC for consistent timestamps
  dateStrings: true,                       // Return dates as strings instead of JS Date objects

  // --- Debugging (disable in production) ---
  debug: false,

  // --- Auto-reconnect behavior ---
  // mysql2 pool handles reconnection automatically.
  // If a connection is lost, the pool discards it and
  // creates a new one on the next request.
  enableKeepAlive: true,                   // Send TCP keep-alive probes
  keepAliveInitialDelay: 30000,            // Wait 30s before first keep-alive probe
});

// -----------------------------------------------------
// Test the database connection on startup
// -----------------------------------------------------
/**
 * Verifies that the database is reachable by acquiring
 * and releasing a single connection from the pool.
 * 
 * @returns {Promise<boolean>} true if connection succeeds
 * @throws {Error} if the database is unreachable
 */
async function testConnection() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('✅ [DB] MySQL connection pool established successfully');
    console.log(`   ├── Host: ${env.DB_HOST}:${env.DB_PORT}`);
    console.log(`   ├── Database: ${env.DB_NAME}`);
    console.log(`   └── Pool Size: ${env.DB_CONNECTION_LIMIT} connections`);
    return true;
  } catch (error) {
    console.error('❌ [DB] Failed to connect to MySQL database');
    console.error(`   ├── Error Code: ${error.code}`);
    console.error(`   ├── Error Message: ${error.message}`);
    console.error(`   └── Host: ${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`);
    throw error;
  } finally {
    // Always release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
}

// -----------------------------------------------------
// Pool event listeners for monitoring
// -----------------------------------------------------

// Log when a new connection is created in the pool
pool.on('connection', (connection) => {
  console.log(`🔗 [DB] New connection created (ID: ${connection.threadId})`);
});

// Log when a connection is acquired from the pool
pool.on('acquire', (connection) => {
  // Uncomment for verbose debugging:
  // console.log(`📥 [DB] Connection acquired (ID: ${connection.threadId})`);
});

// Log when a connection is released back to the pool
pool.on('release', (connection) => {
  // Uncomment for verbose debugging:
  // console.log(`📤 [DB] Connection released (ID: ${connection.threadId})`);
});

// Log pool queue events (when all connections are busy)
pool.on('enqueue', () => {
  console.warn('⏳ [DB] Waiting for available connection slot...');
});

// -----------------------------------------------------
// Export the pool and test function
// -----------------------------------------------------
module.exports = {
  pool,
  testConnection,
};
