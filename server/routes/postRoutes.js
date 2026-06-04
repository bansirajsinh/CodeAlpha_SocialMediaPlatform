/**
 * =====================================================
 * POST ROUTES — /api/posts/*
 * =====================================================
 * 
 * File: server/routes/postRoutes.js
 * Purpose: Defines post CRUD and engagement endpoints.
 * 
 * =====================================================
 */

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticate, optionalAuth } = require('../middleware/authMiddleware');
const { uploadSingle } = require('../middleware/uploadMiddleware');

/**
 * GET /api/posts
 * Get paginated feed of posts
 * Query: ?page=1&limit=20
 */
router.get('/', optionalAuth, postController.getPosts);

/**
 * GET /api/posts/:id
 * Get a single post by ID
 */
router.get('/:id', optionalAuth, postController.getPostById);

/**
 * POST /api/posts
 * Create a new post
 * Body: { content, visibility } + optional file 'image'
 */
router.post('/', authenticate, uploadSingle, postController.createPost);

/**
 * PUT /api/posts/:id
 * Update a post (own posts only)
 * Body: { content, visibility }
 */
router.put('/:id', authenticate, postController.updatePost);

/**
 * DELETE /api/posts/:id
 * Soft-delete a post (own posts only)
 */
router.delete('/:id', authenticate, postController.deletePost);

/**
 * POST /api/posts/:id/like
 * Like a post
 */
router.post('/:id/like', authenticate, postController.likePost);

/**
 * DELETE /api/posts/:id/like
 * Unlike a post
 */
router.delete('/:id/like', authenticate, postController.unlikePost);

module.exports = router;
