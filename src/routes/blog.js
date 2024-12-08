require('dotenv').config();
const express = require('express')
const router = express.Router()
const multer = require('multer');
const path = require('path'); 
const sequelize = require('../config/database'); 
const { User, Post, Comment, Image } = require('../models')

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
    const userId = req.session.user?.id; 

    // Check if the userId exists in the session
    if (!userId) {
        return res.status(401).send("User not logged in.");
    }

    try {
        // Retrieve posts from database
        const posts = await Post.findAll({
            where: { userId: userId } // Correctly using the `where` clause
        });
        // Assuming you want to send the posts as a response or render a view
        res.render('../views/blog/dashboard', { posts: posts }); // For API response with posts
        // res.render('dashboard', { posts: posts }); // If you're rendering a view
    } catch (err) {
        console.error("Failed to retrieve posts:", err);
        res.status(500).send("Error retrieving posts.");
    }
})
.post("/", upload.array('images', 5), async (req, res) => {
    const userId = req.session.user?.id;

    // Check if user is authenticated
    if (!userId) {
        return res.status(401).json({ message: "User not logged in." });
    }

    // Destructure required fields from request body
    const { title, content, latitude, longitude } = req.body;

    // Validate input
    if (!title ) {
        return res.status(400).json({
            message: "Please provide title for the blog post."
        });
    }

    // Start a transaction
    const t = await sequelize.transaction();

    try {
        // Create new post in database
        const newPost = await Post.create({
            title: title.trim(),
            content: content.trim(),
            userId: userId,
            latitude: latitude || null,
            longitude: longitude || null,
            created_at: new Date(),
            updated_at: new Date()
        }, { transaction: t });

        // Handle image uploads if any
        if (req.files && req.files.length > 0) {
            const imagePromises = req.files.map(file => {
                return Image.create({
                    imageUrl: `/uploads/${file.filename}`,
                    postId: newPost.id
                }, { transaction: t });
            });

            await Promise.all(imagePromises);
        }

        // Commit transaction
        await t.commit();

        // Fetch the post with its images
        const postWithImages = await Post.findOne({
            where: { id: newPost.id },
            include: [Image]
        });

        // Send response
        res.render('blog/post', { 
            post: postWithImages,
            googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
        })
        

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
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
    });
});
//explore page
router.get("/explore", async (req, res) => {
    console.log("Hitting explore route");
    try {
        const posts = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username'] // Only get the username
                },
                {
                    model: Image
                }
            ],
            order: [['created_at', 'DESC']] // Most recent first
        });
        console.log("Posts found:", posts.length);  // Add this
        console.log("First post:", posts[0]);  // Add this to see post structure
        res.render('../views/blog/explore', {
            posts: posts,
            currentUser: req.session.user || null,
            googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
        });
        console.log("Rendering with data:", {
            postsLength: posts.length,
            hasCurrentUser: !!req.session.user,
            hasApiKey: !!process.env.GOOGLE_MAPS_API_KEY
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
            include: [Image]  // Include associated images
        });

        if (!post) {
            return res.status(404).send('Post not found');
        }

        res.render('blog/post', { 
            post: post,
            googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY  
        });
    } catch (err) {
        console.error("Failed to retrieve post:", err);
        res.status(500).send("Error retrieving post");
    }
});



module.exports = router;