const { User } = require('../../models');
const sequelize = require('../../config/database');
const bcrypt = require('bcryptjs');

describe('User Model', () => {
  beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  beforeEach(async () => {
    await User.destroy({ where: {} }); // Clear users before each test
  });

  it('should create a user with hashed password', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10)
    };

    const user = await User.create(userData);
    expect(user.password).toBe(userData.password);
  });

  it('should create a user with valid data', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    const user = await User.create(userData);
    expect(user.username).toBe(userData.username);
    expect(user.email).toBe(userData.email);
    expect(user.id).toBeDefined();
  });

  it('should not create a user with duplicate email', async () => {
    const userData = {
      username: 'testuser1',
      email: 'duplicate@example.com',
      password: 'password123'
    };

    await User.create(userData);
    
    await expect(User.create({
      ...userData,
      username: 'testuser2'
    })).rejects.toThrow();
  });

  it('should not create a user with duplicate username', async () => {
    const userData = {
      username: 'duplicateuser',
      email: 'unique@example.com',
      password: 'password123'
    };

    await User.create(userData);
    
    await expect(User.create({
      ...userData,
      email: 'different@example.com'
    })).rejects.toThrow();
  });

  it('should not create a user without required fields', async () => {
    const invalidUserData = {
      username: 'testuser'
      // missing email and password
    };

    await expect(User.create(invalidUserData)).rejects.toThrow();
  });

  it('should update timestamp when user is modified', async () => {
    const user = await User.create({
      username: 'timeuser',
      email: 'time@example.com',
      password: 'password123'
    });

    const createdAt = user.created_at;
    const updatedAt = user.updated_at;

    // Wait a bit to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 100));

    user.username = 'newtimeuser';
    await user.save();

    expect(user.created_at).toEqual(createdAt);
    expect(user.updated_at).not.toEqual(updatedAt);
  });
});