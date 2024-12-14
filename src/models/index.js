// models/index.js
const sequelize = require('../config/database');
const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');
const Image = require('./Image');

const setupAssociations = () => {
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
    User.hasMany(Comment, {
        foreignKey: {
            name: 'userId',
            allowNull: false
        },
        onDelete: 'CASCADE'
    });
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
};

// Run the associations setup
setupAssociations();

module.exports = {
    sequelize,
    User,
    Post,
    Comment,
    Image,
    setupAssociations
};

