require('dotenv').config();
const express = require('express')
const router = express.Router()
const multer = require('multer');
const path = require('path'); 
const sequelize = require('../config/database'); 
const { User, Post, Comment, Image } = require('../models')
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/') // Make sure this directory exists
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});



// Root route for users
router.get("/", async (req, res) => {


    try {
        const posts = await Post.findAll({
            where: { userId: req.session.user.id },
            include: [
                Image,
                {
                    model: User,
                    attributes: ['username']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.render('blog/dashboard', {
            posts: posts,
            user: req.session.user
        });
    } catch (err) {
        console.error("Failed to fetch posts:", err);
        res.status(500).send("Error fetching posts");
    }
})
.post("/", upload.array('images', 5), async (req, res) => {
    const userId = req.session.user?.id;

    if (!userId) {
        return res.status(401).json({ message: "User not logged in." });
    }

    const { title, content, latitude, longitude } = req.body;

    if (!title) {
        return res.status(400).json({
            message: "Please provide title for the blog post."
        });
    }

    const t = await sequelize.transaction();

    try {
        const newPost = await Post.create({
            title: title.trim(),
            content: content.trim(),
            userId: userId,
            latitude: latitude || null,
            longitude: longitude || null,
            created_at: new Date(),
            updated_at: new Date()
        }, { transaction: t });

        if (req.files && req.files.length > 0) {
            const imagePromises = req.files.map(file => {
                return Image.create({
                    imageUrl: `/uploads/${file.filename}`,
                    postId: newPost.id
                }, { transaction: t });
            });

            await Promise.all(imagePromises);
        }

        await t.commit();

        // Fetch the complete post with all associations
        const postWithDetails = await Post.findOne({
            where: { id: newPost.id },
            include: [
                Image,
                {
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Comment,
                    include: [{
                        model: User,
                        attributes: ['username']
                    }]
                }
            ]
        });

        // Send response
        res.render('blog/post', { 
            post: postWithDetails,
            user: req.session.user,
            googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
        });

    } catch (err) {
        if (t && !t.finished) {
            await t.rollback();
        }
        console.error("Failed to create post:", err);
        res.status(500).json({
            message: "Error creating blog post",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// NEW: GET /new - shows the form to create a new post
router.get("/new", async (req, res) => {
    const userId = req.session.user?.id;
    
    if (!userId) {
        return res.status(401).send("User not logged in.");
    }

    res.render('../views/blog/create', {
        user: req.session.user,
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
    });
});
//explore page
router.get("/explore", async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Image
                }
            ],
            order: [['created_at', 'DESC']]
        });
        res.render('../views/blog/explore', {
            user: req.session.user || null,
            posts: posts,
            currentUser: req.session.user || null,
            googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
        });
    } catch (err) {
        console.error("Failed to retrieve posts:", err);
        res.status(500).send("Error retrieving posts");
    }
});

// Get a specific post
router.get("/:id", async (req, res) => {
    const postId = req.params.id;
    
    try {
        const post = await Post.findOne({
            where: { id: postId },
            include: [
                Image,
                {
                    model: Comment,
                    include: [{
                        model: User,
                        attributes: ['username']
                    }]
                },
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        });

        if (!post) {
            return res.status(404).send('Post not found');
        }

        res.render('blog/post', { 
            post: post,
            user: req.session.user || null,
            googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY  
        });
    } catch (err) {
        console.error("Failed to retrieve post:", err);
        res.status(500).send("Error retrieving post");
    }
});

router.delete('/:id', async (req, res) => {
    const userId = req.session.user?.id;
    const postId = req.params.id;

    // Check if user is authenticated
    if (!userId) {
        return res.status(401).json({ message: "User not logged in." });
    }

    // Start a transaction
    const t = await sequelize.transaction();

    try {
        // First check if the post exists and belongs to the user
        const post = await Post.findOne({
            where: {
                id: postId,
                userId: userId
            }
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found or unauthorized" });
        }

        // Delete associated images first
        await Image.destroy({
            where: { postId: postId },
            transaction: t
        });

        // Then delete the post
        await Post.destroy({
            where: {
                id: postId,
                userId: userId
            },
            transaction: t
        });

        // Commit transaction
        await t.commit();

        res.status(200).json({ message: "Post deleted successfully" });

    } catch (err) {
        if (t && !t.finished) {
            await t.rollback();
        }
        console.error("Failed to delete post:", err);
        res.status(500).json({
            message: "Error deleting blog post",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

module.exports = router;