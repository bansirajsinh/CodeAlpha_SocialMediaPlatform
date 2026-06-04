-- =====================================================
-- CODEALPHA SOCIAL MEDIA PLATFORM — DATABASE TRIGGERS
-- =====================================================
-- Purpose: Automatic database-level reactions to
--          INSERT, UPDATE, and DELETE operations.
-- =====================================================

USE social_media_app;

DELIMITER //

-- =====================================================
-- TRIGGER: Auto-update post like_count on INSERT
-- =====================================================
-- When a new like is added to post_likes,
-- automatically increment the post's like_count.
-- =====================================================
CREATE TRIGGER trg_after_post_like_insert
AFTER INSERT ON post_likes
FOR EACH ROW
BEGIN
    UPDATE posts
    SET like_count = like_count + 1
    WHERE post_id = NEW.post_id;
END //

-- =====================================================
-- TRIGGER: Auto-update post like_count on DELETE
-- =====================================================
CREATE TRIGGER trg_after_post_like_delete
AFTER DELETE ON post_likes
FOR EACH ROW
BEGIN
    UPDATE posts
    SET like_count = like_count - 1
    WHERE post_id = OLD.post_id;
END //

-- =====================================================
-- TRIGGER: Auto-update post comment_count on INSERT
-- =====================================================
CREATE TRIGGER trg_after_comment_insert
AFTER INSERT ON comments
FOR EACH ROW
BEGIN
    UPDATE posts
    SET comment_count = comment_count + 1
    WHERE post_id = NEW.post_id;
END //

-- =====================================================
-- TRIGGER: Auto-update post comment_count on DELETE
-- =====================================================
CREATE TRIGGER trg_after_comment_delete
AFTER DELETE ON comments
FOR EACH ROW
BEGIN
    UPDATE posts
    SET comment_count = comment_count - 1
    WHERE post_id = OLD.post_id;
END //

-- =====================================================
-- TRIGGER: Auto-update comment like_count on INSERT
-- =====================================================
CREATE TRIGGER trg_after_comment_like_insert
AFTER INSERT ON comment_likes
FOR EACH ROW
BEGIN
    UPDATE comments
    SET like_count = like_count + 1
    WHERE comment_id = NEW.comment_id;
END //

-- =====================================================
-- TRIGGER: Auto-update comment like_count on DELETE
-- =====================================================
CREATE TRIGGER trg_after_comment_like_delete
AFTER DELETE ON comment_likes
FOR EACH ROW
BEGIN
    UPDATE comments
    SET like_count = like_count - 1
    WHERE comment_id = OLD.comment_id;
END //

-- =====================================================
-- TRIGGER: Auto-update hashtag usage_count on INSERT
-- =====================================================
CREATE TRIGGER trg_after_post_hashtag_insert
AFTER INSERT ON post_hashtags
FOR EACH ROW
BEGIN
    UPDATE hashtags
    SET usage_count = usage_count + 1,
        last_used = NOW()
    WHERE hashtag_id = NEW.hashtag_id;
END //

-- =====================================================
-- TRIGGER: Log user activity on post creation
-- =====================================================
CREATE TRIGGER trg_after_post_insert
AFTER INSERT ON posts
FOR EACH ROW
BEGIN
    INSERT INTO user_activity_log (user_id, activity_type, related_post_id)
    VALUES (NEW.user_id, 'post', NEW.post_id);
END //

DELIMITER ;

-- =====================================================
-- END OF TRIGGERS
-- =====================================================
