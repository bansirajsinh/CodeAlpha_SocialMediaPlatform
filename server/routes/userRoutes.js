/**
 * =====================================================
 * USER ROUTES — /api/users/*
 * =====================================================
 * 
 * File: server/routes/userRoutes.js
 * Purpose: Defines user profile and social relationship
 *          endpoints.
 * 
 * =====================================================
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');
const { uploadProfileFields } = require('../middleware/uploadMiddleware');

// --- All user routes require authentication ---

/**
 * GET /api/users/:id
 * Get a user's public profile
 */
router.get('/:id', authenticate, userController.getUserProfile);

/**
 * PUT /api/users/:id
 * Update a user's profile (own profile only)
 * Body: { firstName, lastName, bio, location, website } + optional files: avatar, cover
 */
router.put('/:id', authenticate, uploadProfileFields, userController.updateUserProfile);

/**
 * POST /api/users/:id/follow
 * Follow a user
 */
router.post('/:id/follow', authenticate, userController.followUser);

/**
 * DELETE /api/users/:id/follow
 * Unfollow a user
 */
router.delete('/:id/follow', authenticate, userController.unfollowUser);

/**
 * GET /api/users/:id/followers
 * Get a user's followers list
 */
router.get('/:id/followers', authenticate, userController.getFollowers);

/**
 * GET /api/users/:id/following
 * Get a user's following list
 */
router.get('/:id/following', authenticate, userController.getFollowing);

/**
 * POST /api/users/:id/block
 * Block a user
 */
router.post('/:id/block', authenticate, userController.blockUser);

/**
 * DELETE /api/users/:id/block
 * Unblock a user
 */
router.delete('/:id/block', authenticate, userController.unblockUser);

module.exports = router;
