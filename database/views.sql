-- =====================================================
-- CODEALPHA SOCIAL MEDIA PLATFORM — DATABASE VIEWS
-- =====================================================
-- Purpose: Pre-defined query views for common data
--          access patterns. Simplifies complex JOINs.
-- =====================================================

USE social_media_app;

-- =====================================================
-- VIEW: Post feed with author details
-- =====================================================
-- Joins posts with user info for feed display.
-- Excludes soft-deleted posts.
-- =====================================================
CREATE OR REPLACE VIEW vw_post_feed AS
SELECT
    p.post_id,
    p.user_id,
    u.username,
    u.first_name,
    u.last_name,
    u.profile_picture_url,
    u.is_verified,
    p.content,
    p.image_url,
    p.post_type,
    p.visibility,
    p.like_count,
    p.comment_count,
    p.share_count,
    p.is_edited,
    p.created_at,
    p.updated_at
FROM posts p
JOIN users u ON p.user_id = u.user_id
WHERE p.is_deleted = FALSE
  AND u.account_status = 'active'
ORDER BY p.created_at DESC;

-- =====================================================
-- VIEW: User profile with follower/following counts
-- =====================================================
CREATE OR REPLACE VIEW vw_user_profile AS
SELECT
    u.user_id,
    u.username,
    u.email,
    u.first_name,
    u.last_name,
    u.bio,
    u.profile_picture_url,
    u.cover_photo_url,
    u.location,
    u.website,
    u.is_verified,
    u.is_private,
    u.created_at,
    (SELECT COUNT(*) FROM followers f WHERE f.following_user_id = u.user_id AND f.status = 'following') AS follower_count,
    (SELECT COUNT(*) FROM followers f WHERE f.follower_user_id = u.user_id AND f.status = 'following') AS following_count,
    (SELECT COUNT(*) FROM posts p WHERE p.user_id = u.user_id AND p.is_deleted = FALSE) AS post_count
FROM users u
WHERE u.account_status = 'active';

-- =====================================================
-- VIEW: Trending hashtags
-- =====================================================
CREATE OR REPLACE VIEW vw_trending_hashtags AS
SELECT
    h.hashtag_id,
    h.tag_name,
    h.usage_count,
    h.last_used,
    h.created_at
FROM hashtags h
ORDER BY h.usage_count DESC;

-- =====================================================
-- VIEW: Unread notifications count per user
-- =====================================================
CREATE OR REPLACE VIEW vw_unread_notification_count AS
SELECT
    user_id,
    COUNT(*) AS unread_count
FROM notifications
WHERE is_read = FALSE
GROUP BY user_id;

-- =====================================================
-- VIEW: Comment details with author info
-- =====================================================
CREATE OR REPLACE VIEW vw_comment_details AS
SELECT
    c.comment_id,
    c.post_id,
    c.user_id,
    u.username,
    u.profile_picture_url,
    u.is_verified,
    c.parent_comment_id,
    c.content,
    c.like_count,
    c.is_edited,
    c.created_at
FROM comments c
JOIN users u ON c.user_id = u.user_id
WHERE c.is_deleted = FALSE
ORDER BY c.created_at ASC;

-- =====================================================
-- END OF VIEWS
-- =====================================================
