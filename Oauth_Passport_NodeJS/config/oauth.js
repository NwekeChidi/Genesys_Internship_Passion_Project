module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()){
            return next();
        }
        req.flash('errorMsg', 'Please Login or Register if you do not have account yet!')
        res.redirect('/users/login');
    }
}