/**
 * USER REPOSITORY — Database queries for user profiles & social
 */
const { pool } = require('../config/db');

async function findById(userId) {
  const [rows] = await pool.query(
    `SELECT u.user_id, u.username, u.email, u.first_name, u.last_name, u.bio,
            u.profile_picture_url, u.cover_photo_url, u.location, u.website,
            u.is_verified, u.is_private, u.created_at,
            (SELECT COUNT(*) FROM followers f WHERE f.following_user_id = u.user_id AND f.status='following') AS follower_count,
            (SELECT COUNT(*) FROM followers f WHERE f.follower_user_id = u.user_id AND f.status='following') AS following_count,
            (SELECT COUNT(*) FROM posts p WHERE p.user_id = u.user_id AND p.is_deleted = 0) AS post_count
     FROM users u WHERE u.user_id = ? AND u.account_status = 'active'`,
    [userId]
  );
  return rows[0] || null;
}

async function updateProfile(userId, data) {
  const fields = [];
  const values = [];
  const allowed = ['first_name','last_name','bio','location','website','profile_picture_url','cover_photo_url'];
  for (const key of allowed) {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
  }
  if (fields.length === 0) return;
  values.push(userId);
  await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`, values);
}

async function addFollow(followerId, followingId) {
  await pool.query(
    'INSERT INTO followers (follower_user_id, following_user_id, status) VALUES (?, ?, "following") ON DUPLICATE KEY UPDATE status="following"',
    [followerId, followingId]
  );
}

async function removeFollow(followerId, followingId) {
  await pool.query(
    'DELETE FROM followers WHERE follower_user_id = ? AND following_user_id = ?',
    [followerId, followingId]
  );
}

async function isFollowing(followerId, followingId) {
  const [rows] = await pool.query(
    'SELECT 1 FROM followers WHERE follower_user_id = ? AND following_user_id = ? AND status="following"',
    [followerId, followingId]
  );
  return rows.length > 0;
}

async function getFollowers(userId, limit = 20, offset = 0) {
  const [rows] = await pool.query(
    `SELECT u.user_id, u.username, u.first_name, u.last_name, u.profile_picture_url, u.bio, u.is_verified
     FROM followers f JOIN users u ON f.follower_user_id = u.user_id
     WHERE f.following_user_id = ? AND f.status='following' AND u.account_status='active'
     ORDER BY f.followed_at DESC LIMIT ? OFFSET ?`,
    [userId, limit, offset]
  );
  const [[{ total }]] = await pool.query(
    'SELECT COUNT(*) as total FROM followers WHERE following_user_id = ? AND status="following"', [userId]
  );
  return { rows, total };
}

async function getFollowing(userId, limit = 20, offset = 0) {
  const [rows] = await pool.query(
    `SELECT u.user_id, u.username, u.first_name, u.last_name, u.profile_picture_url, u.bio, u.is_verified
     FROM followers f JOIN users u ON f.following_user_id = u.user_id
     WHERE f.follower_user_id = ? AND f.status='following' AND u.account_status='active'
     ORDER BY f.followed_at DESC LIMIT ? OFFSET ?`,
    [userId, limit, offset]
  );
  const [[{ total }]] = await pool.query(
    'SELECT COUNT(*) as total FROM followers WHERE follower_user_id = ? AND status="following"', [userId]
  );
  return { rows, total };
}

async function getRecommendations(userId, limit = 5) {
  const [rows] = await pool.query(
    `SELECT u.user_id, u.username, u.first_name, u.last_name, u.profile_picture_url, u.bio, u.is_verified,
            (SELECT COUNT(*) FROM followers WHERE following_user_id = u.user_id AND status='following') AS follower_count
     FROM users u
     WHERE u.user_id != ?
       AND u.account_status = 'active'
       AND u.user_id NOT IN (SELECT following_user_id FROM followers WHERE follower_user_id = ? AND status='following')
     ORDER BY follower_count DESC, u.created_at DESC
     LIMIT ?`,
    [userId, userId, limit]
  );
  return rows;
}

async function blockUser(blockerId, blockedId, reason = '') {
  await pool.query(
    'INSERT INTO blocks (blocker_user_id, blocked_user_id, reason) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE reason = ?',
    [blockerId, blockedId, reason, reason]
  );
  // Remove follow relationship
  await pool.query(
    'DELETE FROM followers WHERE (follower_user_id = ? AND following_user_id = ?) OR (follower_user_id = ? AND following_user_id = ?)',
    [blockerId, blockedId, blockedId, blockerId]
  );
}

async function unblockUser(blockerId, blockedId) {
  await pool.query(
    'DELETE FROM blocks WHERE blocker_user_id = ? AND blocked_user_id = ?',
    [blockerId, blockedId]
  );
}

module.exports = {
  findById,
  updateProfile,
  addFollow,
  removeFollow,
  isFollowing,
  getFollowers,
  getFollowing,
  getRecommendations,
  blockUser,
  unblockUser,
};
