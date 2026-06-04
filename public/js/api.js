/**
 * =====================================================
 * API HELPER — Centralized HTTP Client
 * =====================================================
 * 
 * File: public/js/api.js
 * Purpose: Provides a reusable HTTP client wrapper
 *          around the Fetch API for making requests
 *          to the backend REST API.
 * 
 * Features:
 *   - Automatic JWT token attachment
 *   - Consistent error handling
 *   - JSON parsing
 *   - Base URL configuration
 * 
 * Usage:
 *   import { api } from './api.js';
 *   const posts = await api.get('/posts');
 *   await api.post('/posts', { content: 'Hello!' });
 * 
 * =====================================================
 */

// Base URL for all API requests
const API_BASE_URL = '/api';

/**
 * Makes an HTTP request to the backend API.
 * Automatically attaches the JWT token from localStorage.
 * 
 * @param {string} endpoint - The API endpoint (e.g., '/posts')
 * @param {object} options - Fetch options (method, body, headers)
 * @returns {Promise<object>} Parsed JSON response
 * @throws {Error} If the request fails or returns a non-2xx status
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  // Get the JWT token from localStorage
  const token = localStorage.getItem('token');

  // Build headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Attach Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Parse JSON response
    const data = await response.json();

    // Throw if response is not OK
    if (!response.ok) {
      const error = new Error(data.message || `HTTP Error: ${response.status}`);
      error.details = data.data || {};
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`[API] ${options.method || 'GET'} ${url} failed:`, error.message);
    throw error;
  }
}

/**
 * API methods for common HTTP verbs.
 */
const api = {
  /**
   * GET request
   * @param {string} endpoint
   * @returns {Promise<object>}
   */
  get(endpoint) {
    return request(endpoint, { method: 'GET' });
  },

  /**
   * POST request
   * @param {string} endpoint
   * @param {object} body - Request payload
   * @returns {Promise<object>}
   */
  post(endpoint, body) {
    return request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  /**
   * PUT request
   * @param {string} endpoint
   * @param {object} body - Request payload
   * @returns {Promise<object>}
   */
  put(endpoint, body) {
    return request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  /**
   * DELETE request
   * @param {string} endpoint
   * @returns {Promise<object>}
   */
  delete(endpoint) {
    return request(endpoint, { method: 'DELETE' });
  },

  /**
   * POST request with FormData (for file uploads).
   * Does NOT set Content-Type — browser sets it with boundary.
   * 
   * @param {string} endpoint
   * @param {FormData} formData
   * @returns {Promise<object>}
   */
  upload(endpoint, formData, method = 'POST') {
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: formData,
    }).then(async res => {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || `HTTP Error: ${res.status}`);
      }
      return data;
    });
  },
};

// Export for use in other frontend JS files
// (Using window global since we're not using a bundler)
window.api = api;
