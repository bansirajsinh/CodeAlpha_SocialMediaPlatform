/**
 * =====================================================
 * MESSAGE CONTROLLER — Direct Messaging Endpoints
 * =====================================================
 * 
 * File: server/controllers/messageController.js
 * Purpose: Handles sending, fetching, and deleting
 *          direct messages between users.
 * 
 * =====================================================
 */

const messageService = require('../services/messageService');
const { sendSuccess } = require('../utils/response');
const { HTTP_STATUS } = require('../config/constants');

/** POST /api/messages — Send a direct message */
async function sendMessage(req, res, next) {
  try {
    const senderId = req.user.userId;
    const recipientId = parseInt(req.body.recipientId, 10);
    const content = req.body.content || '';
    let imageUrl = req.body.imageUrl || null;

    if (req.file) {
      imageUrl = `/assets/uploads/${req.file.filename}`;
    }

    const message = await messageService.sendMessage(senderId, recipientId, content, imageUrl);
    return sendSuccess(res, HTTP_STATUS.CREATED, 'Message sent successfully', message);
  } catch (error) {
    next(error);
  }
}

/** GET /api/messages/conversations — Get all conversations */
async function getConversations(req, res, next) {
  try {
    const userId = req.user.userId;
    const conversations = await messageService.getConversations(userId);
    return sendSuccess(res, HTTP_STATUS.OK, 'Conversations retrieved successfully', conversations);
  } catch (error) {
    next(error);
  }
}

/** GET /api/messages/:userId — Get conversation with a specific user */
async function getConversation(req, res, next) {
  try {
    const userId = req.user.userId;
    const otherUserId = parseInt(req.params.userId, 10);
    const messages = await messageService.getConversation(userId, otherUserId);
    return sendSuccess(res, HTTP_STATUS.OK, 'Conversation retrieved successfully', messages);
  } catch (error) {
    next(error);
  }
}

/** DELETE /api/messages/:id — Soft-delete a message */
async function deleteMessage(req, res, next) {
  try {
    const messageId = parseInt(req.params.id, 10);
    const userId = req.user.userId;

    await messageService.deleteMessage(messageId, userId);
    return sendSuccess(res, HTTP_STATUS.OK, 'Message deleted successfully');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  sendMessage,
  getConversations,
  getConversation,
  deleteMessage,
};
