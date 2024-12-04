// models/Comment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comment = sequelize.define('Comment', {
    postId: {
        type: DataTypes.INTEGER,
        
    },
    userId: {
        type: DataTypes.UUID,
        
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'comments'
});

module.exports = Comment;
