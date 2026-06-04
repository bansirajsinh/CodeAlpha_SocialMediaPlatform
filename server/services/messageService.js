/**
 * MESSAGE SERVICE — Direct messaging business logic
 */
const messageRepository = require('../repositories/messageRepository');

async function sendMessage(senderId, recipientId, content, imageUrl) {
  if (senderId === recipientId) {
    const e = new Error('Cannot message yourself'); e.statusCode = 400; throw e;
  }
  return await messageRepository.create(senderId, recipientId, content, imageUrl);
}

async function getConversation(userId, otherUserId) {
  return await messageRepository.findConversation(userId, otherUserId);
}

async function getConversations(userId) {
  return await messageRepository.findConversations(userId);
}

async function deleteMessage(messageId, userId) {
  await messageRepository.softDelete(messageId, userId);
}

module.exports = { sendMessage, getConversation, getConversations, deleteMessage };
