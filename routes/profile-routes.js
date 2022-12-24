const router = require('express').Router();
const { authCheck } = require('../middleware/authCheck');

router.get('/', authCheck, (req, res) => {
    res.render(`profile`, { user: req.user });
});

module.exports = router;
