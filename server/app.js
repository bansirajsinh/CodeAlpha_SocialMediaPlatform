/**
 * =====================================================
 * EXPRESS APPLICATION CONFIGURATION
 * =====================================================
 * 
 * File: server/app.js
 * Purpose: Initializes and configures the Express application.
 *          This file is responsible for:
 *          - Middleware registration (CORS, JSON parsing, etc.)
 *          - Static file serving for the frontend
 *          - API route registration under /api/*
 *          - Global error handling middleware
 * 
 * Architecture Note:
 *   app.js exports the configured Express app.
 *   index.js imports it, connects the DB, and starts listening.
 *   This separation allows testing without starting the server.
 * 
 * =====================================================
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const env = require('./config/env');

// --- Import Middleware ---
const { requestLogger } = require('./middleware/loggerMiddleware');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorMiddleware');

// --- Import Route Modules ---
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const searchRoutes = require('./routes/searchRoutes');

// =====================================================
// CREATE EXPRESS APPLICATION
// =====================================================
const app = express();

// =====================================================
// GLOBAL MIDDLEWARE
// =====================================================

// --- CORS: Cross-Origin Resource Sharing ---
// Allows the frontend to make API requests from a different origin
app.use(cors({
  origin: env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// --- Body Parsing ---
// Parse incoming JSON request bodies (e.g., POST /api/posts)
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded form data (e.g., HTML form submissions)
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --- Request Logger ---
// Logs every incoming HTTP request with method, URL, and response time
app.use(requestLogger);

// =====================================================
// STATIC FILE SERVING
// =====================================================
// Serves the frontend (HTML, CSS, JS, images) from the /public directory.
// Example: GET / → serves public/index.html
// Example: GET /css/style.css → serves public/css/style.css
app.use(express.static(path.join(__dirname, '..', 'public')));

// =====================================================
// API ROUTE REGISTRATION
// =====================================================
// All API routes are prefixed with /api to separate
// them from static file routes.

app.use('/api/auth', authRoutes);           // Authentication endpoints
app.use('/api/users', userRoutes);          // User profile & social endpoints
app.use('/api/posts', postRoutes);          // Post CRUD & engagement
app.use('/api/comments', commentRoutes);    // Comment CRUD & likes
app.use('/api/notifications', notificationRoutes); // Notification management
app.use('/api/messages', messageRoutes);    // Direct messaging
app.use('/api/search', searchRoutes);       // Search & discovery

// =====================================================
// HEALTH CHECK ENDPOINT
// =====================================================
// Used by load balancers, monitoring tools, and CI/CD
// pipelines to verify the server is running.
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Social Media Platform API is running',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// =====================================================
// ERROR HANDLING MIDDLEWARE
// =====================================================
// MUST be registered AFTER all routes.

// 404 handler — catches requests that don't match any route
app.use(notFoundHandler);

// Global error handler — catches all errors passed via next(error)
app.use(globalErrorHandler);

// =====================================================
// EXPORT THE APP
// =====================================================
module.exports = app;
