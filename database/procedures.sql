-- =====================================================
-- CODEALPHA SOCIAL MEDIA PLATFORM — STORED PROCEDURES
-- =====================================================
-- Purpose: Reusable database procedures for common
--          operations that involve multiple steps.
-- =====================================================

USE social_media_app;

DELIMITER //

-- =====================================================
-- PROCEDURE: Get user feed (posts from followed users)
-- =====================================================
-- Returns paginated posts from users that the given
-- user follows, ordered by most recent first.
-- =====================================================
CREATE PROCEDURE sp_get_user_feed(
    IN p_user_id INT,
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    -- TODO: Implement feed query
    -- SELECT p.*, u.username, u.profile_picture_url
    -- FROM posts p
    -- JOIN users u ON p.user_id = u.user_id
    -- WHERE p.user_id IN (
    --     SELECT following_user_id FROM followers
    --     WHERE follower_user_id = p_user_id AND status = 'following'
    -- )
    -- AND p.is_deleted = FALSE
    -- AND p.visibility IN ('public', 'followers_only')
    -- ORDER BY p.created_at DESC
    -- LIMIT p_limit OFFSET p_offset;
    
    SELECT 'Stored procedure placeholder — sp_get_user_feed' AS message;
END //

-- =====================================================
-- PROCEDURE: Toggle post like (like or unlike)
-- =====================================================
CREATE PROCEDURE sp_toggle_post_like(
    IN p_post_id INT,
    IN p_user_id INT
)
BEGIN
    -- TODO: Implement like toggle logic
    -- Check if like exists → remove it (unlike)
    -- If not → insert it (like)
    -- Update post like_count accordingly
    
    SELECT 'Stored procedure placeholder — sp_toggle_post_like' AS message;
END //

-- =====================================================
-- PROCEDURE: Get user profile with stats
-- =====================================================
CREATE PROCEDURE sp_get_user_profile(
    IN p_user_id INT
)
BEGIN
    -- TODO: Implement user profile query with
    -- follower count, following count, post count
    
    SELECT 'Stored procedure placeholder — sp_get_user_profile' AS message;
END //

DELIMITER ;

-- =====================================================
-- END OF STORED PROCEDURES
-- =====================================================
