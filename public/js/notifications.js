/**
 * =====================================================
 * NOTIFICATIONS — Notification Logic
 * =====================================================
 * File: public/js/notifications.js
 * Purpose: Handles fetching, reading, and clearing notifications.
 * =====================================================
 */

const notifications = {
  /**
   * Loads the notification list.
   * @returns {Promise<object>}
   */
  async loadNotifications() {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (error) {
      utils.showToast('Failed to load notifications.', 'error');
      throw error;
    }
  },

  /**
   * Marks a single notification as read.
   * @param {number} notificationId
   */
  async markAsRead(notificationId) {
    try {
      await api.put(`/notifications/${notificationId}/read`);
    } catch (error) {
      console.error('Failed to mark read:', error);
    }
  },

  /**
   * Marks all notifications as read.
   */
  async markAllAsRead() {
    try {
      await api.put('/notifications/read-all');
      utils.showToast('All notifications marked as read.', 'success');
    } catch (error) {
      utils.showToast('Failed to clear notifications.', 'error');
      throw error;
    }
  },

  /**
   * Deletes a notification.
   * @param {number} notificationId
   */
  async deleteNotification(notificationId) {
    try {
      await api.delete(`/notifications/${notificationId}`);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  }
};

window.notifications = notifications;
