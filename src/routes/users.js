const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');  // Add this line
const sequelize = require('../config/database'); 
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Root route for users
// router.get("/", (req, res) => {
//     res.send("Welcome to the Users page!");
// });

// Register route
router
    .get("/register", (req, res) => {
    res.render("users/register");
})  
    .post("/register", async(req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if username or email already exists
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { username: username },
                    { email: email }
                ]
            }
        });
        if (existingUser) {
            return res.send(`
                <script>
                    alert('Username or email already exists.');
                    window.location.href = '/users/register';  // Go back to register page
                </script>
            `);
        }
        // Hash the password
        const salt = await bcrypt.genSalt(10);  // Generate a salt
        const hashedPassword = await bcrypt.hash(password, salt);  // Hash the password with the salt
 
        // Create a new user
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        req.session.user = { id: user.id, name: user.username };
        res.send(`
            <script>
                alert("User registered successfully! Username: ${user.username}, Email: ${user.email}");
                window.location.href = '/blog';  // Redirect to dashboard
            </script>
        `);

    } catch (err) {
        console.error('Error while registering user:', err);
        res.status(500).send('Failed to register user.');
    }
});

// Login route
router.get("/login", (req, res) => {
    res.render("users/login");
})
.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).send('Invalid email or password.');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid email or password.');
        }

        req.session.user = { id: user.id, name: user.username };
        res.redirect('/blog');
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).send('An error occurred. Please try again.');
    }
    
});

// Logout route
router.get("/logout", (req, res) => {
    // Destroy the session
    req.session.destroy(err => {
        if (err) {
            // Handle error case: perhaps logging the error or sending a failure message
            console.error("Failed to destroy the session during logout.", err);
            return res.status(500).send("Could not log out, please try again.");
        }

        // Optionally clear the client-side cookie for the session
        res.clearCookie('connect.sid'); // Ensure you have the right name for your session ID cookie, 'connect.sid' is the default with express-session

        // Redirect the user to the home page or login page after logout
        res.redirect('/');
    });
});

module.exports = router;
