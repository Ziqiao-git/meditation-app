const request = require('supertest');
const express = require('express');
const session = require('express-session');
const path = require('path');
const { setupTestDb, clearTestDb, closeTestDb } = require('../../testsetup.integration');
const { createTestUser, createTestPost } = require('./factories');
const blogRouter = require('../routes/blog');
const fs = require('fs');

describe('Blog Routes Integration', () => {
  let app;
  let testUser;
  let testPost;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../../views'));
    
    app.use((req, res, next) => {
      res.render = function(view, locals) {
        res.json(locals);
      };
      next();
    });

    app.use(session({
      secret: 'test-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false },
      name: 'connect.sid'
    }));
    
    app.use((req, res, next) => {
      if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        req.session.user = { id: token };
      }
      next();
    });
    
    app.use('/blog', blogRouter);
    
    await setupTestDb();
    testUser = await createTestUser();
  });

  beforeEach(async () => {
    await clearTestDb();
    testUser = await createTestUser();
    testPost = await createTestPost(testUser.id);
  });

  afterAll(async () => {
    await closeTestDb();
  });

  describe('GET /blog', () => {
    it('should return user posts when authenticated', async () => {
      const response = await request(app)
        .get('/blog')
        .set('Authorization', `Bearer ${testUser.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('posts');
      expect(Array.isArray(response.body.posts)).toBeTruthy();
    });

    it('should handle unauthorized access', async () => {
      const response = await request(app)
        .get('/blog')
        .expect(401);

      expect(response.body).toHaveProperty('message', 'User not logged in');
    });
  });

  describe('POST /blog', () => {
    it('should create a new blog post with images', async () => {
      const response = await request(app)
        .post('/blog')
        .set('Authorization', `Bearer ${testUser.id}`)
        .field('title', 'Test Post')
        .field('content', 'Test content')
        .field('latitude', '40.7128')
        .field('longitude', '-74.0060')
        .attach('images', path.join(__dirname, './fixtures/test-image.jpg'))
        .expect(200);

      expect(response.body.post).toHaveProperty('id');
      expect(response.body.post.title).toBe('Test Post');
    });
  });
});