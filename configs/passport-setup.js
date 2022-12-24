require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User = require('../models/user-model');

//! When application run the first time, these two methods won't run because they just run when
//! the callback function in (passport.use) fired. But remember that callback only fired when
//! passport comeback with user data. Then when callback fired these two method will run
//! Note that: passport force us to use these two method to save user data to cookie
//! If we not use these two below methods: after it reach the done method in callback
//! it will display this error: 'Error: Failed to serialize user into session'
passport.serializeUser((user, done) => {
    console.log(`serialize`);
    //! what this done method do is to save our second parameter (userID) to session
    //! we can access this session like this: req.session.passport= {user: '..'}
    //! Note that: it won't call the deserialize function 
    //! until we re-access the page (either by refreshing or leaving and coming back)
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        console.log('deserialize');
        //! when we reach this done method this mean we has find our user
        //! so passport will automatically attaches this data to request
        //! that why we can access user data through request after this function fired
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy(
        {
            callbackURL: '/auth/google/redirect',
            clientID: keys.google.clientID,
            clientSecret: keys.google.clientSecret,
        },
        (accessToke, refreshToken, profile, done) => {
            //! when redirect it will fired this callback function first then the above function
            try {
                //* check if user has already exits in database or not
                User.findOne({ googleID: profile.id }).then((currentUser) => {
                    if (currentUser) {
                        console.log(`This user has already signup to our application`);
                        //! According to research, following authentication process in passport
                        //! after we reach this done function which mean that our user has authenticated
                        //! successfully, then passport will start to serialize our user data - which is
                        //! the serialize function above - so we can understand that this done function
                        //! is call the serialize function
                        done(null, currentUser);
                    } else {
                        console.log(profile);
                        new User({
                            userName: profile.displayName,
                            googleID: profile.id,
                            thumbnail: profile._json.picture,
                        })
                            .save()
                            .then((newUser) => {
                                //! work flow same to the explain above
                                done(null, newUser);
                            });
                    }
                });
            } catch (error) {
                console.log(error);
            }
        }
    )
);
