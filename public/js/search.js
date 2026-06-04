/**
 * =====================================================
 * SEARCH — Search & Discovery Logic
 * =====================================================
 * File: public/js/search.js
 * Purpose: Handles frontend search query execution.
 * =====================================================
 */

const search = {
  /**
   * Performs search query.
   * @param {string} query
   * @param {string} type - 'all', 'users', 'posts', 'hashtags'
   */
  async searchAll(query, type = 'all') {
    try {
      if (!query || query.trim() === '') return [];
      const response = await api.get(`/search?q=${encodeURIComponent(query)}&type=${type}`);
      return response.data;
    } catch (error) {
      utils.showToast('Failed to perform search.', 'error');
      throw error;
    }
  },

  /**
   * Fetches trending topics.
   */
  async getTrending() {
    try {
      const response = await api.get('/search/trending');
      return response.data || [];
    } catch (error) {
      console.error('Failed to load trends:', error);
      return [];
    }
  },

  /**
   * Fetches suggested accounts.
   */
  async getSuggestions() {
    try {
      const response = await api.get('/search/suggestions');
      return response.data || [];
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      return [];
    }
  }
};

window.search = search;
