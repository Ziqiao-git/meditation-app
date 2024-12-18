const bcrypt = require('bcryptjs');
const { User, Post } = require('../models');

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
    userId: userId
  };

  return Post.create({ ...defaultPost, ...overrides });
};

module.exports = {
  createTestUser,
  createTestPost
};