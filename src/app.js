const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const app = express();
app.set('view engine','ejs')
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
    res.render("index",{user: req.session.user,text: "My"})
})

const userRouter = require("./routes/users")

app.use('/users',userRouter)

app.listen(3000, () => {
  console.log('Server started on port 3000');
});