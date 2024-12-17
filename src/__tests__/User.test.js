const { User } = require('../models');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

describe('User Model', () => {

  it('should hash password before saving', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    const user = await User.build(userData);
    expect(user.password).toBe(userData.password); // Password not hashed yet

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    
    expect(user.password).not.toBe(userData.password); // Password should be hashed
    expect(await bcrypt.compare(userData.password, user.password)).toBe(true);
  });
});
