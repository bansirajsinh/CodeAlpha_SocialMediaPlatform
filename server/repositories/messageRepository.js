/**
 * MESSAGE REPOSITORY — Database queries for direct messages
 */
const { pool } = require('../config/db');

async function create(senderId, recipientId, content, imageUrl = null) {
  const [result] = await pool.query(
    'INSERT INTO direct_messages (sender_id, recipient_id, content, image_url) VALUES (?, ?, ?, ?)',
    [senderId, recipientId, content, imageUrl]
  );
  return result;
}

async function findConversation(userId, otherUserId, limit = 50, offset = 0) {
  // Mark messages as read
  await pool.query(
    `UPDATE direct_messages SET is_read = 1, read_at = NOW()
     WHERE sender_id = ? AND recipient_id = ? AND is_read = 0`,
    [otherUserId, userId]
  );
  const [rows] = await pool.query(
    `SELECT dm.*, 
            s.username AS sender_username, s.first_name AS sender_first_name, s.last_name AS sender_last_name, s.profile_picture_url AS sender_avatar,
            r.username AS recipient_username, r.first_name AS recipient_first_name, r.last_name AS recipient_last_name, r.profile_picture_url AS recipient_avatar
     FROM direct_messages dm
     JOIN users s ON dm.sender_id = s.user_id
     JOIN users r ON dm.recipient_id = r.user_id
     WHERE dm.is_deleted = 0
       AND ((dm.sender_id = ? AND dm.recipient_id = ?) OR (dm.sender_id = ? AND dm.recipient_id = ?))
     ORDER BY dm.created_at ASC LIMIT ? OFFSET ?`,
    [userId, otherUserId, otherUserId, userId, limit, offset]
  );
  return rows;
}

async function findConversations(userId) {
  const [rows] = await pool.query(
    `SELECT u.user_id, u.username, u.first_name, u.last_name, u.profile_picture_url, u.is_verified,
            dm.content AS last_message, dm.created_at AS last_message_at, dm.sender_id AS last_sender_id,
            (SELECT COUNT(*) FROM direct_messages WHERE sender_id = u.user_id AND recipient_id = ? AND is_read = 0 AND is_deleted = 0) AS unread_count
     FROM (
       SELECT CASE WHEN sender_id = ? THEN recipient_id ELSE sender_id END AS other_user_id,
              MAX(message_id) AS last_msg_id
       FROM direct_messages
       WHERE (sender_id = ? OR recipient_id = ?) AND is_deleted = 0
       GROUP BY other_user_id
     ) conv
     JOIN direct_messages dm ON dm.message_id = conv.last_msg_id
     JOIN users u ON u.user_id = conv.other_user_id
     WHERE u.account_status = 'active'
     ORDER BY dm.created_at DESC`,
    [userId, userId, userId, userId]
  );
  return rows;
}

async function softDelete(messageId, userId) {
  await pool.query(
    'UPDATE direct_messages SET is_deleted = 1, deleted_at = NOW() WHERE message_id = ? AND (sender_id = ? OR recipient_id = ?)',
    [messageId, userId, userId]
  );
}

module.exports = { create, findConversation, findConversations, softDelete };
