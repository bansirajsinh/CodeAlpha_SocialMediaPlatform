/**
 * NOTIFICATION REPOSITORY — Database queries for notifications
 */
const { pool } = require('../config/db');

async function create({ user_id, actor_id, notification_type, post_id, comment_id, message }) {
  // Don't notify yourself
  if (user_id === actor_id) return;
  const [result] = await pool.query(
    `INSERT INTO notifications (user_id, actor_id, notification_type, post_id, comment_id, message)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [user_id, actor_id, notification_type, post_id || null, comment_id || null, message]
  );
  return result;
}

async function findByUserId(userId, limit = 30, offset = 0) {
  const [rows] = await pool.query(
    `SELECT n.*, u.username, u.first_name, u.last_name, u.profile_picture_url, u.is_verified
     FROM notifications n JOIN users u ON n.actor_id = u.user_id
     WHERE n.user_id = ?
     ORDER BY n.created_at DESC LIMIT ? OFFSET ?`,
    [userId, limit, offset]
  );
  return rows;
}

async function getUnreadCount(userId) {
  const [[{ count }]] = await pool.query(
    'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0', [userId]
  );
  return count;
}

async function markRead(notificationId, userId) {
  await pool.query(
    'UPDATE notifications SET is_read = 1, read_at = NOW() WHERE notification_id = ? AND user_id = ?',
    [notificationId, userId]
  );
}

async function markAllRead(userId) {
  await pool.query(
    'UPDATE notifications SET is_read = 1, read_at = NOW() WHERE user_id = ? AND is_read = 0', [userId]
  );
}

async function remove(notificationId, userId) {
  await pool.query('DELETE FROM notifications WHERE notification_id = ? AND user_id = ?', [notificationId, userId]);
}

module.exports = { create, findByUserId, getUnreadCount, markRead, markAllRead, remove };
