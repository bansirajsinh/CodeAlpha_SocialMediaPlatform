/**
 * AUTH SERVICE — Registration, login, and token management
 */
const bcrypt = require('bcryptjs');
const authRepository = require('../repositories/authRepository');
const { generateToken } = require('../utils/jwt');
const env = require('../config/env');

async function registerUser({ username, email, password, first_name, last_name }) {
  // Check if email already taken
  const existingEmail = await authRepository.findByEmail(email);
  if (existingEmail) {
    const error = new Error('Email is already registered');
    error.statusCode = 409;
    throw error;
  }
  // Check if username already taken
  const existingUsername = await authRepository.findByUsername(username);
  if (existingUsername) {
    const error = new Error('Username is already taken');
    error.statusCode = 409;
    throw error;
  }
  // Hash password
  const password_hash = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
  // Create user
  const result = await authRepository.createUser({ username, email, password_hash, first_name, last_name });
  const userId = result.insertId;
  // Generate token
  const token = generateToken({ userId, username, email });
  // Fetch created user (without password)
  const user = await authRepository.findById(userId);
  return { user, token };
}

async function loginUser(email, password) {
  // Find user by email (includes password_hash)
  const user = await authRepository.findByEmail(email);
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }
  // Compare password
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }
  // Update last login
  await authRepository.updateLastLogin(user.user_id);
  // Generate token
  const token = generateToken({ userId: user.user_id, username: user.username, email: user.email });
  // Return user without password_hash
  const { password_hash, ...safeUser } = user;
  return { user: safeUser, token };
}

async function getMe(userId) {
  const user = await authRepository.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
}

module.exports = { registerUser, loginUser, getMe };
