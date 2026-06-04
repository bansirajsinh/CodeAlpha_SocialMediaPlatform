/**
 * =====================================================
 * COMMENT CONTROLLER — Comment CRUD & Like Endpoints
 * =====================================================
 * 
 * File: server/controllers/commentController.js
 * Purpose: Handles adding, editing, deleting comments,
 *          and liking comments.
 * 
 * =====================================================
 */

const commentService = require('../services/commentService');
const { sendSuccess } = require('../utils/response');
const { HTTP_STATUS } = require('../config/constants');

/** POST /api/comments — Add a comment to a post */
async function createComment(req, res, next) {
  try {
    const postId = parseInt(req.body.postId || req.params.postId, 10);
    const { content, parentCommentId } = req.body;
    const userId = req.user.userId;

    const result = await commentService.createComment(
      postId,
      userId,
      content,
      parentCommentId ? parseInt(parentCommentId, 10) : null
    );

    return sendSuccess(res, HTTP_STATUS.CREATED, 'Comment created successfully', {
      commentId: result.insertId,
    });
  } catch (error) {
    next(error);
  }
}

/** GET /api/comments/post/:postId — Get comments for a post */
async function getComments(req, res, next) {
  try {
    const postId = parseInt(req.params.postId, 10);
    const currentUserId = req.user ? req.user.userId : null;

    const comments = await commentService.getComments(postId, currentUserId);
    return sendSuccess(res, HTTP_STATUS.OK, 'Comments retrieved successfully', comments);
  } catch (error) {
    next(error);
  }
}

/** PUT /api/comments/:id — Update a comment */
async function updateComment(req, res, next) {
  try {
    const commentId = parseInt(req.params.id, 10);
    const userId = req.user.userId;
    const { content } = req.body;

    await commentService.updateComment(commentId, userId, content);
    return sendSuccess(res, HTTP_STATUS.OK, 'Comment updated successfully');
  } catch (error) {
    next(error);
  }
}

/** DELETE /api/comments/:id — Delete a comment */
async function deleteComment(req, res, next) {
  try {
    const commentId = parseInt(req.params.id, 10);
    const userId = req.user.userId;

    await commentService.deleteComment(commentId, userId);
    return sendSuccess(res, HTTP_STATUS.OK, 'Comment deleted successfully');
  } catch (error) {
    next(error);
  }
}

/** POST /api/comments/:id/like — Like a comment */
async function likeComment(req, res, next) {
  try {
    const commentId = parseInt(req.params.id, 10);
    const userId = req.user.userId;

    await commentService.likeComment(commentId, userId);
    return sendSuccess(res, HTTP_STATUS.OK, 'Comment liked successfully');
  } catch (error) {
    next(error);
  }
}

/** DELETE /api/comments/:id/like — Unlike a comment */
async function unlikeComment(req, res, next) {
  try {
    const commentId = parseInt(req.params.id, 10);
    const userId = req.user.userId;

    await commentService.unlikeComment(commentId, userId);
    return sendSuccess(res, HTTP_STATUS.OK, 'Comment unliked successfully');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
};
