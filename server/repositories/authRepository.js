/**
 * AUTH REPOSITORY — Database queries for authentication
 */
const { pool } = require('../config/db');

async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND account_status = "active"', [email]);
  return rows[0] || null;
}

async function findByUsername(username) {
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ? AND account_status = "active"', [username]);
  return rows[0] || null;
}

async function findById(userId) {
  const [rows] = await pool.query(
    `SELECT user_id, username, email, first_name, last_name, bio,
            profile_picture_url, cover_photo_url, location, website,
            birth_date, account_status, is_verified, is_private,
            created_at, updated_at, last_login
     FROM users WHERE user_id = ? AND account_status = "active"`,
    [userId]
  );
  return rows[0] || null;
}

async function createUser({ username, email, password_hash, first_name, last_name }) {
  const [result] = await pool.query(
    `INSERT INTO users (username, email, password_hash, first_name, last_name)
     VALUES (?, ?, ?, ?, ?)`,
    [username, email, password_hash, first_name, last_name]
  );
  return result;
}

async function updateLastLogin(userId) {
  await pool.query('UPDATE users SET last_login = NOW() WHERE user_id = ?', [userId]);
}

module.exports = { findByEmail, findByUsername, findById, createUser, updateLastLogin };
