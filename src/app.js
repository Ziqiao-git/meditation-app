const express = require('express');
const session = require('express-session');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { requireAuth } = require('./middleware/auth');

const app = express();
const viewsPath = path.join(__dirname, '../views');
app.set('views', viewsPath);
app.set('view engine','ejs')

console.log('\n=== Views Directory Configuration ===');
console.log('Views Path:', viewsPath);
console.log('Directory exists:', require('fs').existsSync(viewsPath));
console.log('Directory contents:', require('fs').readdirSync(viewsPath));
console.log('=====================================\n');

app.use(express.static('public'));
// Middleware for reading request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Express session

app.use(session({
    secret: "DevKeyNeedsFixed", // This secret key is used to sign the session ID cookie.
    resave: false,             // Forces the session to be saved back to the session store, even if the session was never modified during the request.
    saveUninitialized: false,  // Forces a session that is "uninitialized" to be saved to the store.
    cookie: { secure: false }  // This should be set to true in production with an HTTPS connection.
  }));



app.get('/',(req,res)=> {
    console.log('Index page')
    res.render("index",{user: req.session.user})
})

const userRouter = require("./routes/users")
const blogRouter = require("./routes/blog")
const commentRouter = require("./routes/comment")

// Protected routes
app.use('/blog', requireAuth, blogRouter);

// Public routes
app.use('/users', userRouter);
app.use('/comment', commentRouter);
app.use('/dist', express.static(path.join(__dirname, 'public/dist')));

app.listen(3000, () => {
  console.log('Server started on port 3000');
});