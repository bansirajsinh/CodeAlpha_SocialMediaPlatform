/**
 * =====================================================
 * COMMENT ROUTES — /api/comments/* & /api/posts/:postId/comments
 * =====================================================
 * 
 * File: server/routes/commentRoutes.js
 * Purpose: Defines comment CRUD and like endpoints.
 * 
 * =====================================================
 */

const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticate, optionalAuth } = require('../middleware/authMiddleware');

/**
 * POST /api/comments
 * Add a comment to a post
 * Body: { postId, content, parentCommentId? }
 */
router.post('/', authenticate, commentController.createComment);

/**
 * GET /api/comments/post/:postId
 * Get comments for a specific post
 * Query: ?page=1&limit=20
 */
router.get('/post/:postId', optionalAuth, commentController.getComments);

/**
 * PUT /api/comments/:id
 * Update a comment (own comments only)
 * Body: { content }
 */
router.put('/:id', authenticate, commentController.updateComment);

/**
 * DELETE /api/comments/:id
 * Delete a comment (own comments only)
 */
router.delete('/:id', authenticate, commentController.deleteComment);

/**
 * POST /api/comments/:id/like
 * Like a comment
 */
router.post('/:id/like', authenticate, commentController.likeComment);

/**
 * DELETE /api/comments/:id/like
 * Unlike a comment
 */
router.delete('/:id/like', authenticate, commentController.unlikeComment);

module.exports = router;
