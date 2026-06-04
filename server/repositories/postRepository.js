/**
 * POST REPOSITORY — Database queries for posts & likes
 */
const { pool } = require('../config/db');

async function create(userId, { content, image_url, post_type, visibility }) {
  const [result] = await pool.query(
    `INSERT INTO posts (user_id, content, image_url, post_type, visibility) VALUES (?, ?, ?, ?, ?)`,
    [userId, content, image_url || null, post_type || 'text', visibility || 'public']
  );
  return result;
}

async function findAll({ userId, page = 1, limit = 20 }) {
  const offset = (page - 1) * limit;
  // If userId provided, show that user's posts; otherwise show public feed
  let whereClause = 'p.is_deleted = 0 AND p.visibility = "public"';
  const params = [];
  if (userId) {
    whereClause = 'p.is_deleted = 0 AND p.user_id = ?';
    params.push(userId);
  }
  params.push(limit, offset);

  const [rows] = await pool.query(
    `SELECT p.*, u.username, u.first_name, u.last_name, u.profile_picture_url, u.is_verified
     FROM posts p JOIN users u ON p.user_id = u.user_id
     WHERE ${whereClause} AND u.account_status = 'active'
     ORDER BY p.created_at DESC LIMIT ? OFFSET ?`,
    params
  );

  // Get total count
  const countParams = userId ? [userId] : [];
  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) as total FROM posts p JOIN users u ON p.user_id = u.user_id
     WHERE ${whereClause} AND u.account_status = 'active'`,
    countParams
  );

  return { rows, total };
}

async function findFeed(currentUserId, page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const [rows] = await pool.query(
    `SELECT p.*, u.username, u.first_name, u.last_name, u.profile_picture_url, u.is_verified,
            (SELECT COUNT(*) FROM post_likes pl WHERE pl.post_id = p.post_id AND pl.user_id = ?) AS is_liked
     FROM posts p
     JOIN users u ON p.user_id = u.user_id
     WHERE p.is_deleted = 0 AND u.account_status = 'active'
       AND (p.visibility = 'public' OR p.user_id = ?
            OR (p.visibility = 'followers_only' AND p.user_id IN
                (SELECT following_user_id FROM followers WHERE follower_user_id = ? AND status='following')))
     ORDER BY p.created_at DESC LIMIT ? OFFSET ?`,
    [currentUserId, currentUserId, currentUserId, limit, offset]
  );
  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) as total FROM posts p JOIN users u ON p.user_id = u.user_id
     WHERE p.is_deleted = 0 AND u.account_status = 'active'
       AND (p.visibility = 'public' OR p.user_id = ?
            OR (p.visibility = 'followers_only' AND p.user_id IN
                (SELECT following_user_id FROM followers WHERE follower_user_id = ? AND status='following')))`,
    [currentUserId, currentUserId]
  );
  return { rows, total };
}

async function findById(postId, currentUserId = null) {
  const [rows] = await pool.query(
    `SELECT p.*, u.username, u.first_name, u.last_name, u.profile_picture_url, u.is_verified,
            ${currentUserId ? '(SELECT COUNT(*) FROM post_likes pl WHERE pl.post_id = p.post_id AND pl.user_id = ?) AS is_liked' : '0 AS is_liked'}
     FROM posts p JOIN users u ON p.user_id = u.user_id
     WHERE p.post_id = ? AND p.is_deleted = 0`,
    currentUserId ? [currentUserId, postId] : [postId]
  );
  return rows[0] || null;
}

async function findByUserId(userId, page = 1, limit = 20, currentUserId = null) {
  const offset = (page - 1) * limit;
  const [rows] = await pool.query(
    `SELECT p.*, u.username, u.first_name, u.last_name, u.profile_picture_url, u.is_verified,
            ${currentUserId ? '(SELECT COUNT(*) FROM post_likes pl WHERE pl.post_id = p.post_id AND pl.user_id = ?) AS is_liked' : '0 AS is_liked'}
     FROM posts p JOIN users u ON p.user_id = u.user_id
     WHERE p.user_id = ? AND p.is_deleted = 0
     ORDER BY p.created_at DESC LIMIT ? OFFSET ?`,
    currentUserId ? [currentUserId, userId, limit, offset] : [userId, limit, offset]
  );
  const [[{ total }]] = await pool.query(
    'SELECT COUNT(*) as total FROM posts WHERE user_id = ? AND is_deleted = 0', [userId]
  );
  return { rows, total };
}

async function update(postId, { content, visibility }) {
  await pool.query(
    'UPDATE posts SET content = ?, visibility = ?, is_edited = 1, edited_at = NOW() WHERE post_id = ?',
    [content, visibility || 'public', postId]
  );
}

async function softDelete(postId) {
  await pool.query(
    'UPDATE posts SET is_deleted = 1, deleted_at = NOW() WHERE post_id = ?', [postId]
  );
}

async function addLike(postId, userId) {
  await pool.query(
    'INSERT IGNORE INTO post_likes (post_id, user_id) VALUES (?, ?)', [postId, userId]
  );
  await pool.query(
    'UPDATE posts SET like_count = (SELECT COUNT(*) FROM post_likes WHERE post_id = ?) WHERE post_id = ?',
    [postId, postId]
  );
}

async function removeLike(postId, userId) {
  await pool.query('DELETE FROM post_likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
  await pool.query(
    'UPDATE posts SET like_count = (SELECT COUNT(*) FROM post_likes WHERE post_id = ?) WHERE post_id = ?',
    [postId, postId]
  );
}

async function getLikedPostsByUser(userId, page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const [rows] = await pool.query(
    `SELECT p.*, u.username, u.first_name, u.last_name, u.profile_picture_url, u.is_verified, 1 AS is_liked
     FROM post_likes pl
     JOIN posts p ON pl.post_id = p.post_id
     JOIN users u ON p.user_id = u.user_id
     WHERE pl.user_id = ? AND p.is_deleted = 0
     ORDER BY pl.liked_at DESC LIMIT ? OFFSET ?`,
    [userId, limit, offset]
  );
  return { rows, total: rows.length };
}

module.exports = {
  create, findAll, findFeed, findById, findByUserId,
  update, softDelete, addLike, removeLike, getLikedPostsByUser,
};
