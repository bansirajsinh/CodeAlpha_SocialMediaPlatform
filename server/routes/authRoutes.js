/**
 * =====================================================
 * AUTH ROUTES — /api/auth/*
 * =====================================================
 * 
 * File: server/routes/authRoutes.js
 * Purpose: Defines authentication endpoints for
 *          registration, login, logout, and current user.
 * 
 * =====================================================
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin } = require('../validators/authValidator');
const { validate } = require('../middleware/validationMiddleware');

// --- Public Routes (no authentication required) ---

/**
 * POST /api/auth/register
 * Register a new user account
 * Body: { username, email, password, firstName, lastName }
 */
router.post('/register', validateRegister, validate, authController.register);

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 * Body: { email, password }
 */
router.post('/login', validateLogin, validate, authController.login);

// --- Protected Routes (authentication required) ---

/**
 * POST /api/auth/logout
 * Log out the current user
 */
router.post('/logout', authenticate, authController.logout);

/**
 * GET /api/auth/me
 * Get the currently authenticated user's profile
 */
router.get('/me', authenticate, authController.getMe);

module.exports = router;
