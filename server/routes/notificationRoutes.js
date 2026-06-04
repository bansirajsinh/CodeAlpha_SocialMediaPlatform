/**
 * =====================================================
 * NOTIFICATION ROUTES — /api/notifications/*
 * =====================================================
 * 
 * File: server/routes/notificationRoutes.js
 * Purpose: Defines notification retrieval and management.
 * 
 * =====================================================
 */

const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middleware/authMiddleware');

// --- All notification routes require authentication ---

/**
 * GET /api/notifications
 * Get all notifications for the current user
 * Query: ?page=1&limit=20
 */
router.get('/', authenticate, notificationController.getNotifications);

/**
 * PUT /api/notifications/:id/read
 * Mark a single notification as read
 */
router.put('/:id/read', authenticate, notificationController.markAsRead);

/**
 * PUT /api/notifications/read-all
 * Mark all notifications as read
 */
router.put('/read-all', authenticate, notificationController.markAllAsRead);

/**
 * DELETE /api/notifications/:id
 * Delete a notification
 */
router.delete('/:id', authenticate, notificationController.deleteNotification);

module.exports = router;
