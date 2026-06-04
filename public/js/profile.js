/**
 * =====================================================
 * PROFILE — Profile Management Logic
 * =====================================================
 * File: public/js/profile.js
 * Purpose: Handles user profile display, following, and loading posts.
 * =====================================================
 */

const profile = {
  /**
   * Loads a user profile.
   * @param {number} userId
   * @param {number} viewerId
   * @returns {Promise<object>}
   */
  async loadProfile(userId) {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      utils.showToast('Failed to load user profile.', 'error');
      throw error;
    }
  },

  /**
   * Follows a user.
   * @param {number} userId
   */
  async follow(userId) {
    try {
      await api.post(`/users/${userId}/follow`);
      utils.showToast('Followed successfully!', 'success');
    } catch (error) {
      utils.showToast(error.message || 'Failed to follow user.', 'error');
      throw error;
    }
  },

  /**
   * Unfollows a user.
   * @param {number} userId
   */
  async unfollow(userId) {
    try {
      await api.delete(`/users/${userId}/follow`);
      utils.showToast('Unfollowed successfully!', 'info');
    } catch (error) {
      utils.showToast(error.message || 'Failed to unfollow user.', 'error');
      throw error;
    }
  },

  /**
   * Blocks a user.
   * @param {number} userId
   */
  async block(userId) {
    try {
      await api.post(`/users/${userId}/block`, { reason: 'Blocked by user' });
      utils.showToast('User blocked successfully.', 'success');
    } catch (error) {
      utils.showToast(error.message || 'Failed to block user.', 'error');
      throw error;
    }
  },

  /**
   * Unblocks a user.
   * @param {number} userId
   */
  async unblock(userId) {
    try {
      await api.delete(`/users/${userId}/block`);
      utils.showToast('User unblocked successfully.', 'success');
    } catch (error) {
      utils.showToast(error.message || 'Failed to unblock user.', 'error');
      throw error;
    }
  },

  /**
   * Renders the profile section in DOM.
   * @param {object} user - User profile data
   * @param {object} currentUser - Active authenticated user
   */
  renderProfile(user, currentUser) {
    const avatarElement = document.getElementById('profile-avatar');
    const nameElement = document.getElementById('profile-name');
    const usernameElement = document.getElementById('profile-username');
    const bioElement = document.getElementById('profile-bio');
    const locationElement = document.getElementById('profile-location');
    const websiteElement = document.getElementById('profile-website');
    const verifiedBadge = document.getElementById('profile-verified');
    
    const postsCount = document.getElementById('stat-posts-count');
    const followersCount = document.getElementById('stat-followers-count');
    const followingCount = document.getElementById('stat-following-count');
    
    const actionArea = document.getElementById('profile-action-area');

    if (avatarElement) avatarElement.src = user.profile_picture_url || utils.defaultAvatar;
    if (nameElement) nameElement.innerText = `${user.first_name || ''} ${user.last_name || ''}`;
    if (usernameElement) usernameElement.innerText = `@${user.username}`;
    if (bioElement) bioElement.innerText = user.bio || 'No bio yet.';
    
    if (locationElement) {
      if (user.location) {
        locationElement.innerHTML = `<i class="bi bi-geo-alt me-1"></i> ${user.location}`;
        locationElement.style.display = 'inline-block';
      } else {
        locationElement.style.display = 'none';
      }
    }
    
    if (websiteElement) {
      if (user.website) {
        websiteElement.innerHTML = `<i class="bi bi-link-45deg me-1"></i> <a href="${user.website.startsWith('http') ? user.website : 'https://' + user.website}" target="_blank">${user.website}</a>`;
        websiteElement.style.display = 'inline-block';
      } else {
        websiteElement.style.display = 'none';
      }
    }

    if (verifiedBadge) {
      verifiedBadge.style.display = user.is_verified ? 'inline-block' : 'none';
    }

    if (postsCount) postsCount.innerText = utils.formatCount(user.post_count || 0);
    if (followersCount) followersCount.innerText = utils.formatCount(user.follower_count || 0);
    if (followingCount) followingCount.innerText = utils.formatCount(user.following_count || 0);

    // Setup action buttons based on profile ownership
    if (actionArea && currentUser) {
      if (user.user_id === currentUser.user_id) {
        actionArea.innerHTML = `
          <a href="/edit-profile.html" class="btn btn-outline">
            <i class="bi bi-pencil me-2"></i> Edit Profile
          </a>
        `;
      } else {
        const isFollowing = user.is_following === 1 || user.is_following === true;
        actionArea.innerHTML = `
          <button class="btn ${isFollowing ? 'btn-outline' : 'btn-primary'}" id="profile-follow-btn">
            <i class="bi ${isFollowing ? 'bi-person-x' : 'bi-person-plus'} me-2"></i>
            <span>${isFollowing ? 'Unfollow' : 'Follow'}</span>
          </button>
          <a href="/messages.html?userId=${user.user_id}" class="btn btn-outline p-2 d-flex align-items-center justify-content-center" style="width:40px; height:40px;">
            <i class="bi bi-envelope"></i>
          </a>
          <div class="dropdown">
            <button class="btn btn-outline p-2 d-flex align-items-center justify-content-center" style="width:40px; height:40px;" type="button" data-bs-toggle="dropdown">
              <i class="bi bi-three-dots-vertical"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end border-color" style="background:var(--bg-primary); backdrop-filter:var(--glass-blur);">
              <li><a class="dropdown-item text-danger" href="#" id="profile-block-btn"><i class="bi bi-slash-circle me-2"></i> Block User</a></li>
            </ul>
          </div>
        `;

        // Bind Follow/Unfollow button click
        const followBtn = document.getElementById('profile-follow-btn');
        if (followBtn) {
          followBtn.addEventListener('click', async () => {
            followBtn.disabled = true;
            try {
              if (user.is_following) {
                await this.unfollow(user.user_id);
                user.is_following = false;
                user.follower_count = Math.max(0, user.follower_count - 1);
              } else {
                await this.follow(user.user_id);
                user.is_following = true;
                user.follower_count += 1;
              }
              // Re-render
              this.renderProfile(user, currentUser);
            } catch (err) {
              // Handled inside helper
            } finally {
              followBtn.disabled = false;
            }
          });
        }

        // Bind Block button click
        const blockBtn = document.getElementById('profile-block-btn');
        if (blockBtn) {
          blockBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (confirm(`Are you sure you want to block @${user.username}?`)) {
              try {
                await this.block(user.user_id);
                window.location.href = '/index.html';
              } catch (err) {
                // Handled
              }
            }
          });
        }
      }
    }
  }
};

window.profile = profile;
