/**
 * =====================================================
 * MESSAGES — Direct Messaging Logic
 * =====================================================
 * File: public/js/messages.js
 * Purpose: Handles fetching, clearing, and sending messages.
 * =====================================================
 */

const messages = {
  /**
   * Loads all active conversations for the current user.
   * @returns {Promise<Array>}
   */
  async loadConversations() {
    try {
      const response = await api.get('/messages/conversations');
      return response.data || [];
    } catch (error) {
      utils.showToast('Failed to load conversations.', 'error');
      throw error;
    }
  },

  /**
   * Loads the message history between current user and another user.
   * @param {number} userId
   * @returns {Promise<Array>}
   */
  async loadConversation(userId) {
    try {
      const response = await api.get(`/messages/${userId}`);
      return response.data || [];
    } catch (error) {
      utils.showToast('Failed to load messages.', 'error');
      throw error;
    }
  },

  /**
   * Sends a direct message. Supports attachments.
   * @param {FormData|object} msgData
   */
  async sendMessage(msgData) {
    try {
      let response;
      if (msgData instanceof FormData) {
        response = await api.upload('/messages', msgData);
      } else {
        response = await api.post('/messages', msgData);
      }
      return response.data;
    } catch (error) {
      utils.showToast('Failed to send message.', 'error');
      throw error;
    }
  },

  /**
   * Deletes a message.
   * @param {number} messageId
   */
  async deleteMessage(messageId) {
    try {
      await api.delete(`/messages/${messageId}`);
    } catch (error) {
      utils.showToast('Failed to delete message.', 'error');
      throw error;
    }
  }
};

window.messages = messages;
