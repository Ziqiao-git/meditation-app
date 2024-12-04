// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ensure this points to your Sequelize connection setup

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
    }
}, {
    tableName: 'users',
    timestamps: true,  // Enable timestamp handling
    createdAt: 'created_at',  // Tell Sequelize which field to use for createdAt
    updatedAt: 'updated_at'  // Tell Sequelize which field to use for updatedAt
});

module.exports = User;
