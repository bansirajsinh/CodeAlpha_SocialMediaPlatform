/**
 * =====================================================
 * AUTH CONTROLLER — Authentication Endpoints
 * =====================================================
 * 
 * File: server/controllers/authController.js
 * Purpose: Handles registration, login, logout, and
 *          getMe operations.
 * 
 * =====================================================
 */

const authService = require('../services/authService');
const { sendSuccess } = require('../utils/response');
const { HTTP_STATUS } = require('../config/constants');

/**
 * POST /api/auth/register
 * Registers a new user account.
 */
async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;
    const first_name = req.body.first_name || req.body.firstName;
    const last_name = req.body.last_name || req.body.lastName;

    const result = await authService.registerUser({
      username,
      email,
      password,
      first_name,
      last_name,
    });

    return sendSuccess(res, HTTP_STATUS.CREATED, 'Registration successful', result);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/login
 * Authenticates a user and returns a JWT token.
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    return sendSuccess(res, HTTP_STATUS.OK, 'Login successful', result);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/logout
 * Logs a user out (handled client-side, but endpoint is provided).
 */
async function logout(req, res, next) {
  try {
    return sendSuccess(res, HTTP_STATUS.OK, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/auth/me
 * Returns the currently authenticated user's profile.
 */
async function getMe(req, res, next) {
  try {
    const userId = req.user.userId;
    const user = await authService.getMe(userId);
    return sendSuccess(res, HTTP_STATUS.OK, 'User details retrieved', user);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  logout,
  getMe,
};
