/**
 * SEARCH SERVICE — Search and discovery
 */
const searchRepository = require('../repositories/searchRepository');

async function search(query, type, limit, offset) {
  if (!query || query.trim().length === 0) return [];
  switch (type) {
    case 'users': return await searchRepository.searchUsers(query, limit, offset);
    case 'posts': return await searchRepository.searchPosts(query, limit, offset);
    case 'hashtags': return await searchRepository.searchHashtags(query, limit);
    default: {
      const users = await searchRepository.searchUsers(query, 5);
      const posts = await searchRepository.searchPosts(query, 10);
      const hashtags = await searchRepository.searchHashtags(query, 5);
      return { users, posts, hashtags };
    }
  }
}

async function getTrending() {
  return await searchRepository.getTrendingHashtags(10);
}

async function getSuggestions(userId) {
  return await searchRepository.getSuggestedUsers(userId);
}

async function getPopularPosts() {
  return await searchRepository.getPopularPosts(20);
}

module.exports = { search, getTrending, getSuggestions, getPopularPosts };
