require('dotenv').config();
//! when we require like this, code inside this file will run so that why
//! passport will know that we want to use Google strategy.
//! Note that inside this file serialize/deserialize function will not run at the first time
//! and also this line (6) is only run one time when we type npm-run-server
require('./configs/passport-setup');
const express = require('express');
const app = express();
const authRoute = require('./routes/auth-routes');
const profileRoute = require('./routes/profile-routes');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');

//* set view engine
app.set('view engine', 'ejs');
//! use express-session instead of cookie-session in the course because the latter library has deprecated some
//! functionality that will case error. So this library is the alternative option
//! By the way, this middleware help us to manage our cookie and session (create session for us)
//! and also this middle can help us encrypt our session (if any)
app.use(session({ secret: process.env.cookieKey, cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

//! passport.initialize() is a middleware basically add passport instance
//! to incoming request, check if there's a session object, and if it exists, and filed passport exists in it 
//! (if not create one), assigns that object to session filed in passport
//! that why when we want to access session we have to type like this: req.session.passport
app.use(passport.initialize());
//! passport.session looks for user field ( this field automatically created by passport because passport was 
//! created for authentication so obviously named user), and if it finds one (if not then nothing happen), passes
//! it to deserialize function and call it. Deserialize assign the user field in session to request (if it find one
//! in session). This is why we can access user through request - req.user then the matched routed below fired
app.use(passport.session());

//* set routes
app.use('/auth', authRoute);
app.use('/profile', profileRoute);
app.get('/', (req, res) => res.render('home', { user: req.user }));

//* connect to database and listen to server
//! if not familiar with line 32 then refer to discord
mongoose.set('strictQuery', true);
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('connecting to database successfully...');
            console.log(`listening on PORT 3000...`);
        });
    })
    .catch((error) => {
        console.log(error);
    });
