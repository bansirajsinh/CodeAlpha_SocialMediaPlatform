-- =====================================================
-- CODEALPHA SOCIAL MEDIA PLATFORM - SEED DATA
-- =====================================================
-- Dummy data for testing and development
-- Insert test data for social media platform
-- =====================================================

USE social_media_app;

-- =====================================================
-- SEED DATA: USERS (Test User Accounts)
-- =====================================================
INSERT INTO users (username, email, password_hash, first_name, last_name, bio, profile_picture_url, location, is_verified) VALUES
('alex_jones', 'alex@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/1Pq', 'Alex', 'Jones', 'Tech enthusiast & blogger', 'https://via.placeholder.com/200x200?text=Alex', 'San Francisco, CA', TRUE),
('sarah_miller', 'sarah@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/1Pq', 'Sarah', 'Miller', 'Digital marketer | Travel lover', 'https://via.placeholder.com/200x200?text=Sarah', 'New York, NY', TRUE),
('mike_photography', 'mike@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/1Pq', 'Mike', 'Chen', 'Photographer | Adventure seeker', 'https://via.placeholder.com/200x200?text=Mike', 'Los Angeles, CA', FALSE),
('emma_designs', 'emma@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/1Pq', 'Emma', 'Wilson', 'UI/UX Designer', 'https://via.placeholder.com/200x200?text=Emma', 'Austin, TX', TRUE),
('david_fitness', 'david@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/1Pq', 'David', 'Brown', 'Fitness coach | Health advocate', 'https://via.placeholder.com/200x200?text=David', 'Denver, CO', FALSE);

-- =====================================================
-- SEED DATA: FOLLOWERS (Follow Relationships)
-- =====================================================
INSERT INTO followers (follower_user_id, following_user_id, status) VALUES
(1, 2, 'following'),
(1, 3, 'following'),
(1, 4, 'following'),
(2, 1, 'following'),
(2, 4, 'following'),
(2, 5, 'following'),
(3, 1, 'following'),
(3, 4, 'following'),
(4, 1, 'following'),
(4, 2, 'following'),
(4, 3, 'following'),
(5, 1, 'following'),
(5, 2, 'following');

-- =====================================================
-- SEED DATA: HASHTAGS (Trending Tags)
-- =====================================================
INSERT INTO hashtags (tag_name, usage_count) VALUES
('#technology', 45),
('#photography', 38),
('#design', 32),
('#fitness', 28),
('#travel', 55),
('#marketing', 21),
('#lifestyle', 19),
('#business', 17);

-- =====================================================
-- SEED DATA: POSTS (User Posts)
-- =====================================================
INSERT INTO posts (user_id, content, image_url, post_type, visibility, like_count, comment_count) VALUES
(1, 'Just launched my new project! So excited to share it with everyone. Check it out and let me know what you think! #technology #project', 'https://via.placeholder.com/600x400?text=Project+Launch', 'image', 'public', 45, 8),
(1, 'Working on some amazing new features for our app. Stay tuned!', NULL, 'text', 'public', 23, 5),
(2, 'Beautiful sunset at the beach today. Perfect way to end the week! #travel #sunset', 'https://via.placeholder.com/600x400?text=Sunset', 'image', 'public', 89, 12),
(3, 'Behind the scenes shot from yesterday''s photoshoot. Love this angle! #photography #behindthescenes', 'https://via.placeholder.com/600x400?text=BTS', 'image', 'public', 67, 9),
(4, 'Just finished redesigning my portfolio website. The new design is so clean and modern! #design #ux', 'https://via.placeholder.com/600x400?text=Portfolio', 'image', 'public', 56, 11),
(5, 'Monday morning gym motivation! Starting the week strong. Who''s joining me? #fitness #motivation', 'https://via.placeholder.com/600x400?text=Gym', 'image', 'public', 34, 7),
(1, 'Tips for productive remote work: 1) Set a schedule 2) Take breaks 3) Stay hydrated #productivity', NULL, 'text', 'public', 78, 14),
(2, 'Just booked tickets for my next adventure! Can''t wait! #travel #adventures', NULL, 'text', 'public', 52, 9),
(3, 'New lens arrived today! Ready to capture some amazing shots! #photography #gear', 'https://via.placeholder.com/600x400?text=New+Lens', 'image', 'public', 41, 6),
(4, 'Design principle of the day: Keep it simple! #design #designprinciples', NULL, 'text', 'public', 38, 5);

-- =====================================================
-- SEED DATA: POST_HASHTAGS (Posts with Hashtags)
-- =====================================================
INSERT INTO post_hashtags (post_id, hashtag_id) VALUES
(1, 1),
(2, 1),
(3, 5),
(4, 2),
(5, 3),
(6, 4),
(7, 1),
(8, 5),
(9, 2),
(10, 3);

-- =====================================================
-- SEED DATA: POST_LIKES (Likes on Posts)
-- =====================================================
INSERT INTO post_likes (post_id, user_id) VALUES
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(2, 1),
(2, 3),
(2, 4),
(3, 1),
(3, 2),
(3, 4),
(3, 5),
(4, 1),
(4, 2),
(4, 3),
(4, 5),
(5, 1),
(5, 2),
(5, 3),
(5, 4),
(6, 1),
(6, 2),
(6, 3),
(7, 2),
(7, 3),
(7, 4),
(8, 1),
(8, 3),
(8, 4),
(9, 1),
(9, 2),
(9, 5),
(10, 1),
(10, 2),
(10, 5);

-- =====================================================
-- SEED DATA: COMMENTS (Comments on Posts)
-- =====================================================
INSERT INTO comments (post_id, user_id, content, like_count) VALUES
(1, 2, 'This looks amazing! Great work!', 3),
(1, 3, 'Congrats on the launch! 🎉', 2),
(1, 4, 'Love the design approach here!', 1),
(2, 3, 'Can''t wait to see what''s coming!', 2),
(2, 5, 'Keep up the great work!', 1),
(3, 1, 'Absolutely beautiful! Where was this taken?', 4),
(3, 4, 'The colors are perfect!', 2),
(4, 1, 'This is such a cool shot! The composition is great', 3),
(4, 5, 'Professional work right here!', 1),
(5, 2, 'Love the modern aesthetic!', 2),
(5, 3, 'This is so clean and professional!', 2),
(6, 1, 'Your dedication is inspiring!', 3),
(6, 4, 'Love the energy!', 1),
(7, 3, 'Great tips! Thanks for sharing!', 4),
(7, 4, 'I needed this today!', 2);

-- =====================================================
-- SEED DATA: COMMENT_LIKES (Likes on Comments)
-- =====================================================
INSERT INTO comment_likes (comment_id, user_id) VALUES
(1, 1),
(1, 3),
(1, 5),
(2, 1),
(2, 2),
(3, 1),
(4, 1),
(6, 2),
(6, 3),
(6, 4),
(7, 1),
(7, 2),
(8, 2),
(8, 3),
(8, 5),
(9, 2),
(10, 1),
(10, 3),
(11, 2),
(11, 4);

-- =====================================================
-- SEED DATA: NOTIFICATIONS (Activity Notifications)
-- =====================================================
INSERT INTO notifications (user_id, actor_id, notification_type, post_id, message, is_read) VALUES
(1, 2, 'like', 2, 'Alex liked your post', FALSE),
(1, 3, 'follow', NULL, 'Mike started following you', FALSE),
(2, 1, 'like', 3, 'Alex liked your post', TRUE),
(2, 1, 'comment', 3, 'Alex commented on your post', TRUE),
(3, 1, 'follow', NULL, 'Alex started following you', FALSE),
(3, 4, 'like', 4, 'Emma liked your post', FALSE),
(4, 1, 'like', 5, 'Alex liked your post', TRUE),
(4, 2, 'comment', 5, 'Sarah commented on your post', TRUE),
(5, 1, 'like', 6, 'Alex liked your post', FALSE),
(5, 2, 'follow', NULL, 'Sarah started following you', FALSE);

-- =====================================================
-- SEED DATA: DIRECT_MESSAGES (Private Messages)
-- =====================================================
INSERT INTO direct_messages (sender_id, recipient_id, content, is_read) VALUES
(1, 2, 'Hey Sarah! How are you doing?', TRUE),
(2, 1, 'I''m doing great! How about you?', TRUE),
(1, 2, 'All good! Want to collaborate on a project?', TRUE),
(2, 1, 'That sounds interesting! Let''s discuss!', FALSE),
(3, 1, 'Hi Alex! Love your recent posts!', FALSE),
(4, 2, 'Sarah, your portfolio looks amazing!', FALSE),
(1, 4, 'Thanks Emma! I would love your feedback on my design!', FALSE);

-- =====================================================
-- SEED DATA: BLOCKS (Blocked Users)
-- =====================================================
-- Add blocks if needed - initially empty

-- =====================================================
-- SEED DATA: USER_ACTIVITY_LOG (Activity Tracking)
-- =====================================================
INSERT INTO user_activity_log (user_id, activity_type, related_post_id, related_user_id) VALUES
(1, 'login', NULL, NULL),
(1, 'post', 1, NULL),
(1, 'post', 2, NULL),
(2, 'login', NULL, NULL),
(2, 'like', 1, NULL),
(2, 'comment', 1, NULL),
(2, 'post', 3, NULL),
(3, 'login', NULL, NULL),
(3, 'like', 1, NULL),
(3, 'post', 4, NULL),
(4, 'login', NULL, NULL),
(4, 'like', 5, NULL),
(4, 'post', 5, NULL),
(5, 'login', NULL, NULL),
(5, 'like', 6, NULL),
(5, 'post', 6, NULL),
(1, 'follow', NULL, 3),
(2, 'message', NULL, 1);

-- =====================================================
-- VERIFICATION: Display Sample Data
-- =====================================================
-- Verify inserts were successful
SELECT 'Users' AS table_name, COUNT(*) AS count FROM users
UNION ALL
SELECT 'Followers', COUNT(*) FROM followers
UNION ALL
SELECT 'Posts', COUNT(*) FROM posts
UNION ALL
SELECT 'Post Likes', COUNT(*) FROM post_likes
UNION ALL
SELECT 'Comments', COUNT(*) FROM comments
UNION ALL
SELECT 'Comment Likes', COUNT(*) FROM comment_likes
UNION ALL
SELECT 'Notifications', COUNT(*) FROM notifications
UNION ALL
SELECT 'Direct Messages', COUNT(*) FROM direct_messages
UNION ALL
SELECT 'Hashtags', COUNT(*) FROM hashtags
UNION ALL
SELECT 'Blocks', COUNT(*) FROM blocks
UNION ALL
SELECT 'Activity Log', COUNT(*) FROM user_activity_log;

-- =====================================================
-- END OF SEED DATA
-- =====================================================
