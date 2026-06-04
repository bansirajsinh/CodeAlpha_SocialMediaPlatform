/**
 * =====================================================
 * USER CONTROLLER — User Profile & Social Endpoints
 * =====================================================
 * 
 * File: server/controllers/userController.js
 * Purpose: Handles user profile CRUD, follow/unfollow,
 *          and user-related social operations.
 * 
 * =====================================================
 */

const userService = require('../services/userService');
const { sendSuccess } = require('../utils/response');
const { HTTP_STATUS } = require('../config/constants');

/** GET /api/users/:id — Get user profile */
async function getUserProfile(req, res, next) {
  try {
    const userId = parseInt(req.params.id, 10);
    const viewerId = req.user ? req.user.userId : null;
    const profile = await userService.getUserProfile(userId, viewerId);
    return sendSuccess(res, HTTP_STATUS.OK, 'Profile retrieved successfully', profile);
  } catch (error) {
    next(error);
  }
}

/** PUT /api/users/:id — Update user profile */
async function updateUserProfile(req, res, next) {
  try {
    const userId = parseInt(req.params.id, 10);
    if (req.user.userId !== userId) {
      const error = new Error('You can only update your own profile');
      error.statusCode = 403;
      throw error;
    }

    const updateData = {};
    if (req.body.firstName !== undefined) updateData.first_name = req.body.firstName;
    if (req.body.first_name !== undefined) updateData.first_name = req.body.first_name;
    if (req.body.lastName !== undefined) updateData.last_name = req.body.lastName;
    if (req.body.last_name !== undefined) updateData.last_name = req.body.last_name;
    if (req.body.bio !== undefined) updateData.bio = req.body.bio;
    if (req.body.location !== undefined) updateData.location = req.body.location;
    if (req.body.website !== undefined) updateData.website = req.body.website;

    if (req.files) {
      if (req.files.avatar && req.files.avatar.length > 0) {
        updateData.profile_picture_url = `/assets/uploads/${req.files.avatar[0].filename}`;
      }
      if (req.files.cover && req.files.cover.length > 0) {
        updateData.cover_photo_url = `/assets/uploads/${req.files.cover[0].filename}`;
      }
    }

    if (req.body.profile_picture_url !== undefined) updateData.profile_picture_url = req.body.profile_picture_url;
    if (req.body.cover_photo_url !== undefined) updateData.cover_photo_url = req.body.cover_photo_url;

    const updatedProfile = await userService.updateProfile(userId, updateData);
    return sendSuccess(res, HTTP_STATUS.OK, 'Profile updated successfully', updatedProfile);
  } catch (error) {
    next(error);
  }
}

/** POST /api/users/:id/follow — Follow a user */
async function followUser(req, res, next) {
  try {
    const followerId = req.user.userId;
    const followingId = parseInt(req.params.id, 10);
    await userService.followUser(followerId, followingId);
    return sendSuccess(res, HTTP_STATUS.OK, 'Followed user successfully');
  } catch (error) {
    next(error);
  }
}

/** DELETE /api/users/:id/follow — Unfollow a user */
async function unfollowUser(req, res, next) {
  try {
    const followerId = req.user.userId;
    const followingId = parseInt(req.params.id, 10);
    await userService.unfollowUser(followerId, followingId);
    return sendSuccess(res, HTTP_STATUS.OK, 'Unfollowed user successfully');
  } catch (error) {
    next(error);
  }
}

/** GET /api/users/:id/followers — Get followers list */
async function getFollowers(req, res, next) {
  try {
    const userId = parseInt(req.params.id, 10);
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = parseInt(req.query.offset, 10) || 0;
    const followers = await userService.getFollowers(userId, limit, offset);
    return sendSuccess(res, HTTP_STATUS.OK, 'Followers retrieved successfully', followers);
  } catch (error) {
    next(error);
  }
}

/** GET /api/users/:id/following — Get following list */
async function getFollowing(req, res, next) {
  try {
    const userId = parseInt(req.params.id, 10);
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = parseInt(req.query.offset, 10) || 0;
    const following = await userService.getFollowing(userId, limit, offset);
    return sendSuccess(res, HTTP_STATUS.OK, 'Following list retrieved successfully', following);
  } catch (error) {
    next(error);
  }
}

/** POST /api/users/:id/block — Block a user */
async function blockUser(req, res, next) {
  try {
    const blockerId = req.user.userId;
    const blockedId = parseInt(req.params.id, 10);
    const reason = req.body.reason || '';
    await userService.blockUser(blockerId, blockedId, reason);
    return sendSuccess(res, HTTP_STATUS.OK, 'Blocked user successfully');
  } catch (error) {
    next(error);
  }
}

/** DELETE /api/users/:id/block — Unblock a user */
async function unblockUser(req, res, next) {
  try {
    const blockerId = req.user.userId;
    const blockedId = parseInt(req.params.id, 10);
    await userService.unblockUser(blockerId, blockedId);
    return sendSuccess(res, HTTP_STATUS.OK, 'Unblocked user successfully');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  blockUser,
  unblockUser,
};
