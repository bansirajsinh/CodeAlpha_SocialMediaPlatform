/**
 * POST SERVICE — Post CRUD, feed, and engagement
 */
const postRepository = require('../repositories/postRepository');
const notificationRepository = require('../repositories/notificationRepository');
const { pool } = require('../config/db');

async function createPost(userId, { content, image_url, post_type, visibility }) {
  const result = await postRepository.create(userId, { content, image_url, post_type, visibility });
  const postId = result.insertId;
  // Extract and save hashtags
  const hashtags = content.match(/#[\w]+/g);
  if (hashtags && hashtags.length > 0) {
    for (const tag of [...new Set(hashtags)]) {
      const tagName = tag.toLowerCase();
      // Insert or update hashtag
      await pool.query(
        'INSERT INTO hashtags (tag_name, usage_count, last_used) VALUES (?, 1, NOW()) ON DUPLICATE KEY UPDATE usage_count = usage_count + 1, last_used = NOW()',
        [tagName]
      );
      // Get hashtag_id
      const [[hashtag]] = await pool.query('SELECT hashtag_id FROM hashtags WHERE tag_name = ?', [tagName]);
      if (hashtag) {
        await pool.query('INSERT IGNORE INTO post_hashtags (post_id, hashtag_id) VALUES (?, ?)', [postId, hashtag.hashtag_id]);
      }
    }
  }
  return await postRepository.findById(postId, userId);
}

async function getFeed(currentUserId, page, limit) {
  return await postRepository.findFeed(currentUserId, page, limit);
}

async function getPostById(postId, currentUserId) {
  const post = await postRepository.findById(postId, currentUserId);
  if (!post) {
    const error = new Error('Post not found');
    error.statusCode = 404;
    throw error;
  }
  return post;
}

async function getUserPosts(userId, page, limit, currentUserId) {
  return await postRepository.findByUserId(userId, page, limit, currentUserId);
}

async function updatePost(postId, userId, { content, visibility }) {
  const post = await postRepository.findById(postId);
  if (!post) { const e = new Error('Post not found'); e.statusCode = 404; throw e; }
  if (post.user_id !== userId) { const e = new Error('Not authorized'); e.statusCode = 403; throw e; }
  await postRepository.update(postId, { content, visibility });
  return await postRepository.findById(postId, userId);
}

async function deletePost(postId, userId) {
  const post = await postRepository.findById(postId);
  if (!post) { const e = new Error('Post not found'); e.statusCode = 404; throw e; }
  if (post.user_id !== userId) { const e = new Error('Not authorized'); e.statusCode = 403; throw e; }
  await postRepository.softDelete(postId);
}

async function likePost(postId, userId) {
  const post = await postRepository.findById(postId);
  if (!post) { const e = new Error('Post not found'); e.statusCode = 404; throw e; }
  await postRepository.addLike(postId, userId);
  // Notify post owner
  if (post.user_id !== userId) {
    await notificationRepository.create({
      user_id: post.user_id, actor_id: userId,
      notification_type: 'like', post_id: postId,
      message: 'liked your post',
    });
  }
}

async function unlikePost(postId, userId) {
  await postRepository.removeLike(postId, userId);
}

async function getLikedPosts(userId, page, limit) {
  return await postRepository.getLikedPostsByUser(userId, page, limit);
}

module.exports = { createPost, getFeed, getPostById, getUserPosts, updatePost, deletePost, likePost, unlikePost, getLikedPosts };
