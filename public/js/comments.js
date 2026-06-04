/**
 * =====================================================
 * COMMENTS — Comment Logic
 * =====================================================
 * File: public/js/comments.js
 * Purpose: Handles comment fetching, creation, deletion, and liking.
 * =====================================================
 */

const comments = {
  /**
   * Loads all comments for a post.
   * @param {number} postId
   * @returns {Promise<Array>}
   */
  async loadComments(postId) {
    try {
      const response = await api.get(`/comments/post/${postId}`);
      return response.data || [];
    } catch (error) {
      utils.showToast('Failed to load comments.', 'error');
      throw error;
    }
  },

  /**
   * Adds a new comment.
   * @param {number} postId
   * @param {string} content
   * @param {number|null} parentCommentId
   */
  async addComment(postId, content, parentCommentId = null) {
    try {
      const response = await api.post('/comments', { postId, content, parentCommentId });
      utils.showToast('Comment posted successfully!', 'success');
      return response.data;
    } catch (error) {
      utils.showToast(error.message || 'Failed to post comment.', 'error');
      throw error;
    }
  },

  /**
   * Deletes a comment.
   * @param {number} commentId
   */
  async deleteComment(commentId) {
    try {
      await api.delete(`/comments/${commentId}`);
      utils.showToast('Comment deleted.', 'success');
    } catch (error) {
      utils.showToast(error.message || 'Failed to delete comment.', 'error');
      throw error;
    }
  },

  /**
   * Likes a comment.
   * @param {number} commentId
   */
  async likeComment(commentId) {
    try {
      await api.post(`/comments/${commentId}/like`);
    } catch (error) {
      utils.showToast(error.message || 'Failed to like comment.', 'error');
      throw error;
    }
  },

  /**
   * Unlikes a comment.
   * @param {number} commentId
   */
  async unlikeComment(commentId) {
    try {
      await api.delete(`/comments/${commentId}/like`);
    } catch (error) {
      utils.showToast(error.message || 'Failed to unlike comment.', 'error');
      throw error;
    }
  },

  /**
   * Renders a comment node.
   * @param {object} comment
   * @param {object} currentUser
   * @returns {string} HTML string
   */
  renderComment(comment, currentUser) {
    const isOwnComment = currentUser && comment.user_id === currentUser.user_id;
    const isLiked = comment.is_liked === 1 || comment.is_liked === true;
    const deleteButton = isOwnComment ? `
      <button class="btn btn-link text-danger p-0 delete-comment-btn" data-comment-id="${comment.comment_id}" style="box-shadow:none;">
        <i class="bi bi-trash"></i>
      </button>
    ` : '';

    const verifiedBadge = comment.is_verified ? '<i class="bi bi-patch-check-fill text-primary ms-1" style="font-size:0.875rem;"></i>' : '';

    return `
      <div class="comment-item py-3 border-bottom border-color" id="comment-${comment.comment_id}" style="display:flex; gap:var(--space-3);">
        <a href="/profile.html?userId=${comment.user_id}">
          <img src="${comment.profile_picture_url || utils.defaultAvatar}" alt="${comment.username}" class="avatar avatar-sm">
        </a>
        <div style="flex:1; min-width:0;">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <div>
              <a href="/profile.html?userId=${comment.user_id}" class="post-author-name text-small font-weight-bold">${comment.first_name || ''} ${comment.last_name || ''}</a>
              ${verifiedBadge}
              <span class="text-muted text-small ms-1">@${comment.username}</span>
            </div>
            <div class="d-flex align-items-center gap-2">
              <span class="text-tertiary text-small">${utils.timeAgo(comment.created_at)}</span>
              ${deleteButton}
            </div>
          </div>
          <div style="font-size:var(--font-size-base); color:var(--text-primary); margin-bottom:var(--space-2); word-break:break-word;">
            ${comment.content}
          </div>
          <div class="d-flex align-items-center gap-3">
            <button class="btn btn-link p-0 text-muted comment-like-btn ${isLiked ? 'text-danger font-weight-bold' : ''}" data-comment-id="${comment.comment_id}" style="text-decoration:none; font-size:12px; box-shadow:none;">
              <i class="bi ${isLiked ? 'bi-heart-fill text-danger' : 'bi-heart'}"></i>
              <span id="comment-likes-count-${comment.comment_id}">${comment.like_count || 0}</span>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Bind event handlers (likes/deletes) to comments container.
   * @param {HTMLElement} container
   */
  bindCommentActions(container) {
    // Like button handler
    container.querySelectorAll('.comment-like-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const commentBtn = e.currentTarget;
        const commentId = commentBtn.getAttribute('data-comment-id');
        const isLiked = commentBtn.querySelector('i').classList.contains('bi-heart-fill');
        const countSpan = document.getElementById(`comment-likes-count-${commentId}`);
        let currentLikes = parseInt(countSpan.innerText) || 0;

        if (isLiked) {
          commentBtn.querySelector('i').className = 'bi bi-heart';
          commentBtn.classList.remove('text-danger', 'font-weight-bold');
          countSpan.innerText = Math.max(0, currentLikes - 1);
          try {
            await this.unlikeComment(commentId);
          } catch (err) {
            commentBtn.querySelector('i').className = 'bi bi-heart-fill text-danger';
            commentBtn.classList.add('text-danger', 'font-weight-bold');
            countSpan.innerText = currentLikes;
          }
        } else {
          commentBtn.querySelector('i').className = 'bi bi-heart-fill text-danger animate-scale-bounce';
          commentBtn.classList.add('text-danger', 'font-weight-bold');
          countSpan.innerText = currentLikes + 1;
          try {
            await this.likeComment(commentId);
          } catch (err) {
            commentBtn.querySelector('i').className = 'bi bi-heart';
            commentBtn.classList.remove('text-danger', 'font-weight-bold');
            countSpan.innerText = currentLikes;
          }
        }
      });
    });

    // Delete button handler
    container.querySelectorAll('.delete-comment-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const commentId = e.currentTarget.getAttribute('data-comment-id');
        if (confirm('Delete this comment?')) {
          try {
            await this.deleteComment(commentId);
            const commentNode = document.getElementById(`comment-${commentId}`);
            if (commentNode) {
              commentNode.remove();
            }
          } catch (err) {
            // Error toast handled in service
          }
        }
      });
    });
  }
};

window.comments = comments;
