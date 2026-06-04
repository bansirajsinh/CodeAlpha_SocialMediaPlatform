/**
 * =====================================================
 * MESSAGE ROUTES — /api/messages/*
 * =====================================================
 * 
 * File: server/routes/messageRoutes.js
 * Purpose: Defines direct messaging endpoints.
 * 
 * =====================================================
 */

const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticate } = require('../middleware/authMiddleware');
const { uploadSingle } = require('../middleware/uploadMiddleware');

// --- All message routes require authentication ---

/**
 * POST /api/messages
 * Send a direct message
 * Body: { recipientId, content } + optional file 'image'
 */
router.post('/', authenticate, uploadSingle, messageController.sendMessage);

/**
 * GET /api/messages/conversations
 * Get all conversations for the current user
 */
router.get('/conversations', authenticate, messageController.getConversations);

/**
 * GET /api/messages/:userId
 * Get conversation with a specific user
 * Query: ?page=1&limit=50
 */
router.get('/:userId', authenticate, messageController.getConversation);

/**
 * DELETE /api/messages/:id
 * Soft-delete a message
 */
router.delete('/:id', authenticate, messageController.deleteMessage);

module.exports = router;
