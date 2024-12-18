process.env.NODE_ENV = 'test';
process.env.DB_TYPE = 'sqlite'; 
process.env.DB_HOST = 'localhost';
process.env.DB_NAME = 'med-app-test';

const sequelize = require('./src/config/database');
const { User, Post, Comment, Image } = require('./src/models');

const setupTestDb = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  } catch (error) {
    console.error('Test database setup failed:', error);
    throw error;
  }
};

const clearTestDb = async () => {
  try {
    await Promise.all([
      User.destroy({ where: {} }),
      Post.destroy({ where: {} }),
      Comment.destroy({ where: {} }),
      Image.destroy({ where: {} })
    ]);
  } catch (error) {
    console.error('Database cleanup failed:', error);
    throw error;
  }
};

const closeTestDb = async () => {
  try {
    await sequelize.close();
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (error) {
    console.error('Database connection close failed:', error);
    throw error;
  }
};

module.exports = {
  setupTestDb,
  clearTestDb,
  closeTestDb
};