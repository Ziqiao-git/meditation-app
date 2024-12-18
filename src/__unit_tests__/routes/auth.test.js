const request = require('supertest');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const { User } = require('../../models');
const sequelize = require('../../config/database');
const userRouter = require('../../routes/users');

describe('Authentication', () => {
  let app;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    app.use(session({
      secret: 'test-secret',
      resave: false,
      saveUninitialized: false
    }));
    app.use('/users', userRouter);

    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  beforeEach(async () => {
    await User.destroy({ where: {} });
  });

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/users/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(201);
    const user = await User.findOne({ where: { email: 'test@example.com' } });
    expect(user).not.toBeNull();
    expect(user.username).toBe('testuser');
  });

  it('should login with correct credentials', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.create({
      username: 'loginuser',
      email: 'login@example.com',
      password: hashedPassword
    });

    const response = await request(app)
      .post('/users/login')
      .send({
        email: 'login@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(302); // Redirect status code
    expect(response.headers.location).toBe('/blog');
  });

  it('should reject login with incorrect password', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.create({
      username: 'wrongpass',
      email: 'wrong@example.com',
      password: hashedPassword
    });

    const response = await request(app)
      .post('/users/login')
      .send({
        email: 'wrong@example.com',
        password: 'wrongpassword'
      });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid email or password.');
  });

  it('should logout successfully', async () => {
    const agent = request.agent(app);
    
    // Create and login user first
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.create({
      username: 'logoutuser',
      email: 'logout@example.com',
      password: hashedPassword
    });

    await agent
      .post('/users/login')
      .send({
        email: 'logout@example.com',
        password: 'password123'
      });

    const response = await agent.get('/users/logout');
    
    expect(response.status).toBe(302); // Redirect status code
    expect(response.headers.location).toBe('/');
  });
});