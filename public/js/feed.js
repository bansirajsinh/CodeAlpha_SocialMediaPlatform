/**
 * =====================================================
 * FEED — Feed Loading & Display Logic
 * =====================================================
 * File: public/js/feed.js
 * Purpose: Fetches and renders the main post feed.
 * =====================================================
 */

const feed = {
  currentPage: 1,
  isLoading: false,
  hasMore: true,

  /** Initialize the feed elements */
  init() {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) return;

    // Load initial feed
    this.loadFeed(1);

    // Infinite scroll
    window.addEventListener('scroll', () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200) {
        if (!this.isLoading && this.hasMore) {
          this.loadMore();
        }
      }
    });
  },

  /** Load feed for a specific page */
  async loadFeed(page = 1) {
    if (this.isLoading) return;
    this.isLoading = true;
    const postsContainer = document.getElementById('posts-container');
    const currentUser = auth.getCurrentUser();

    if (page === 1 && postsContainer) {
      postsContainer.innerHTML = `
        <div class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
        </div>
      `;
    }

    try {
      const response = await api.get(`/posts?page=${page}&limit=10`);
      this.isLoading = false;

      if (response && response.data) {
        const postsList = response.data.rows || [];
        this.hasMore = postsList.length === 10;
        
        if (page === 1) {
          if (postsContainer) postsContainer.innerHTML = '';
        }

        if (postsList.length === 0 && page === 1) {
          if (postsContainer) {
            postsContainer.innerHTML = `
              <div class="glass-panel text-center py-5 empty-feed-msg">
                <i class="bi bi-chat-left-text text-muted" style="font-size: 3rem;"></i>
                <h4 class="mt-3 font-weight-bold">No posts yet</h4>
                <p class="text-muted">Start following people or write your first post to see activities!</p>
              </div>
            `;
          }
          return;
        }

        if (postsContainer) {
          const feedHtml = postsList.map(post => posts.renderPostCard(post, currentUser)).join('');
          
          // Remove spinner if it exists
          const spinners = postsContainer.querySelectorAll('.spinner-border');
          spinners.forEach(s => s.parentElement.remove());

          postsContainer.innerHTML += feedHtml;
          posts.bindPostActions(postsContainer);
        }
      }
    } catch (err) {
      this.isLoading = false;
      if (postsContainer) {
        postsContainer.innerHTML = `<div class="glass-panel text-center py-4 text-danger">Failed to load feed. Please refresh the page.</div>`;
      }
    }
  },

  /** Load next page (infinite scroll) */
  loadMore() {
    this.currentPage++;
    this.loadFeed(this.currentPage);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (auth.isAuthenticated()) {
    feed.init();
  }
});

window.feed = feed;
