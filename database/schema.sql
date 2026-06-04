-- =====================================================
-- CODEALPHA SOCIAL MEDIA PLATFORM - DATABASE SCHEMA
-- =====================================================
-- Database: social_media_app
-- Task 2: Social Media Platform
-- Created for Full Stack Development Internship Project
-- =====================================================

-- Drop existing database if exists (for fresh setup)
DROP DATABASE IF EXISTS social_media_app;
CREATE DATABASE social_media_app;
USE social_media_app;

-- =====================================================
-- TABLE 1: USERS (User Accounts & Authentication)
-- =====================================================
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    bio TEXT,
    profile_picture_url VARCHAR(255),
    cover_photo_url VARCHAR(255),
    location VARCHAR(100),
    website VARCHAR(255),
    birth_date DATE,
    account_status ENUM('active', 'inactive', 'suspended', 'deleted') DEFAULT 'active',
    is_verified BOOLEAN DEFAULT FALSE,
    is_private BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login DATETIME,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_created_at (created_at),
    INDEX idx_account_status (account_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 2: FOLLOWERS (Follow/Unfollow Relationships)
-- =====================================================
CREATE TABLE followers (
    follower_id INT PRIMARY KEY AUTO_INCREMENT,
    follower_user_id INT NOT NULL,
    following_user_id INT NOT NULL,
    followed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('following', 'blocked', 'muted') DEFAULT 'following',
    FOREIGN KEY (follower_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (following_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_follow_pair (follower_user_id, following_user_id),
    INDEX idx_follower_user_id (follower_user_id),
    INDEX idx_following_user_id (following_user_id),
    INDEX idx_followed_at (followed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 3: POSTS (User Posts/Tweets)
-- =====================================================
CREATE TABLE posts (
    post_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(255),
    image_urls JSON,
    post_type ENUM('text', 'image', 'video', 'shared') DEFAULT 'text',
    visibility ENUM('public', 'followers_only', 'private') DEFAULT 'public',
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    share_count INT DEFAULT 0,
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at DATETIME,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_visibility (visibility),
    INDEX idx_is_deleted (is_deleted),
    FULLTEXT INDEX ft_search (content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 4: POST_LIKES (Likes on Posts)
-- =====================================================
CREATE TABLE post_likes (
    like_id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_post_like (post_id, user_id),
    INDEX idx_post_id (post_id),
    INDEX idx_user_id (user_id),
    INDEX idx_liked_at (liked_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 5: COMMENTS (Comments on Posts)
-- =====================================================
CREATE TABLE comments (
    comment_id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    parent_comment_id INT,
    content TEXT NOT NULL,
    like_count INT DEFAULT 0,
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at DATETIME,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES comments(comment_id) ON DELETE CASCADE,
    INDEX idx_post_id (post_id),
    INDEX idx_user_id (user_id),
    INDEX idx_parent_comment_id (parent_comment_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 6: COMMENT_LIKES (Likes on Comments)
-- =====================================================
CREATE TABLE comment_likes (
    like_id INT PRIMARY KEY AUTO_INCREMENT,
    comment_id INT NOT NULL,
    user_id INT NOT NULL,
    liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comment_id) REFERENCES comments(comment_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_comment_like (comment_id, user_id),
    INDEX idx_comment_id (comment_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 7: NOTIFICATIONS (Activity Notifications)
-- =====================================================
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    actor_id INT NOT NULL,
    notification_type ENUM('like', 'comment', 'follow', 'mention', 'share') DEFAULT 'like',
    post_id INT,
    comment_id INT,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    read_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(comment_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 8: DIRECT_MESSAGES (Private Messages)
-- =====================================================
CREATE TABLE direct_messages (
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT NOT NULL,
    recipient_id INT NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    read_at DATETIME,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_sender_id (sender_id),
    INDEX idx_recipient_id (recipient_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 9: HASHTAGS (Trending Topics)
-- =====================================================
CREATE TABLE hashtags (
    hashtag_id INT PRIMARY KEY AUTO_INCREMENT,
    tag_name VARCHAR(100) UNIQUE NOT NULL,
    usage_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used TIMESTAMP,
    INDEX idx_tag_name (tag_name),
    INDEX idx_usage_count (usage_count)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 10: POST_HASHTAGS (Posts Tagged with Hashtags)
-- =====================================================
CREATE TABLE post_hashtags (
    post_hashtag_id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    hashtag_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (hashtag_id) REFERENCES hashtags(hashtag_id) ON DELETE CASCADE,
    UNIQUE KEY unique_post_hashtag (post_id, hashtag_id),
    INDEX idx_post_id (post_id),
    INDEX idx_hashtag_id (hashtag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 11: BLOCKS (Blocked Users)
-- =====================================================
CREATE TABLE blocks (
    block_id INT PRIMARY KEY AUTO_INCREMENT,
    blocker_user_id INT NOT NULL,
    blocked_user_id INT NOT NULL,
    reason VARCHAR(255),
    blocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (blocker_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (blocked_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_block (blocker_user_id, blocked_user_id),
    INDEX idx_blocker_user_id (blocker_user_id),
    INDEX idx_blocked_user_id (blocked_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 12: USER_ACTIVITY_LOG (Activity Tracking)
-- =====================================================
CREATE TABLE user_activity_log (
    activity_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    activity_type ENUM('login', 'post', 'like', 'comment', 'follow', 'message') DEFAULT 'login',
    related_post_id INT,
    related_user_id INT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (related_post_id) REFERENCES posts(post_id) ON DELETE SET NULL,
    FOREIGN KEY (related_user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_activity_type (activity_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PERFORMANCE INDEXES
-- =====================================================
CREATE INDEX idx_posts_user_created ON posts(user_id, created_at);
CREATE INDEX idx_comments_post_created ON comments(post_id, created_at);
CREATE INDEX idx_followers_count ON followers(following_user_id);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);

-- =====================================================
-- END OF SCHEMA
-- =====================================================
