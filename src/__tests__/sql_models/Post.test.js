const { Post, User } = require('../../models');
const sequelize = require('../../config/database');

describe('Post Model', () => {
  let testUser;

  beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    
    // Create a test user that we'll use for posts
    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
  });

  afterAll(async () => {
    await sequelize.close();
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  it('should create a post with valid data', async () => {
    const postData = {
      title: 'Test Post',
      content: 'This is a test post content',
      userId: testUser.id
    };

    const post = await Post.create(postData);
    expect(post.title).toBe(postData.title);
    expect(post.content).toBe(postData.content);
    expect(post.userId).toBe(testUser.id);
  });

  it('should not create a post without required fields', async () => {
    const invalidPost = {
      title: 'Test Post'
      // missing content and userId
    };

    await expect(Post.create(invalidPost)).rejects.toThrow();
  });

  it('should create a post with location data', async () => {
    const postWithLocation = {
      title: 'Location Post',
      content: 'This post has location data',
      userId: testUser.id,
      latitude: 40.7128,
      longitude: -74.0060
    };

    const post = await Post.create(postWithLocation);
    expect(post.latitude).toBe(40.7128);
    expect(post.longitude).toBe(-74.0060);
  });

  it('should update timestamp when post is modified', async () => {
    const post = await Post.create({
      title: 'Original Title',
      content: 'Original content',
      userId: testUser.id
    });

    const createdAt = post.created_at;
    const updatedAt = post.updated_at;

    // Wait a bit to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 100));

    post.title = 'Updated Title';
    await post.save();

    expect(post.created_at).toEqual(createdAt);
    expect(post.updated_at).not.toEqual(updatedAt);
  });

  it('should find posts by user ID', async () => {
    // Create multiple posts for the test user
    await Post.create({
      title: 'Post 1',
      content: 'Content 1',
      userId: testUser.id
    });

    await Post.create({
      title: 'Post 2',
      content: 'Content 2',
      userId: testUser.id
    });

    const userPosts = await Post.findAll({
      where: { userId: testUser.id }
    });

    expect(userPosts.length).toBeGreaterThanOrEqual(2);
    userPosts.forEach(post => {
      expect(post.userId).toBe(testUser.id);
    });
  });
}); 