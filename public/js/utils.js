/**
 * =====================================================
 * UTILITY FUNCTIONS — Frontend Helpers
 * =====================================================
 * 
 * File: public/js/utils.js
 * Purpose: Shared utility functions for the frontend.
 * 
 * =====================================================
 */

const utils = {
  /**
   * Formats a date string into a human-readable relative time.
   * @param {string} dateString - ISO date string
   * @returns {string} e.g., "2 hours ago", "3 days ago"
   */
  timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'week', seconds: 604800 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
      }
    }

    return 'Just now';
  },

  /**
   * Truncates text to a maximum length and adds ellipsis.
   * @param {string} text
   * @param {number} maxLength
   * @returns {string}
   */
  truncate(text, maxLength = 150) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  },

  /**
   * Shows a toast notification (placeholder).
   * @param {string} message
   * @param {string} type - 'success', 'error', 'warning', 'info'
   */
  showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `custom-toast`;
    
    let iconClass = 'bi-info-circle-fill';
    let color = 'var(--color-info)';
    if (type === 'success') {
      iconClass = 'bi-check-circle-fill';
      color = 'var(--color-success)';
    } else if (type === 'error') {
      iconClass = 'bi-exclamation-triangle-fill';
      color = 'var(--color-danger)';
    } else if (type === 'warning') {
      iconClass = 'bi-exclamation-circle-fill';
      color = 'var(--color-warning)';
    }

    toast.style.borderLeft = `4px solid ${color}`;
    toast.innerHTML = `
      <i class="bi ${iconClass}" style="color: ${color}; font-size: 1.2rem;"></i>
      <span style="color: var(--text-primary); font-weight: 500;">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 300ms ease, transform 300ms ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        toast.remove();
        if (container.children.length === 0) {
          container.remove();
        }
      }, 300);
    }, 4000);
  },

  /**
   * Debounces a function call.
   * @param {Function} func
   * @param {number} delay - Milliseconds
   * @returns {Function}
   */
  debounce(func, delay = 300) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  },

  /**
   * Formats a number with K/M suffix.
   * @param {number} num
   * @returns {string} e.g., "1.2K", "3.5M"
   */
  formatCount(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  },
  defaultAvatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2NiZDVlMSI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjZjFmNWY5Ii8+PGNpcmNsZSBjeD0iMTIiIGN5PSI4IiByPSI0Ii8+PHBhdGggZD0iTTEyIDE0Yy02LjEgMC04IDQtOCA0djJoMTZ2LTJzLTEuOS00LTgtNHoiLz48L3N2Zz4=',
  defaultCover: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAgODAwIDIwMCI+PHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9InVybCgjZykiLz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMzYjgyZjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM4YjVjZjYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4=',

  renderLayout() {
    const sidebarTarget = document.getElementById('sidebar-target');
    const asideTarget = document.getElementById('aside-target');
    const currentUser = auth.getCurrentUser();
    
    // Protect pages
    const isAuthPage = window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html');
    if (!auth.isAuthenticated() && !isAuthPage) {
      window.location.href = '/login.html';
      return;
    }

    if (sidebarTarget && currentUser) {
      const currentPath = window.location.pathname;
      const pages = [
        { name: 'Feed', path: '/index.html', icon: 'bi-house-door' },
        { name: 'Upload Post', path: '/upload-post.html', icon: 'bi-plus-circle' },
        { name: 'Search', path: '/search.html', icon: 'bi-search' },
        { name: 'Messages', path: '/messages.html', icon: 'bi-chat-dots' },
        { name: 'Notifications', path: '/notifications.html', icon: 'bi-bell', badge: true },
        { name: 'Trending', path: '/trending.html', icon: 'bi-graph-up' },
        { name: 'Profile', path: `/profile.html?userId=${currentUser.user_id}`, icon: 'bi-person' }
      ];

      const activePage = pages.find(p => currentPath.includes(p.path.split('?')[0])) || pages[0];

      let navHtml = pages.map(page => {
        const isActive = currentPath.includes(page.path.split('?')[0]) || (page.name === 'Feed' && (currentPath === '/' || currentPath === '/index.html'));
        const badgeHtml = page.badge ? `<span class="badge-count" id="unread-notification-badge" style="display: none;">0</span>` : '';
        return `
          <a href="${page.path}" class="nav-link ${isActive ? 'active' : ''}">
            <i class="bi ${page.icon}"></i>
            <span>${page.name}</span>
            ${badgeHtml}
          </a>
        `;
      }).join('');

      sidebarTarget.innerHTML = `
        <div>
          <a href="/index.html" class="logo-container">
            <i class="bi bi-hexagon-fill"></i>
            <span>Nebula</span>
          </a>
          <nav class="nav-menu">
            ${navHtml}
          </nav>
        </div>
        <div class="sidebar-footer">
          <div class="theme-switch-container">
            <span class="text-muted"><i class="bi bi-moon-stars"></i> Dark Mode</span>
            <div class="form-check form-switch m-0">
              <input class="form-check-input" type="checkbox" id="theme-toggle" style="cursor: pointer;">
            </div>
          </div>
          <a href="/profile.html?userId=${currentUser.user_id}" class="user-snippet">
            <img src="${currentUser.profile_picture_url || utils.defaultAvatar}" alt="${currentUser.username}">
            <div class="user-snippet-details">
              <span class="user-snippet-name">${currentUser.first_name || ''} ${currentUser.last_name || ''}</span>
              <span class="user-snippet-username">@${currentUser.username}</span>
            </div>
          </a>
          <a href="#" id="logout-btn" class="nav-link text-danger mt-2" style="padding: var(--space-2) var(--space-4);">
            <i class="bi bi-box-arrow-right"></i>
            <span>Logout</span>
          </a>
        </div>
      `;

      // Bind logout
      document.getElementById('logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        auth.logout();
      });

      // Bind theme toggler
      const themeToggle = document.getElementById('theme-toggle');
      const currentTheme = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', currentTheme);
      document.documentElement.setAttribute('data-bs-theme', currentTheme);
      if (currentTheme === 'dark') {
        themeToggle.checked = true;
      }

      themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        document.documentElement.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
      });

      // Fetch unread notification counts
      api.get('/notifications').then(res => {
        if (res && res.data) {
          const badge = document.getElementById('unread-notification-badge');
          if (badge && res.data.unreadCount > 0) {
            badge.innerText = res.data.unreadCount;
            badge.style.display = 'inline-block';
          }
        }
      }).catch(err => console.log('Err fetching unread count:', err));
    }

    if (asideTarget) {
      asideTarget.innerHTML = `
        <div class="glass-panel widget-card">
          <h3 class="widget-title">Trending Now</h3>
          <div id="trending-widget-list">
            <div class="text-center py-2"><div class="spinner-border spinner-border-sm text-primary"></div></div>
          </div>
        </div>
        <div class="glass-panel widget-card">
          <h3 class="widget-title">Who to Follow</h3>
          <div id="suggestions-widget-list">
            <div class="text-center py-2"><div class="spinner-border spinner-border-sm text-primary"></div></div>
          </div>
        </div>
      `;

      // Fetch widget data
      api.get('/search/trending').then(res => {
        const trendingList = document.getElementById('trending-widget-list');
        if (res && res.data && res.data.length > 0) {
          trendingList.innerHTML = res.data.slice(0, 5).map(tag => `
            <a href="/search.html?q=${encodeURIComponent(tag.tag_name)}&type=hashtags" class="trending-item">
              <span class="trending-tag">#${tag.tag_name}</span>
              <span class="trending-count">${tag.usage_count} posts</span>
            </a>
          `).join('');
        } else {
          trendingList.innerHTML = '<p class="text-muted text-center py-1 mb-0">No trends today</p>';
        }
      }).catch(err => {
        console.log('Err loading trending widget:', err);
        document.getElementById('trending-widget-list').innerHTML = '<p class="text-muted text-center mb-0">Failed to load</p>';
      });

      api.get('/search/suggestions').then(res => {
        const suggestionsList = document.getElementById('suggestions-widget-list');
        if (res && res.data && res.data.length > 0) {
          suggestionsList.innerHTML = res.data.slice(0, 4).map(user => `
            <div class="suggestion-item">
              <a href="/profile.html?userId=${user.user_id}" class="user-snippet">
                <img src="${user.profile_picture_url || utils.defaultAvatar}" alt="${user.username}" style="width:34px; height:34px;">
                <div class="user-snippet-details">
                  <span class="user-snippet-name" style="font-size: var(--font-size-sm);">${user.first_name || ''} ${user.last_name || ''}</span>
                  <span class="user-snippet-username" style="font-size: 11px;">@${user.username}</span>
                </div>
              </a>
              <button class="btn btn-primary btn-sm follow-btn-widget" data-user-id="${user.user_id}" style="padding: 2px 10px; font-size:11px;">Follow</button>
            </div>
          `).join('');

          // Bind follow actions
          document.querySelectorAll('.follow-btn-widget').forEach(btn => {
            btn.addEventListener('click', async (e) => {
              const uId = e.target.getAttribute('data-user-id');
              try {
                await api.post(`/users/${uId}/follow`);
                utils.showToast('Followed successfully!', 'success');
                e.target.className = 'btn btn-outline btn-sm';
                e.target.innerText = 'Unfollow';
              } catch (err) {
                utils.showToast(err.message || 'Failed to follow user.', 'error');
              }
            });
          });
        } else {
          suggestionsList.innerHTML = '<p class="text-muted text-center py-1 mb-0">No recommendations</p>';
        }
      }).catch(err => {
        console.log('Err loading suggestions widget:', err);
        document.getElementById('suggestions-widget-list').innerHTML = '<p class="text-muted text-center mb-0">Failed to load</p>';
      });
    }
  }
};

// Auto-run layout and set dark theme on page load
document.addEventListener('DOMContentLoaded', () => {
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  document.documentElement.setAttribute('data-bs-theme', currentTheme);
  utils.renderLayout();
});

window.utils = utils;
