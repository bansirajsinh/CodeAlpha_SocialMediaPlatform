/**
 * SEARCH REPOSITORY — Database queries for search & discovery
 */
const { pool } = require('../config/db');

async function searchUsers(query, limit = 20, offset = 0) {
  const like = `%${query}%`;
  const [rows] = await pool.query(
    `SELECT user_id, username, first_name, last_name, profile_picture_url, bio, is_verified,
            (SELECT COUNT(*) FROM followers WHERE following_user_id = users.user_id AND status='following') AS follower_count
     FROM users
     WHERE account_status = 'active'
       AND (username LIKE ? OR first_name LIKE ? OR last_name LIKE ? OR CONCAT(first_name,' ',last_name) LIKE ?)
     ORDER BY is_verified DESC, follower_count DESC
     LIMIT ? OFFSET ?`,
    [like, like, like, like, limit, offset]
  );
  return rows;
}

async function searchPosts(query, limit = 20, offset = 0) {
  const like = `%${query}%`;
  const [rows] = await pool.query(
    `SELECT p.*, u.username, u.first_name, u.last_name, u.profile_picture_url, u.is_verified
     FROM posts p JOIN users u ON p.user_id = u.user_id
     WHERE p.is_deleted = 0 AND p.visibility = 'public' AND u.account_status = 'active'
       AND p.content LIKE ?
     ORDER BY p.like_count DESC, p.created_at DESC
     LIMIT ? OFFSET ?`,
    [like, limit, offset]
  );
  return rows;
}

async function searchHashtags(query, limit = 20) {
  const like = `%${query}%`;
  const [rows] = await pool.query(
    'SELECT * FROM hashtags WHERE tag_name LIKE ? ORDER BY usage_count DESC LIMIT ?',
    [like, limit]
  );
  return rows;
}

async function getTrendingHashtags(limit = 10) {
  const [rows] = await pool.query(
    'SELECT * FROM hashtags ORDER BY usage_count DESC, last_used DESC LIMIT ?', [limit]
  );
  return rows;
}

async function getSuggestedUsers(userId, limit = 5) {
  const [rows] = await pool.query(
    `SELECT u.user_id, u.username, u.first_name, u.last_name, u.profile_picture_url, u.bio, u.is_verified,
            (SELECT COUNT(*) FROM followers WHERE following_user_id = u.user_id AND status='following') AS follower_count
     FROM users u
     WHERE u.user_id != ? AND u.account_status = 'active'
       AND u.user_id NOT IN (SELECT following_user_id FROM followers WHERE follower_user_id = ? AND status='following')
     ORDER BY follower_count DESC, u.created_at DESC LIMIT ?`,
    [userId, userId, limit]
  );
  return rows;
}

async function getPopularPosts(limit = 10) {
  const [rows] = await pool.query(
    `SELECT p.*, u.username, u.first_name, u.last_name, u.profile_picture_url, u.is_verified
     FROM posts p JOIN users u ON p.user_id = u.user_id
     WHERE p.is_deleted = 0 AND p.visibility = 'public' AND u.account_status = 'active'
       AND p.created_at > DATE_SUB(NOW(), INTERVAL 7 DAY)
     ORDER BY p.like_count DESC, p.comment_count DESC
     LIMIT ?`, [limit]
  );
  return rows;
}

module.exports = { searchUsers, searchPosts, searchHashtags, getTrendingHashtags, getSuggestedUsers, getPopularPosts };
