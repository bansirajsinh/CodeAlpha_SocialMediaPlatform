/**
 * =====================================================
 * AUTH — Frontend Authentication Logic
 * =====================================================
 * 
 * File: public/js/auth.js
 * Purpose: Handles login, register, logout, and
 *          session state on the frontend.
 * 
 * =====================================================
 */

const auth = {
  /**
   * Registers a new user.
   * @param {object} formData - { username, email, password, firstName, lastName }
   */
  async register(formData) {
    try {
      const response = await api.post('/auth/register', formData);
      if (response && response.data) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        utils.showToast('Registration successful! Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = '/index.html';
        }, 1000);
      } else {
        throw new Error('Registration failed. Invalid response.');
      }
    } catch (error) {
      utils.showToast(error.message || 'Registration failed.', 'error');
      throw error;
    }
  },

  /**
   * Logs in a user.
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response && response.data) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        utils.showToast('Login successful! Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = '/index.html';
        }, 1000);
      } else {
        throw new Error('Login failed. Invalid response.');
      }
    } catch (error) {
      utils.showToast(error.message || 'Invalid email or password.', 'error');
      throw error;
    }
  },

  /**
   * Logs out the current user.
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    utils.showToast('Logged out successfully.', 'info');
    setTimeout(() => {
      window.location.href = '/login.html';
    }, 1000);
  },

  /**
   * Checks if the user is currently authenticated.
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  /**
   * Gets the stored user data.
   * @returns {object|null}
   */
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Redirects to login page if not authenticated.
   */
  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = '/login.html';
    }
  },
};

window.auth = auth;
