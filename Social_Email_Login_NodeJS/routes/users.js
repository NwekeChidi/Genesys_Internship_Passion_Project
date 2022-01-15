// import dependencies
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport')

// import model
const User = require('../models/User')

// Register
router.get('/register', (req, res) => {
    res.render("register");
})
// Register handle
router.post('/register', (req, res) => {
    // get data
    const {
        name, email, password, confirmPassword
    } = req.body;


    //// VALIDATIONS
    let errors = [];

    // check required fields
    if (!name || !email || !password || !confirmPassword) errors.push({ msg : "Please Fill All Fields" });

    // check passwords match
    let pass1 = password !== confirmPassword, pass2 = password.length < 6;// pass3 = /[a-zA-Z\d\W]+/.test(password);
    if (pass1) errors.push({ msg: "Passwords do not match!" })
    if (pass2) errors.push({ msg : "Password must be at least 6 characters" });
    //if (!pass3) errors.push({ msg : "Password should contain at least a number, an uppercase letter and a symbol" })


    // send error if any
    if (errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            confirmPassword
        })
    } else {
        // Validation
        User.findOne({ email : email })
            .then( user => {
                if(user){
                    errors.push({ msg : `User with ${email} already exists!`})
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        confirmPassword
                    })
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    // Hash password using bcrypt
                    bcrypt.genSalt(15, (error, salt) => bcrypt.hash(newUser.password, salt, (error, hash) => {
                        if (error) throw error;
                        // set password to hashed password
                        newUser.password = hash;
                        // save user
                        newUser.save()
                            .then( user => {
                                req.flash('successMsg', 'Registration Successful!')
                                res.redirect('/users/login');
                            })
                            .catch(err => console.error(err));
                    }))
                }
            })
                .catch( err => console.error(err))
    }
})

// Login
router.get('/login', (req, res) => {
    res.render("login");
})

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('successMsg', 'Logout Successful!');
    res.redirect('/users/login');
})

// facebook
router.get('/auth/facebook', passport.authenticate('facebook', { scope: "email" } ))
router.get('/facebook/callback',
    (req, res, next) => {
        passport.authenticate('facebook', {
            successRedirect : process.env.BASE_CLIENT_URL,
            failureRedirect : '/users/register',
            failureFlash: true
        })(req, res, next);
    }
);

// google
router.get('/auth/google', passport.authenticate('google', { scope: ["profile", "email"] } ))
router.get('/google/callback',
    (req, res, next) => {
        passport.authenticate('google', {
            successRedirect : process.env.BASE_CLIENT_URL,
            failureRedirect : '/users/register',
            failureFlash: true
        })(req, res, next);
    }
);

// google
router.get('/auth/linkedin', passport.authenticate('linkedin', { scope: ["r_emailaddress", "r_liteprofile"] } ))
router.get('/linkedin/callback',
    (req, res, next) => {
        passport.authenticate('linkedin', {
            successRedirect : process.env.BASE_CLIENT_URL,
            failureRedirect : '/users/register',
            failureFlash: true
        })(req, res, next);
    }
);

// instagram
router.get('/auth/instagram', passport.authenticate('instagram', { scope: ["profile","email"] } ))
router.get('/instagram/callback',
    (req, res, next) => {
        passport.authenticate('instagram', {
            successRedirect : process.env.BASE_CLIENT_URL,
            failureRedirect : '/users/register',
            failureFlash: true
        })(req, res, next);
    }
);

module.exports = router;