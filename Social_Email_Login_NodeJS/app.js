// import dependencies
const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();



// initialize express
const app = express();

// add ejs middleware
app.use(expressLayouts);
app.set('view engine', 'ejs')

// add bodyparser
app.use(express.urlencoded({ extended : false }));

// implement express session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
    //cookie: { secure: true }
}))


// middleware for passport
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

// middleware with global variables to save state
app.use( (req, res, next) => {
    res.locals.successMsg = req.flash("successMsg");
    res.locals.errorMsg = req.flash("errorMsg");
    res.locals.error = req.flash("error");
    next();
})

// add mongodb
const MONGODB_LOCAL_URI = process.env.MONGODB_LOCAL_URI;

// connect to db
mongoose.connect(MONGODB_LOCAL_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then( () => console.log("MongoDB connected"))
        .catch( err => console.error(err) );

// Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

// listen
const PORT = process.env.PORT || 8000;
app.listen(PORT, console.log(`Server is live on port: ${PORT}`))