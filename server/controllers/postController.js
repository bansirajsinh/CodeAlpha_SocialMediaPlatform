/**
 * =====================================================
 * POST CONTROLLER — Post CRUD & Engagement Endpoints
 * =====================================================
 * 
 * File: server/controllers/postController.js
 * Purpose: Handles creating, reading, updating, and
 *          deleting posts, as well as like/unlike.
 * 
 * =====================================================
 */

const postService = require('../services/postService');
const { sendSuccess } = require('../utils/response');
const { HTTP_STATUS } = require('../config/constants');

/** POST /api/posts — Create a new post */
async function createPost(req, res, next) {
  try {
    const { content, visibility } = req.body;
    let image_url = req.body.image_url || null;

    if (req.file) {
      image_url = `/assets/uploads/${req.file.filename}`;
    }

    const post_type = req.body.post_type || (image_url ? 'image' : 'text');

    const post = await postService.createPost(req.user.userId, {
      content,
      image_url,
      post_type,
      visibility: visibility || 'public',
    });

    return sendSuccess(res, HTTP_STATUS.CREATED, 'Post created successfully', post);
  } catch (error) {
    next(error);
  }
}

/** GET /api/posts — Get paginated feed of posts */
async function getPosts(req, res, next) {
  try {
    const currentUserId = req.user ? req.user.userId : null;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    let result;
    if (req.query.userId) {
      const targetUserId = parseInt(req.query.userId, 10);
      result = await postService.getUserPosts(targetUserId, page, limit, currentUserId);
    } else if (req.query.likedBy) {
      const targetUserId = parseInt(req.query.likedBy, 10);
      result = await postService.getLikedPosts(targetUserId, page, limit);
    } else {
      result = await postService.getFeed(currentUserId || 0, page, limit);
    }

    return sendSuccess(res, HTTP_STATUS.OK, 'Posts retrieved successfully', result);
  } catch (error) {
    next(error);
  }
}

/** GET /api/posts/:id — Get a single post by ID */
async function getPostById(req, res, next) {
  try {
    const postId = parseInt(req.params.id, 10);
    const currentUserId = req.user ? req.user.userId : null;
    const post = await postService.getPostById(postId, currentUserId);
    return sendSuccess(res, HTTP_STATUS.OK, 'Post retrieved successfully', post);
  } catch (error) {
    next(error);
  }
}

/** PUT /api/posts/:id — Update a post */
async function updatePost(req, res, next) {
  try {
    const postId = parseInt(req.params.id, 10);
    const userId = req.user.userId;
    const { content, visibility } = req.body;

    const updatedPost = await postService.updatePost(postId, userId, { content, visibility });
    return sendSuccess(res, HTTP_STATUS.OK, 'Post updated successfully', updatedPost);
  } catch (error) {
    next(error);
  }
}

/** DELETE /api/posts/:id — Soft-delete a post */
async function deletePost(req, res, next) {
  try {
    const postId = parseInt(req.params.id, 10);
    const userId = req.user.userId;

    await postService.deletePost(postId, userId);
    return sendSuccess(res, HTTP_STATUS.OK, 'Post deleted successfully');
  } catch (error) {
    next(error);
  }
}

/** POST /api/posts/:id/like — Like a post */
async function likePost(req, res, next) {
  try {
    const postId = parseInt(req.params.id, 10);
    const userId = req.user.userId;

    await postService.likePost(postId, userId);
    return sendSuccess(res, HTTP_STATUS.OK, 'Post liked successfully');
  } catch (error) {
    next(error);
  }
}

/** DELETE /api/posts/:id/like — Unlike a post */
async function unlikePost(req, res, next) {
  try {
    const postId = parseInt(req.params.id, 10);
    const userId = req.user.userId;

    await postService.unlikePost(postId, userId);
    return sendSuccess(res, HTTP_STATUS.OK, 'Post unliked successfully');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
};
