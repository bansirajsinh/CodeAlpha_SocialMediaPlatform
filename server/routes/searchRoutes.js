/**
 * =====================================================
 * SEARCH ROUTES — /api/search/*
 * =====================================================
 * 
 * File: server/routes/searchRoutes.js
 * Purpose: Defines search and discovery endpoints.
 * 
 * =====================================================
 */

const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { optionalAuth } = require('../middleware/authMiddleware');

/**
 * GET /api/search
 * Global search for users, posts, or hashtags
 * Query: ?q=searchTerm&type=users|posts|hashtags&page=1&limit=20
 */
router.get('/', optionalAuth, searchController.search);

/**
 * GET /api/search/trending
 * Get trending hashtags
 */
router.get('/trending', optionalAuth, searchController.getTrending);

/**
 * GET /api/search/suggestions
 * Get user recommendations / suggested accounts
 */
router.get('/suggestions', optionalAuth, searchController.getSuggestions);

/**
 * GET /api/search/popular
 * Get popular posts ranked by like counts
 */
router.get('/popular', optionalAuth, searchController.getPopular);

module.exports = router;
