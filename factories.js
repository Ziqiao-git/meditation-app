const bcrypt = require('bcryptjs');
const { User, Post, Comment, Image } = require('../../models');

const createTestUser = async (overrides = {}) => {
  const defaultUser = {
    username: `testuser${Date.now()}`,
    email: `test${Date.now()}@example.com`,
    password: await bcrypt.hash('password123', 10)
  };

  return User.create({ ...defaultUser, ...overrides });
};

const createTestPost = async (userId, overrides = {}) => {
  const defaultPost = {
    title: 'Test Post',
    content: 'Test content',
    userId: userId,
    latitude: 40.7128,
    longitude: -74.0060
  };

  return Post.create({ ...defaultPost, ...overrides });
};

const createTestComment = async (userId, postId, overrides = {}) => {
  const defaultComment = {
    content: 'Test comment',
    userId: userId,
    postId: postId
  };

  return Comment.create({ ...defaultComment, ...overrides });
};

const createTestImage = async (postId, overrides = {}) => {
  const defaultImage = {
    imageUrl: '/uploads/test-image.jpg',
    postId: postId
  };

  return Image.create({ ...defaultImage, ...overrides });
};

module.exports = {
  createTestUser,
  createTestPost,
  createTestComment,
  createTestImage
};