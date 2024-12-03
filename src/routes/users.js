const express = require('express')
const router = express.Router()
const db = require('../config/database');
const bcrypt = require('bcryptjs');

// Root route for users
router.get("/", (req, res) => {
    res.send("Welcome to the Users page!");
});

// Register route
router
    .get("/register", (req, res) => {
    res.render("register");
})  
    .post("/register", async(req, res) => {
    const { username, email, password } = req.body;

    try {
        // Hash the password
        const saltRounds = 10; // Cost factor for hashing the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);
    
        // Check if username or email already exists in the database
        const checkSql = 'SELECT * FROM users WHERE username = ? OR email = ?';
        db.query(checkSql, [username, email], (checkErr, results) => {
            if (checkErr) {
                console.error('Error in the database operation', checkErr);
                return res.status(500).send('Database error while checking for existing user.');
            }
    
            if (results.length > 0) {
                // If a matching user is found
                return res.status(400).send('Username or email already exists.');
            }
    
            // Insert the new user into the database
            const insertSql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
            db.query(insertSql, [username, email, hashedPassword], (insertErr, result) => {
                if (insertErr) {
                    console.error('Error in the database operation', insertErr);
                    return res.status(500).send('Failed to register user.');
                }
                
            });
            req.session.user = { name: email };
                res.send(`User registered successfully! Username: ${username}, Email: ${email}`);
        });
    } catch (err) {
        console.error('Error while hashing the password', err);
        res.status(500).send('Failed to register user.');
    }
});

// Login route
router.get("/login", (req, res) => {
    res.render("login");
})
.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Check if the email exists in the database
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error('Database error', err);
            return res.status(500).send('An error occurred. Please try again.');
        }

        if (results.length === 0) {
            // No user with the given email
            return res.status(400).send('Invalid email or password.');
        }

        const user = results[0]; // Get the user record

        // Compare the entered password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send('Invalid email or password.');
        }
        req.session.user = { name: email };
        // If the credentials are correct, log the user in
        // res.send(`Welcome back, ${user.username}!`);
        res.redirect('/');
    });
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
