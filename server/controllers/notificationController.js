/**
 * =====================================================
 * NOTIFICATION CONTROLLER
 * =====================================================
 * 
 * File: server/controllers/notificationController.js
 * Purpose: Handles fetching, reading, and deleting
 *          user notifications.
 * 
 * =====================================================
 */

const notificationService = require('../services/notificationService');
const { sendSuccess } = require('../utils/response');
const { HTTP_STATUS } = require('../config/constants');

/** GET /api/notifications — Get all notifications for the current user */
async function getNotifications(req, res, next) {
  try {
    const userId = req.user.userId;
    const result = await notificationService.getNotifications(userId);
    return sendSuccess(res, HTTP_STATUS.OK, 'Notifications retrieved successfully', result);
  } catch (error) {
    next(error);
  }
}

/** PUT /api/notifications/:id/read — Mark a notification as read */
async function markAsRead(req, res, next) {
  try {
    const notificationId = parseInt(req.params.id, 10);
    const userId = req.user.userId;

    await notificationService.markAsRead(notificationId, userId);
    return sendSuccess(res, HTTP_STATUS.OK, 'Notification marked as read');
  } catch (error) {
    next(error);
  }
}

/** PUT /api/notifications/read-all — Mark all notifications as read */
async function markAllAsRead(req, res, next) {
  try {
    const userId = req.user.userId;

    await notificationService.markAllAsRead(userId);
    return sendSuccess(res, HTTP_STATUS.OK, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
}

/** DELETE /api/notifications/:id — Delete a notification */
async function deleteNotification(req, res, next) {
  try {
    const notificationId = parseInt(req.params.id, 10);
    const userId = req.user.userId;

    await notificationService.deleteNotification(notificationId, userId);
    return sendSuccess(res, HTTP_STATUS.OK, 'Notification deleted successfully');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
