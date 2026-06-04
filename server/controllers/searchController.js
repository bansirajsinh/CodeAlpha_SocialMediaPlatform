/**
 * =====================================================
 * SEARCH CONTROLLER — Search & Discovery Endpoints
 * =====================================================
 * 
 * File: server/controllers/searchController.js
 * Purpose: Handles searching users, posts, and hashtags,
 *          as well as trending/discovery features.
 * 
 * =====================================================
 */

const searchService = require('../services/searchService');
const { sendSuccess } = require('../utils/response');
const { HTTP_STATUS } = require('../config/constants');

/** GET /api/search?q=query&type=users|posts|hashtags — Global search */
async function search(req, res, next) {
  try {
    const query = req.query.q || '';
    const type = req.query.type || 'all';
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = parseInt(req.query.offset, 10) || 0;

    const results = await searchService.search(query, type, limit, offset);
    return sendSuccess(res, HTTP_STATUS.OK, 'Search completed successfully', results);
  } catch (error) {
    next(error);
  }
}

/** GET /api/search/trending — Get trending hashtags */
async function getTrending(req, res, next) {
  try {
    const trending = await searchService.getTrending();
    return sendSuccess(res, HTTP_STATUS.OK, 'Trending topics retrieved successfully', trending);
  } catch (error) {
    next(error);
  }
}

/** GET /api/search/suggestions — Get user recommendations */
async function getSuggestions(req, res, next) {
  try {
    const userId = req.user ? req.user.userId : 0;
    const suggestions = await searchService.getSuggestions(userId);
    return sendSuccess(res, HTTP_STATUS.OK, 'User recommendations retrieved successfully', suggestions);
  } catch (error) {
    next(error);
  }
}

/** GET /api/search/popular — Get popular posts */
async function getPopular(req, res, next) {
  try {
    const posts = await searchService.getPopularPosts();
    return sendSuccess(res, HTTP_STATUS.OK, 'Popular posts retrieved successfully', posts);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  search,
  getTrending,
  getSuggestions,
  getPopular,
};
