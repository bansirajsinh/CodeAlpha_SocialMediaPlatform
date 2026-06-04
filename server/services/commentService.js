/**
 * COMMENT SERVICE — Comment CRUD and engagement
 */
const commentRepository = require('../repositories/commentRepository');
const postRepository = require('../repositories/postRepository');
const notificationRepository = require('../repositories/notificationRepository');

async function createComment(postId, userId, content, parentCommentId = null) {
  const post = await postRepository.findById(postId);
  if (!post) { const e = new Error('Post not found'); e.statusCode = 404; throw e; }
  const result = await commentRepository.create(postId, userId, content, parentCommentId);
  // Notify post owner
  if (post.user_id !== userId) {
    await notificationRepository.create({
      user_id: post.user_id, actor_id: userId,
      notification_type: 'comment', post_id: postId, comment_id: result.insertId,
      message: 'commented on your post',
    });
  }
  return result;
}

async function getComments(postId, currentUserId) {
  return await commentRepository.findByPostId(postId, currentUserId);
}

async function updateComment(commentId, userId, content) {
  const comment = await commentRepository.findById(commentId);
  if (!comment) { const e = new Error('Comment not found'); e.statusCode = 404; throw e; }
  if (comment.user_id !== userId) { const e = new Error('Not authorized'); e.statusCode = 403; throw e; }
  await commentRepository.update(commentId, content);
}

async function deleteComment(commentId, userId) {
  const comment = await commentRepository.findById(commentId);
  if (!comment) { const e = new Error('Comment not found'); e.statusCode = 404; throw e; }
  if (comment.user_id !== userId) { const e = new Error('Not authorized'); e.statusCode = 403; throw e; }
  await commentRepository.softDelete(commentId);
}

async function likeComment(commentId, userId) {
  await commentRepository.addLike(commentId, userId);
}

async function unlikeComment(commentId, userId) {
  await commentRepository.removeLike(commentId, userId);
}

module.exports = { createComment, getComments, updateComment, deleteComment, likeComment, unlikeComment };
