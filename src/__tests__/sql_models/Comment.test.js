const { User, Post, Comment } = require('../../models');
const sequelize = require('../../config/database');

describe('Comment Model', () => {
  let testUser;
  let testPost;

  beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    
    // Create test user and post
    testUser = await User.create({
      username: 'commentuser',
      email: 'comment@example.com',
      password: 'password123'
    });

    testPost = await Post.create({
      title: 'Test Post for Comments',
      content: 'This is a test post content',
      userId: testUser.id
    });
  });

  afterAll(async () => {
    await sequelize.close();
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  it('should create a comment with valid data', async () => {
    const commentData = {
      content: 'This is a test comment',
      userId: testUser.id,
      postId: testPost.id
    };

    const comment = await Comment.create(commentData);
    expect(comment.content).toBe(commentData.content);
    expect(comment.userId).toBe(testUser.id);
    expect(comment.postId).toBe(testPost.id);
  });

  it('should not create a comment without content', async () => {
    const invalidComment = {
      userId: testUser.id,
      postId: testPost.id
      // missing content
    };

    await expect(Comment.create(invalidComment)).rejects.toThrow();
  });

  it('should not create a comment with empty content', async () => {
    const emptyComment = {
      content: '',
      userId: testUser.id,
      postId: testPost.id
    };

    await expect(Comment.create(emptyComment)).rejects.toThrow();
  });

  it('should fetch comments with user information', async () => {
    await Comment.create({
      content: 'Comment with user info',
      userId: testUser.id,
      postId: testPost.id
    });

    const comments = await Comment.findAll({
      where: { postId: testPost.id },
      include: [{
        model: User,
        attributes: ['username']
      }]
    });

    expect(comments.length).toBeGreaterThan(0);
    expect(comments[0].User.username).toBe('commentuser');
  });

  it('should delete comments when post is deleted', async () => {
    const newPost = await Post.create({
      title: 'Post to delete',
      content: 'Content',
      userId: testUser.id
    });

    await Comment.create({
      content: 'Comment to be deleted',
      userId: testUser.id,
      postId: newPost.id
    });

    await newPost.destroy();

    const comments = await Comment.findAll({
      where: { postId: newPost.id }
    });

    expect(comments.length).toBe(0);
  });

  it('should update timestamp when comment is modified', async () => {
    const comment = await Comment.create({
      content: 'Original content',
      userId: testUser.id,
      postId: testPost.id
    });

    const createdAt = comment.created_at;
    const updatedAt = comment.updated_at;

    await new Promise(resolve => setTimeout(resolve, 100));

    comment.content = 'Updated content';
    await comment.save();

    expect(comment.created_at).toEqual(createdAt);
    expect(comment.updated_at).not.toEqual(updatedAt);
  });
}); 