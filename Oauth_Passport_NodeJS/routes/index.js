// import dependencies
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/oauth');


// Home
router.get('/', (req, res) => {
    res.render("home");
})

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render("dashboard", {
        name: req.user.name
    });
})
module.exports = router;