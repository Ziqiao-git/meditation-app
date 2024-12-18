const { User, Post, Image } = require('../../models');
const sequelize = require('../../config/database');

describe('Image Model', () => {
  let testUser;
  let testPost;

  beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    
    // Create test user and post
    testUser = await User.create({
      username: 'imageuser',
      email: 'image@example.com',
      password: 'password123'
    });

    testPost = await Post.create({
      title: 'Test Post for Images',
      content: 'This is a test post content',
      userId: testUser.id
    });
  });

  afterAll(async () => {
    await sequelize.close();
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  it('should create an image with valid data', async () => {
    const imageData = {
      imageUrl: '/uploads/test-image.jpg',
      postId: testPost.id
    };

    const image = await Image.create(imageData);
    expect(image.imageUrl).toBe(imageData.imageUrl);
    expect(image.postId).toBe(testPost.id);
  });

  it('should not create an image without required fields', async () => {
    const invalidImage = {
      postId: testPost.id
      // missing imageUrl
    };

    await expect(Image.create(invalidImage)).rejects.toThrow();
  });

  it('should delete images when post is deleted', async () => {
    const newPost = await Post.create({
      title: 'Post with images',
      content: 'Content',
      userId: testUser.id
    });

    await Image.create({
      imageUrl: '/uploads/to-delete.jpg',
      postId: newPost.id
    });

    await newPost.destroy();

    const images = await Image.findAll({
      where: { postId: newPost.id }
    });

    expect(images.length).toBe(0);
  });

  it('should fetch images with post information', async () => {
    const image = await Image.create({
      imageUrl: '/uploads/with-post.jpg',
      postId: testPost.id
    });

    const imageWithPost = await Image.findOne({
      where: { id: image.id },
      include: [{
        model: Post,
        attributes: ['title']
      }]
    });

    expect(imageWithPost.Post.title).toBe('Test Post for Images');
  });

  it('should handle multiple images per post', async () => {
    const images = await Promise.all([
      Image.create({
        imageUrl: '/uploads/image1.jpg',
        postId: testPost.id
      }),
      Image.create({
        imageUrl: '/uploads/image2.jpg',
        postId: testPost.id
      })
    ]);

    const postImages = await Image.findAll({
      where: { postId: testPost.id }
    });

    expect(postImages.length).toBeGreaterThanOrEqual(2);
  });
}); 