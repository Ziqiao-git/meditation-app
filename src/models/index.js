// models/index.js
const sequelize = require('../config/database');

// Import all models
const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');
const Image = require('./Image');

function setupAssociations() {
    // User <-> Post associations
    User.hasMany(Post, {
        foreignKey: {
            name: 'userId',
            allowNull: false
        },
        onDelete: 'CASCADE'
    });
    Post.belongsTo(User, {
        foreignKey: {
            name: 'userId',
            allowNull: false
        }
    });

    // Post <-> Comment associations
    Post.hasMany(Comment, {
        foreignKey: {
            name: 'postId',
            allowNull: false
        },
        onDelete: 'CASCADE'
    });
    Comment.belongsTo(Post, {
        foreignKey: {
            name: 'postId',
            allowNull: false
        }
    });

    // User <-> Comment associations
    Comment.belongsTo(User, {
        foreignKey: {
            name: 'userId',
            allowNull: false
        }
    });

    // Post <-> Image associations
    Post.hasMany(Image, {
        foreignKey: {
            name: 'postId',
            allowNull: false
        },
        onDelete: 'CASCADE'
    });
    Image.belongsTo(Post, {
        foreignKey: {
            name: 'postId',
            allowNull: false
        }
    });
}

// Run the associations setup
setupAssociations();

// Export everything together
module.exports = {
    sequelize,
    User,
    Post,
    Comment,
    Image
};