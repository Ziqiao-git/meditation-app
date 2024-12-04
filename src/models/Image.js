// models/Image.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Image = sequelize.define('Image', {
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'images'
});

module.exports = Image;