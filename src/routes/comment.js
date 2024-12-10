const express = require('express');
const router = express.Router();
const { User, Post, Comment } = require('../models');

// Create a new comment
router.post('/:postId', async (req, res) => {
    const { content } = req.body;
    const postId = req.params.postId;
    const userId = req.session.user?.id;

    if (!userId) {
        return res.status(401).json({ message: "User not logged in." });
    }

    try {
        // Check if post exists
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        // Create comment
        const comment = await Comment.create({
            content: content.trim(),
            userId,
            postId,
            created_at: new Date(),
            updated_at: new Date()
        });

        // Fetch the comment with user details
        const commentWithUser = await Comment.findOne({
            where: { id: comment.id },
            include: [{
                model: User,
                attributes: ['username']
            }]
        });

        res.status(201).json(commentWithUser);
    } catch (err) {
        console.error("Failed to create comment:", err);
        res.status(500).json({ message: "Error creating comment" });
    }
});

// Delete a comment
router.delete('/:commentId', async (req, res) => {
    const userId = req.session.user?.id;
    const commentId = req.params.commentId;

    if (!userId) {
        return res.status(401).json({ message: "User not logged in." });
    }

    try {
        const comment = await Comment.findByPk(commentId);
        
        if (!comment) {
            return res.status(404).json({ message: "Comment not found." });
        }

        // Check if user owns the comment
        if (comment.userId !== userId) {
            return res.status(403).json({ message: "Not authorized to delete this comment." });
        }

        await comment.destroy();
        res.json({ message: "Comment deleted successfully." });
    } catch (err) {
        console.error("Failed to delete comment:", err);
        res.status(500).json({ message: "Error deleting comment" });
    }
});

module.exports = router;