/**
 * NOTIFICATION SERVICE — Notification management
 */
const notificationRepository = require('../repositories/notificationRepository');

async function getNotifications(userId) {
  const notifications = await notificationRepository.findByUserId(userId);
  const unreadCount = await notificationRepository.getUnreadCount(userId);
  return { notifications, unreadCount };
}

async function markAsRead(notificationId, userId) {
  await notificationRepository.markRead(notificationId, userId);
}

async function markAllAsRead(userId) {
  await notificationRepository.markAllRead(userId);
}

async function deleteNotification(notificationId, userId) {
  await notificationRepository.remove(notificationId, userId);
}

module.exports = { getNotifications, markAsRead, markAllAsRead, deleteNotification };
