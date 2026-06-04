/**
 * =====================================================
 * POSTS — Post Creation & Management Logic
 * =====================================================
 * File: public/js/posts.js
 * Purpose: Handles creating, editing, deleting, and
 *          interacting with posts (like/unlike).
 * =====================================================
 */

const posts = {
  /**
   * Creates a new post. Supports text and image uploads.
   * @param {FormData|object} postData
   */
  async createPost(postData) {
    try {
      let response;
      if (postData instanceof FormData) {
        response = await api.upload('/posts', postData);
      } else {
        response = await api.post('/posts', postData);
      }
      utils.showToast('Post published successfully!', 'success');
      return response.data;
    } catch (error) {
      utils.showToast(error.message || 'Failed to publish post.', 'error');
      throw error;
    }
  },

  /**
   * Deletes a post (soft-delete).
   * @param {number} postId
   */
  async deletePost(postId) {
    try {
      await api.delete(`/posts/${postId}`);
      utils.showToast('Post deleted successfully.', 'success');
    } catch (error) {
      utils.showToast(error.message || 'Failed to delete post.', 'error');
      throw error;
    }
  },

  /**
   * Likes a post.
   * @param {number} postId
   */
  async likePost(postId) {
    try {
      await api.post(`/posts/${postId}/like`);
    } catch (error) {
      utils.showToast(error.message || 'Failed to like post.', 'error');
      throw error;
    }
  },

  /**
   * Unlikes a post.
   * @param {number} postId
   */
  async unlikePost(postId) {
    try {
      await api.delete(`/posts/${postId}/like`);
    } catch (error) {
      utils.showToast(error.message || 'Failed to unlike post.', 'error');
      throw error;
    }
  },

  /**
   * Helper to render a post card HTML dynamically.
   * @param {object} post - Post details
   * @param {object} currentUser - Active user
   * @returns {string} HTML string
   */
  renderPostCard(post, currentUser) {
    const isOwnPost = currentUser && post.user_id === currentUser.user_id;
    const isLiked = post.is_liked === 1 || post.is_liked === true;
    
    // Process hashtags in content to make them clickable
    let processedContent = (post.content || '').replace(
      /#([\w]+)/g,
      '<a href="/search.html?q=%23$1&type=hashtags">#$1</a>'
    );

    let mediaHtml = '';
    if (post.image_url) {
      mediaHtml = `
        <div class="post-media mt-2">
          <img src="${post.image_url}" alt="Post image" onclick="window.location.href='/post-detail.html?postId=${post.post_id}'">
        </div>
      `;
    }

    const deleteButtonHtml = isOwnPost ? `
      <div class="dropdown">
        <button class="btn btn-link text-muted p-0" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="box-shadow: none;">
          <i class="bi bi-three-dots"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-end border-color" style="background: var(--bg-primary); backdrop-filter: var(--glass-blur);">
          <li>
            <a class="dropdown-item text-danger d-flex align-items-center gap-2 delete-post-btn" href="#" data-post-id="${post.post_id}">
              <i class="bi bi-trash"></i> Delete Post
            </a>
          </li>
        </ul>
      </div>
    ` : '';

    const verifiedBadge = post.is_verified ? '<i class="bi bi-patch-check-fill text-primary ms-1" title="Verified Account"></i>' : '';

    return `
      <div class="glass-panel post-card animate-fade-in" id="post-${post.post_id}">
        <div class="post-header">
          <div class="post-author-info">
            <a href="/profile.html?userId=${post.user_id}">
              <img src="${post.profile_picture_url || utils.defaultAvatar}" alt="${post.username}" class="post-author-avatar">
            </a>
            <div class="post-meta">
              <div class="d-flex align-items-center">
                <a href="/profile.html?userId=${post.user_id}" class="post-author-name">${post.first_name || ''} ${post.last_name || ''}</a>
                ${verifiedBadge}
              </div>
              <span class="post-author-username">@${post.username}</span>
            </div>
          </div>
          <div class="d-flex align-items-center gap-3">
            <span class="post-time">${utils.timeAgo(post.created_at)}</span>
            ${deleteButtonHtml}
          </div>
        </div>

        <div class="post-content">
          <p class="mb-0">${processedContent}</p>
          ${mediaHtml}
        </div>

        <div class="post-stats">
          <span id="likes-count-${post.post_id}">${utils.formatCount(post.like_count || 0)} Likes</span>
          <span>•</span>
          <span>${utils.formatCount(post.comment_count || 0)} Comments</span>
        </div>

        <div class="post-actions">
          <button class="post-action-btn like-btn ${isLiked ? 'liked' : ''}" data-post-id="${post.post_id}">
            <i class="bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'}"></i>
            <span>Like</span>
          </button>
          <button class="post-action-btn comment-btn" onclick="window.location.href='/post-detail.html?postId=${post.post_id}'">
            <i class="bi bi-chat"></i>
            <span>Comment</span>
          </button>
        </div>
      </div>
    `;
  },

  /**
   * Bind common event handlers (Like, Delete) to a container.
   * @param {HTMLElement} container
   * @param {Function} onDeleteCallback - Option callback when post is deleted
   */
  bindPostActions(container, onDeleteCallback = null) {
    // Like / Unlike action
    container.querySelectorAll('.like-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const postBtn = e.currentTarget;
        const postId = postBtn.getAttribute('data-post-id');
        const isLiked = postBtn.classList.contains('liked');
        const countSpan = document.getElementById(`likes-count-${postId}`);
        
        // Optimistic UI updates
        let currentLikesCount = parseInt(countSpan.innerText.replace(/[KkMm]/g, '')) || 0;
        
        if (isLiked) {
          postBtn.classList.remove('liked');
          postBtn.querySelector('i').className = 'bi bi-heart';
          countSpan.innerText = `${utils.formatCount(Math.max(0, currentLikesCount - 1))} Likes`;
          try {
            await this.unlikePost(postId);
          } catch (err) {
            // Revert on error
            postBtn.classList.add('liked');
            postBtn.querySelector('i').className = 'bi bi-heart-fill';
            countSpan.innerText = `${utils.formatCount(currentLikesCount)} Likes`;
          }
        } else {
          postBtn.classList.add('liked');
          postBtn.querySelector('i').className = 'bi bi-heart-fill animate-scale-bounce';
          countSpan.innerText = `${utils.formatCount(currentLikesCount + 1)} Likes`;
          try {
            await this.likePost(postId);
          } catch (err) {
            // Revert on error
            postBtn.classList.remove('liked');
            postBtn.querySelector('i').className = 'bi bi-heart';
            countSpan.innerText = `${utils.formatCount(currentLikesCount)} Likes`;
          }
        }
      });
    });

    // Delete post action
    container.querySelectorAll('.delete-post-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const postId = e.currentTarget.getAttribute('data-post-id');
        if (confirm('Are you sure you want to delete this post?')) {
          try {
            await this.deletePost(postId);
            const postCard = document.getElementById(`post-${postId}`);
            if (postCard) {
              postCard.style.animation = 'fadeOut 0.3s ease forwards';
              setTimeout(() => {
                postCard.remove();
                if (onDeleteCallback) onDeleteCallback(postId);
              }, 300);
            }
          } catch (err) {
            // Error toast handled in service
          }
        }
      });
    });
  }
};

window.posts = posts;
