// dependencies
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LinkedinStrategy = require('passport-linkedin-oauth2').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Load user model
const User = require('../models/User');

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // check user match
            User.findOne({ email: email})
                .then(user => {
                    if(!user){
                        return done(null, false, { message: "User with email does not exist"})
                    }
                    // check password match
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err;
                        if(isMatch) {
                            return done(null, user)
                        } else {
                            return done(null, false, { message: "Username or password incorrect"})
                        }
                    })
                })
                .catch( err => console.error(err))
        })
    );

    // facebook login
    passport.use(new FacebookStrategy({
        clientID        : process.env.FACEBOOK_APP_ID,
        clientSecret    : process.env.FACEBOOK_APP_SECRET,
        callbackURL     : process.env.CALLBACK_URL+"facebook/callback",
        profileFields   : ['id', 'displayName', 'name', 'picture.type(large)','email']

    },
    (token, refreshToken, profile, done) => {
        process.nextTick(() => {
            User.findOne({ 'social_id' : profile.id }, (err, user) => {
                if (err) return done(err);

                if (user) {
                    return done(null, user); 
                } else {
                    const newUser = new User();
                    newUser.social_id = profile._json.id;
                    newUser.name = profile._json.name;
                    newUser.email = profile._json.email;
                    newUser.social_photo_url = profile._json.picture.data.url;
                    [ newUser.social_provider, newUser.password ] = Array(2).fill(profile.provider);
                    // save user
                    newUser.save();
                }
            });
        })
    }))

    // google login
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL+"google/callback",
        passReqToCallback: true
    },
    (request, accessToken, refreshToken, profile, done) => {
        process.nextTick(() => {
            User.findOne({ 'social_id' : profile.id }, (err, user) => {
                if (err) return done(err);

                if (user) {
                    return done(null, user); 
                } else {
                    const newUser = new User();
                    newUser.social_id = profile.id;
                    newUser.name = profile._json.name;
                    newUser.email = profile._json.email;
                    newUser.social_photo_url = profile._json.picture;
                    [ newUser.social_provider, newUser.password ] = Array(2).fill(profile.provider);
                    // save user
                    newUser.save();
                }
            });
        })
    }))

    // linkedin login
    passport.use(new LinkedinStrategy({
        clientID: process.env.INSTAGRAM_APP_ID,
        clientSecret: process.env.INSTAGRAM_APP_SECRET,
        callbackURL: process.env.CALLBACK_URL+"instagram/callback",
        passReqToCallback: true
    },
    (token, tokenSecret, profile, done) => {
        console.log(profile)
        process.nextTick(() => {
            User.findOne({ 'social_id' : profile.id }, (err, user) => {
                if (err) return done(err);
                if (user) {
                    return done(null, user); 
                } else {
                    const newUser = new User();
                    newUser.social_id = profile.id;
                    newUser.name = profile._json.name;
                    newUser.email = profile._json.email;
                    newUser.social_photo_url = profile._json.picture;
                    [ newUser.social_provider, newUser.password ] = Array(2).fill(profile.provider);
                    // save user
                    newUser.save();
                }
            });
        })
    }))

    // instagram login
    passport.use(new InstagramStrategy({
        clientID        : process.env.FACEBOOK_APP_ID,
        clientSecret    : process.env.FACEBOOK_APP_SECRET,
        callbackURL     : process.env.CALLBACK_URL+"instagram/callback",
        profileFields   : ['id', 'displayName', 'name', 'picture.type(large)','email']

    },
    (token, refreshToken, profile, done) => {
        process.nextTick(() => {
            User.findOne({ 'social_id' : profile.id }, (err, user) => {
                if (err) return done(err);

                if (user) {
                    return done(null, user); 
                } else {
                    const newUser = new User();
                    newUser.social_id = profile._json.id;
                    newUser.name = profile._json.name;
                    newUser.email = profile._json.email;
                    newUser.social_photo_url = profile._json.picture.data.url;
                    [ newUser.social_provider, newUser.password ] = Array(2).fill(profile.provider);
                    // save user
                    newUser.save();
                }
            });
        })
    }))
    

    // serialize and deserialize user
    passport.serializeUser( (user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser( (id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        });
    });

}