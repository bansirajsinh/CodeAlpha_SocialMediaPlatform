/**
 * USER SERVICE — Profile management and social operations
 */
const userRepository = require('../repositories/userRepository');
const notificationRepository = require('../repositories/notificationRepository');

async function getUserProfile(userId, viewerId = null) {
  const user = await userRepository.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  // Check if viewer is following this user
  if (viewerId && viewerId !== userId) {
    user.is_following = await userRepository.isFollowing(viewerId, userId);
  } else {
    user.is_following = false;
  }
  user.is_own_profile = viewerId === userId;
  return user;
}

async function updateProfile(userId, data) {
  await userRepository.updateProfile(userId, data);
  return await userRepository.findById(userId);
}

async function followUser(followerId, followingId) {
  if (followerId === followingId) {
    const error = new Error('You cannot follow yourself');
    error.statusCode = 400;
    throw error;
  }
  await userRepository.addFollow(followerId, followingId);
  // Create notification
  await notificationRepository.create({
    user_id: followingId,
    actor_id: followerId,
    notification_type: 'follow',
    message: 'started following you',
  });
}

async function unfollowUser(followerId, followingId) {
  await userRepository.removeFollow(followerId, followingId);
}

async function getFollowers(userId, limit, offset) {
  return await userRepository.getFollowers(userId, limit, offset);
}

async function getFollowing(userId, limit, offset) {
  return await userRepository.getFollowing(userId, limit, offset);
}

async function getRecommendations(userId) {
  return await userRepository.getRecommendations(userId);
}

async function blockUser(blockerId, blockedId, reason) {
  if (blockerId === blockedId) {
    const error = new Error('You cannot block yourself');
    error.statusCode = 400;
    throw error;
  }
  return await userRepository.blockUser(blockerId, blockedId, reason);
}

async function unblockUser(blockerId, blockedId) {
  return await userRepository.unblockUser(blockerId, blockedId);
}

module.exports = {
  getUserProfile,
  updateProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getRecommendations,
  blockUser,
  unblockUser,
};
