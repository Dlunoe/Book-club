function requireLogin(req, res, next){
    if(!req.session.user){
        req.session.message = "You must be logged in to do that"
        res.redirect('/users/login')
    }else{
        next();
    }
};

module.exports = requireLogin;