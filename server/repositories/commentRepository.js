/**
 * COMMENT REPOSITORY — Database queries for comments & likes
 */
const { pool } = require('../config/db');

async function create(postId, userId, content, parentCommentId = null) {
  const [result] = await pool.query(
    'INSERT INTO comments (post_id, user_id, content, parent_comment_id) VALUES (?, ?, ?, ?)',
    [postId, userId, content, parentCommentId]
  );
  // Update post comment_count
  await pool.query(
    'UPDATE posts SET comment_count = (SELECT COUNT(*) FROM comments WHERE post_id = ? AND is_deleted = 0) WHERE post_id = ?',
    [postId, postId]
  );
  return result;
}

async function findByPostId(postId, currentUserId = null) {
  const [rows] = await pool.query(
    `SELECT c.*, u.username, u.first_name, u.last_name, u.profile_picture_url, u.is_verified,
            ${currentUserId ? '(SELECT COUNT(*) FROM comment_likes cl WHERE cl.comment_id = c.comment_id AND cl.user_id = ?) AS is_liked' : '0 AS is_liked'}
     FROM comments c JOIN users u ON c.user_id = u.user_id
     WHERE c.post_id = ? AND c.is_deleted = 0
     ORDER BY c.created_at ASC`,
    currentUserId ? [currentUserId, postId] : [postId]
  );
  return rows;
}

async function findById(commentId) {
  const [rows] = await pool.query('SELECT * FROM comments WHERE comment_id = ?', [commentId]);
  return rows[0] || null;
}

async function update(commentId, content) {
  await pool.query(
    'UPDATE comments SET content = ?, is_edited = 1, edited_at = NOW() WHERE comment_id = ?',
    [content, commentId]
  );
}

async function softDelete(commentId) {
  const comment = await findById(commentId);
  await pool.query('UPDATE comments SET is_deleted = 1, deleted_at = NOW() WHERE comment_id = ?', [commentId]);
  if (comment) {
    await pool.query(
      'UPDATE posts SET comment_count = (SELECT COUNT(*) FROM comments WHERE post_id = ? AND is_deleted = 0) WHERE post_id = ?',
      [comment.post_id, comment.post_id]
    );
  }
}

async function addLike(commentId, userId) {
  await pool.query('INSERT IGNORE INTO comment_likes (comment_id, user_id) VALUES (?, ?)', [commentId, userId]);
  await pool.query(
    'UPDATE comments SET like_count = (SELECT COUNT(*) FROM comment_likes WHERE comment_id = ?) WHERE comment_id = ?',
    [commentId, commentId]
  );
}

async function removeLike(commentId, userId) {
  await pool.query('DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?', [commentId, userId]);
  await pool.query(
    'UPDATE comments SET like_count = (SELECT COUNT(*) FROM comment_likes WHERE comment_id = ?) WHERE comment_id = ?',
    [commentId, commentId]
  );
}

module.exports = { create, findByPostId, findById, update, softDelete, addLike, removeLike };
