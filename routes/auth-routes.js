const router = require('express').Router();
const passport = require('passport');

//* auth login
router.get('/login', (req, res) => {
    res.render('login', { user: req.user });
});

//* auth logout
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

//* auth with google
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    })
);

//* callback route for google to redirect
router.get('/google/redirect', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    console.log(req.session);
    res.redirect('/profile/');
});

module.exports = router;
